import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KitsuService } from '../../services/kitsu.service';
import { Anime } from '../../models/anime.model';
import { KitsuResponse } from 'src/app/models/kitsu-response.model';
import { map } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardPopularAnimeResolver implements Resolve<Anime[]> {

  public constructor(private kitsuService: KitsuService, private firestoreService: FirestoreService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.kitsuService.queryAnimePopular().pipe(map((animeList: KitsuResponse) => {
      animeList.data.forEach((anime: Anime) => {
        this.firestoreService.checkIfWatching(anime.attributes.slug).subscribe((watching) => {
          if (watching === true) {
            anime.watching = true;
          } else {
            anime.watching = false;
          }
        });
      });
      console.log(animeList);
      return animeList;
    }));
  }
}
