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

  public onRemoveAnime(anime: Anime) {
    if (anime.attributes.popularityRank < 6) {
      const removedAnime = this.popularAnime.find(element => element.id === anime.id);
      removedAnime.watching = false;
    }
  }
}
