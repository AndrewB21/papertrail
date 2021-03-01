import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Anime } from 'src/app/models/anime.model';
import { KitsuService } from 'src/app/services/kitsu.service';

@Component({
  selector: 'app-anime-search',
  templateUrl: './anime-search.component.html',
  styleUrls: ['./anime-search.component.css']
})
export class AnimeSearchComponent implements OnInit {
  public animeSearch: FormGroup;
  public searchResults: Anime[];
  @Input() public watchingAnime: Anime[];

  public constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private kitsuService: KitsuService) { }

  public ngOnInit(): void {
    this.initializeForm();
  }

  public initializeForm(): void {
    this.animeSearch = this.formBuilder.group({
      searchText: '',
    });
  }

  public onSubmit(): void {
    this.kitsuService.searchForAnimeByText(this.animeSearch.value.searchText).subscribe((animeList: Anime[]) => {
      this.searchResults = animeList;
    });
  }
}
