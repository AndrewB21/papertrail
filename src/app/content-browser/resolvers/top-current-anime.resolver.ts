import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KitsuService } from '../../services/kitsu.service';
import { Anime } from '../../models/anime.model';
import { KitsuResponse } from 'src/app/models/kitsu-response.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TopCurrentAnimeResolver implements Resolve<Anime[]> {

  public constructor(private kitsuService: KitsuService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Anime[]> {
    return  this.kitsuService.getTopCurrentAnime().pipe(map(animeList => animeList));
  }
}
