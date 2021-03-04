import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anime } from 'src/app/models/anime.model';
import { KitsuService } from 'src/app/services/kitsu.service';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-anime-search',
  templateUrl: './anime-search.component.html',
  styleUrls: ['./anime-search.component.css']
})
export class AnimeSearchComponent implements OnInit, AfterViewInit {
  public searchResults: Anime[];
  public containerClass = 'search-container collapsed';
  @ViewChild('input') public input: ElementRef;


  public constructor(
    private route: ActivatedRoute,
    private kitsuService: KitsuService) { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit() {
    // Use typeahead for realtime results as the user inputs their search
    const searchText: Observable<string> =
      fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
          map(event => event.target.value),
          startWith(''),
          debounceTime(700),
          distinctUntilChanged()
      );

    searchText.pipe(
      switchMap(search => {
        // Avoid passing along empty search strings to reduce API calls and allow for the container to
        // expand and collapse appropriately
        if (search !== '') {
          this.containerClass = 'search-container expanded';
          return this.kitsuService.searchForAnimeByText(search);

        } else {
          this.containerClass = 'search-container collapsed';
          return of(null);
        }
      })
    ).subscribe((result) => this.searchResults = result);
  }
}
