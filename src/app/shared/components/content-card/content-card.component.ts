import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Anime } from 'src/app/models/anime.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.css']
})
export class ContentCardComponent implements OnInit {
  @Input() public anime: Anime;
  @Input() public index: number;
  @Output() public addToWatching = new EventEmitter<number>();
  @Output() public removeFromWatching = new EventEmitter<{popular: boolean, index: number, anime: Anime}>();
  public constructor(private firestoreService: FirestoreService) { }

  public ngOnInit(): void {
  }

  public addAnimeToWatching() {
    this.anime.watching = true;
    this.firestoreService.addAnimeToWatching(this.anime.attributes.slug);
    this.addToWatching.emit(this.index);
  }

  public removeAnimeFromWatching() {
    this.anime.watching = false;
    this.firestoreService.removeAnimeFromWatching(this.anime.attributes.slug);
    this.removeFromWatching.emit({popular: this.anime.attributes.popularityRank <= 10, index: this.index, anime: this.anime});
  }
}
