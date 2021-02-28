import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KitsuResponse } from '../models/kitsu-response.model';
import { Anime } from '../models/anime.model';

const kitsuBaseUrl = 'https://kitsu.io/api/edge';

@Injectable({
  providedIn: 'root'
})
export class KitsuService {

  public constructor(private http: HttpClient ) { }

  public getPopularAnime(): Observable<KitsuResponse> {
    return this.http.get<KitsuResponse>(`${kitsuBaseUrl}/anime?sort=popularityRank`);
  }

  public getAnime(slug: string): Observable<Anime> {
    return this.http.get<KitsuResponse>(`${kitsuBaseUrl}/anime?filter[slug]=${slug}`).pipe(map((response: KitsuResponse) => {
      return response.data[0];
    }));
  }
}
