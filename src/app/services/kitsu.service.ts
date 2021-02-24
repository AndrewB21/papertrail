import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KitsuResponse } from '../models/kitsu-response.model';
import { map } from 'rxjs/operators';

const kitsuBaseUrl = 'https://kitsu.io/api/edge';

@Injectable({
  providedIn: 'root'
})
export class KitsuService {

  public constructor(private http: HttpClient ) { }

  public queryAnimePopular() {
    return this.http.get(`${kitsuBaseUrl}/anime?sort=popularityRank`);
  }

  public getAnime(slug: string) {
    return this.http.get(`${kitsuBaseUrl}/anime?filter[slug]=${slug}`).pipe(map((response: KitsuResponse) => {
      return response.data[0];
    }));
  }

}
