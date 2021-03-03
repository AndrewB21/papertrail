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
  @Output() public addToWatching = new EventEmitter<null>();
  @Output() public removeFromWatching = new EventEmitter<Anime>();

  public constructor(private firestoreService: FirestoreService, private kitsuService: KitsuService, private cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {
    if (this.anime.watching === undefined) {
      this.kitsuService.setAnimeWatchingStatus(this.anime);
    }
  }

  public ngAfterViewChecked(): void {
  }

  public addAnimeToWatching() {
    this.anime.watching = true;
    this.firestoreService.addAnimeToWatching(this.anime.attributes.slug);
    this.addToWatching.emit();

    // Update the watchingAnime list in KitsuService
    this.kitsuService.watchingAnime.push(this.anime);
  }

  public removeAnimeFromWatching() {
    this.anime.watching = false;
    this.firestoreService.removeAnimeFromWatching(this.anime.attributes.slug);
    this.removeFromWatching.emit(this.anime);

    // Update the watchingAnime list in KitsuService
    const kitsuServiceAnimeIndex = this.kitsuService.watchingAnime.findIndex(element => element.id === this.anime.id);
    this.kitsuService.watchingAnime.splice(kitsuServiceAnimeIndex, 1);
  }
}
