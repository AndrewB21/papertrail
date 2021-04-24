import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anime } from '../models/anime.model';
import { FirestoreService } from '../services/firestore.service';
import { KitsuService } from '../services/kitsu.service';

@Component({
  selector: 'app-content-browser',
  templateUrl: './content-browser.component.html',
  styleUrls: ['./content-browser.component.css']
})
export class ContentBrowserComponent implements OnInit {
  public watchingAnime: Anime[];
  public popularAnime: Anime[];
  public highestRatedAnime: Anime[];
  public topCurrentAnime: Anime[];

  public constructor(private route: ActivatedRoute, private firestoreService: FirestoreService, private cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.watchingAnime = this.firestoreService.watchingAnime;
    this.popularAnime = this.route.snapshot.data['popularAnime'];
    this.highestRatedAnime = this.route.snapshot.data['highestRatedAnime'];
    this.topCurrentAnime = this.route.snapshot.data['topCurrentAnime'];
  }

  public onAnimeUpdated(updatedAnime: Anime) {
    const animeArrays = [this.watchingAnime, this.popularAnime, this.highestRatedAnime, this.topCurrentAnime];
    animeArrays.forEach((animeArray) => {
      this.firestoreService.updateCommonAnimeWatchingStatus(animeArray, updatedAnime);
    });
  }

}
