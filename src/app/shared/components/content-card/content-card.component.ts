import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { Anime } from 'src/app/models/anime.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { KitsuService } from 'src/app/services/kitsu.service';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.css']
})
export class ContentCardComponent implements OnInit, AfterViewChecked {
  @Input() public anime: Anime;
  @Input() public index: number;
  @Input() public watchingAnime: Anime[];
  @Output() public addToWatching = new EventEmitter<null>();
  @Output() public removeFromWatching = new EventEmitter<null>();

  public constructor(private firestoreService: FirestoreService, private kitsuService: KitsuService, private cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {
  }

  public ngAfterViewChecked(): void {
    // Initialize the anime's watching status if it has not already been initialized by a parent component.
    // We use ngAfterViewChecked to wait for the watchingAnime array to be initialized propertly before
    // performing the check and initialization
    if (this.watchingAnime !== undefined && this.anime.watching === undefined) {
      this.anime.watching = this.kitsuService.getWatchingAnime().some(element => element.id === this.anime.id);
      this.cdRef.detectChanges();
    }
  }

  public addAnimeToWatching() {
    this.anime.watching = true;
    this.firestoreService.addAnimeToWatching(this.anime.attributes.slug);
    this.addToWatching.emit();

    // Update the watchingAnime list in KitsuService
    this.kitsuService.getWatchingAnime().push(this.anime);
  }

  public removeAnimeFromWatching() {
    this.anime.watching = false;
    this.firestoreService.removeAnimeFromWatching(this.anime.attributes.slug);
    this.removeFromWatching.emit();

    // Update the watchingAnime list in KitsuService
    const kitsuServiceAnimeIndex = this.kitsuService.getWatchingAnime().findIndex(element => element.id === this.anime.id);
    this.kitsuService.getWatchingAnime().splice(kitsuServiceAnimeIndex, 1);
  }
}
