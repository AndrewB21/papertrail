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
  public popularAnime: Anime[];
  public watchingAnime: Anime[];
  public constructor(private route: ActivatedRoute, private firestoreService: FirestoreService, private kitsuService: KitsuService) { }

  public ngOnInit(): void {
    this.watchingAnime = this.kitsuService.watchingAnime;
    this.popularAnime = this.route.snapshot.data['popularAnime'];
  }

  public removeFromWatching(animeSlug: string): void {
    this.firestoreService.removeAnimeFromWatching(animeSlug).subscribe((updatedWatchingAnime) => {
      this.watchingAnime = updatedWatchingAnime;
    })
  }

  public setAnimeTitle(anime: Anime) {
    let animeTitle = '';
    const animeTitles = anime.attributes.titles;
    if (animeTitles.en !== undefined) {
      animeTitle = animeTitles.en;
    } else if (animeTitles.en_us !== undefined) {
      animeTitle = animeTitles.en_us;
    } else if (animeTitles.en_jp !== undefined) {
      animeTitle = animeTitles.en_jp;
    } else {
      animeTitle = animeTitles.ja_jp;
    }
    return animeTitle;
  }
}
