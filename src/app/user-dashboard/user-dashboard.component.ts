import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anime } from '../models/anime.model';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  public authenticated: boolean;
  public popularAnime: Anime[];
  public watchingNow: Anime[];
  public recommendedAnime: Anime[];
  public constructor(private route: ActivatedRoute, private firestoreService: FirestoreService) { }

  public ngOnInit(): void {
    this.authenticated = this.route.snapshot.data['authenticated'];
    this.watchingNow = this.route.snapshot.data['watchingNow'];
    this.firestoreService.getWatchingAnimeSlugs().subscribe((watchingAnimeSlugs) => {
      this.popularAnime = this.route.snapshot.data['popularAnime'].map((anime) => {
        if (watchingAnimeSlugs[anime.attributes.slug] === true) {
          anime.watching = true;
        } else {
          anime.watching = false;
        }
        return anime;
      });
    });
  }

  public onUnsubscribe(event: {popular: boolean, index: number, anime: Anime}) {
    this.watchingNow.splice(event.index, 1);

    // Ensure that the content card for the same anime in the "Popular" section is also updated
    // with the "false" watching status.
    if (event.popular) {
      this.popularAnime[this.popularAnime.findIndex(element => element.id === event.anime.id)].watching = false;
    }
  }

  // Handle unsubscrbing from an anime from the "Popular" section and ensure that the anime is
  // removed from the "Watching Now" section.
  public onUnsubscribeFromPopular(event: {popular: boolean, index: number, anime: Anime}) {
    this.watchingNow.splice(this.watchingNow.findIndex(element => element.id === event.anime.id), 1);
  }

  public onSubscribe(index: number) {
    this.watchingNow.push(this.popularAnime[index]);
  }
}
