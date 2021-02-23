import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { KitsuService } from '../../services/kitsu.service';
import { Anime } from '../../models/anime.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardPopularAnimeResolver implements Resolve<Anime[]> {

  public constructor(private kitsuService: KitsuService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.kitsuService.queryAnimePopular();
  }
}
