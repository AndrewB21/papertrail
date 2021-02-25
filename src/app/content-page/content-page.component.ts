import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anime } from '../models/anime.model';
import { FirestoreService } from '../services/firestore.service';
import { KitsuService } from '../services/kitsu.service';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.css']
})
export class ContentPageComponent implements OnInit {
  public anime: Anime;
  public watching: boolean;

  public constructor(private route: ActivatedRoute, private kitsuService: KitsuService, private firestoreService: FirestoreService) { }

  public ngOnInit(): void {
    // Get the anime slug from the current url. Using the route snapshot allows us
    // to retrieve our anime even if the user browses directly to the route without
    // using the apps router outlet.
    const animeSlug: string = this.route.snapshot.url[1].path;
    this.kitsuService.getAnime(animeSlug).subscribe((anime: Anime) => {
      this.anime = anime;
    });
    this.route.queryParams.subscribe((params) => {
      if (params.watching) {
        this.watching = params.watching;
      } else {
        // Use the slug in the url to check if the user is watching in the case that
        // they browsed directly to the content page and did not provide query params
        this.firestoreService.checkIfWatching(animeSlug).subscribe((watching) => {
          this.watching = watching;
        });
      }
    });
  }
}
