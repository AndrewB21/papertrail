import { Component, Input, OnInit } from '@angular/core';
import { Anime } from '../models/anime.model';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.css']
})
export class ContentCardComponent implements OnInit {
  @Input() public anime: Anime;
  public watching: boolean;
  constructor(private firestoreService: FirestoreService) { }

  public ngOnInit(): void {
    this.firestoreService.checkIfWatching(this.anime.attributes.slug).subscribe((watching) => {
      this.watching = watching;
    });
  }

  public addAnimeToWatching() {
    this.firestoreService.addAnimeToWatching(this.anime.attributes.slug);
  }

  public removeAnimeFromWatching() {
    this.firestoreService.removeAnimeFromWatching(this.anime.attributes.slug);
  }
}
