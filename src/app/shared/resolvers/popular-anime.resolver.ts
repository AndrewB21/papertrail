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
export class PopularAnimeResolver implements Resolve<Anime[]> {

  public constructor(private kitsuService: KitsuService, private firestoreService: FirestoreService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.kitsuService.getPopularAnime().pipe(map((animeList: KitsuResponse) => {
      return animeList.data;
    }));
  }
}
