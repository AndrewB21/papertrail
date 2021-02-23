import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anime } from '../models/anime.model';

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
  public constructor(private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.authenticated = this.route.snapshot.data['authenticated'];
    this.popularAnime = this.route.snapshot.data['popularAnime'].data;
  }
}
