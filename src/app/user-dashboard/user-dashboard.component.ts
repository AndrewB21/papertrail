import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anime } from '../models/anime.model';
import { FirestoreService } from '../services/firestore.service';
import { KitsuService } from '../services/kitsu.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  public authenticated: boolean;
  public popularAnime: Anime[];
  public watchingAnime: Anime[];
  public watchingAnimeSlugs: {};
  public recommendedAnime: Anime[];
  public constructor(private route: ActivatedRoute, private firestoreService: FirestoreService, private kitsuService: KitsuService) { }

  public ngOnInit(): void {
    this.authenticated = this.route.snapshot.data['authenticated'];
    const watchingAnimeObservable = this.firestoreService.getWatchingAnimeSlugs().subscribe((watchingAnimeSlugs: {}) => {
      this.initializePopularAnime(watchingAnimeSlugs);
      this.initializeWatchingAnime(watchingAnimeSlugs);
      watchingAnimeObservable.unsubscribe();
    });
  }

  public setAnimeWatchingStatus(watchingAnimeSlugs: {}, anime: Anime) {
    if (watchingAnimeSlugs[anime.attributes.slug] === true) {
      anime.watching = true;
    } else {
      anime.watching = false;
    }
  }

  public initializePopularAnime(watchingAnimeSlugs: {}) {
    this.popularAnime = this.route.snapshot.data['popularAnime'].map((anime) => {
        this.setAnimeWatchingStatus(watchingAnimeSlugs, anime);
        return anime;
      });
      this.kitsuService.setPopularAnime(this.popularAnime);
  }

  public initializeWatchingAnime(watchingAnimeSlugs: {}) {
      for (const [animeSlug, watchingStatus] of Object.entries(watchingAnimeSlugs)) {
        this.kitsuService.getAnime(animeSlug).subscribe((anime) => {
          this.setAnimeWatchingStatus(watchingAnimeSlugs, anime);
          if (anime.watching === true) {
            this.kitsuService.getWatchingAnime().push(anime);
            this.watchingAnime = this.kitsuService.getWatchingAnime();
          }
        });
    }
  }

  public onWatchingAnimeUpdate() {
    this.watchingAnime = this.kitsuService.getWatchingAnime();
  }
}
