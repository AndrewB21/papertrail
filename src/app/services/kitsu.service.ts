import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { KitsuResponse } from '../models/kitsu-response.model';
import { Anime } from '../models/anime.model';
import { FirestoreService } from './firestore.service';

const kitsuBaseUrl = 'https://kitsu.io/api/edge';

@Injectable({
  providedIn: 'root'
})
export class KitsuService {

  public constructor(private http: HttpClient) { }

  public getPopularAnimeFromKitsu(): Observable<Anime[]> {
    return this.http.get<KitsuResponse>(`${kitsuBaseUrl}/anime?page[limit]=5&sort=popularityRank`).pipe(map((response: KitsuResponse) => {
      return response.data;
    }));
  }

  public getTopCurrentAnime(): Observable<Anime[]> {
    return this.http.get<KitsuResponse>(`${kitsuBaseUrl}/anime?page[limit]=5&sort=-averageRating&filter[status]=current`)
    .pipe(map((response: KitsuResponse) => {
        return response.data;
    }));
  }

  public getHighestRatedAnime(): Observable<Anime[]> {
    return this.http.get<KitsuResponse>(`${kitsuBaseUrl}/anime?page[limit]=5&sort=ratingRank`)
    .pipe(map((response: KitsuResponse) => {
        return response.data;
    }));
  }

  public getAnime(slug: string): Observable<Anime> {
    return this.http.get<KitsuResponse>(`${kitsuBaseUrl}/anime?filter[slug]=${slug}`).pipe(map((response: KitsuResponse) => {
      return response.data[0];
    }));
  }

  public getMultipleAnimeBySlugs(slugs: string[]): Observable<Anime>[] {
    return slugs.map((slug) => {
      return this.getAnime(slug);
    });
  }

  public searchForAnimeByText(searchText: string): Observable<Anime[]> {
    return this.http.get<KitsuResponse>(`${kitsuBaseUrl}/anime?page[limit]=5&filter[text]=${searchText}`)
      .pipe(map((response: KitsuResponse) => {
        return response.data;
      }));
  }
}
