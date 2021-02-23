import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const kitsuBaseUrl = 'https://kitsu.io/api/edge';

@Injectable({
  providedIn: 'root'
})
export class KitsuService {

  constructor(private http: HttpClient ) { }

  public queryAnimePopular() {
    return this.http.get(`${kitsuBaseUrl}/anime?sort=popularityRank`);
  }
}
