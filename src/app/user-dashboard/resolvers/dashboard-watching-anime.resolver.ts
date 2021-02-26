import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KitsuService } from '../../services/kitsu.service';
import { Anime } from '../../models/anime.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardWatchingAnimeResolver implements Resolve<Anime[]> {

  public constructor(private kitsuService: KitsuService, private firestoreService: FirestoreService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Anime[]> {
    return this.firestoreService.getWatchingAnimeSlugs().pipe(map((animeSlugList: {}) => {
      const watchingAnime: Anime[] = [];
      for (const [animeSlug, watching] of Object.entries(animeSlugList)) {
        if (watching === true) {
          this.kitsuService.getAnime(animeSlug).subscribe((anime: Anime) => {
            anime.watching = true;
            watchingAnime.push(anime);
          });
        }
      }
      return watchingAnime;
    })).pipe(take(1));
  }
}
