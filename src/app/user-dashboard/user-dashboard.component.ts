import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Anime } from '../models/anime.model';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  public watchingAnime: Anime[];
  public watchList: Anime[];
  public finishedAnime: Anime[];
  public AnimeLists;
  public ScreenSizes; 
  public DashboardFlexSizes;
  public currentScreenSize;
  public dashboardFlexSize;
  public selectedAnimeList;
  public selectedListClass = 'header-link selected';

  public constructor(
    private firestoreService: FirestoreService,
    private bpObserver: BreakpointObserver,
  ) { }

  public ngOnInit(): void {
    this.watchingAnime = this.firestoreService.watchingAnime;
    // Create and freeze enums/constants

    this.ScreenSizes = {
      MOBILE: 'mobile',
      SMALL: 'small',
      MEDIUM: 'medium',
      LARGE: 'large',
      XLARGE: 'xlarge',
    };

    this.DashboardFlexSizes = {
      MOBILE: '100%',
      SMALL: '100%',
      MEDIUM: '100%',
      LARGE: '80%',
      XLARGE: '80%',
    };

    this.AnimeLists = {
      WATCHING: 'watching',
      WATCHLIST: 'watchList',
      FINISHED: 'finished',
    }

    Object.freeze(this.ScreenSizes);
    Object.freeze(this.DashboardFlexSizes);
    Object.freeze(this.AnimeLists);

    this.selectedAnimeList = this.watchingAnime;

    // TODO 
    // Continue work on breakpoints
    // Create constants for image sizes, header text sizes, etc. for responsiveness
    // TODO
    this.bpObserver.observe(['(max-width: 1920px)', '(max-width: 1368px)', '(max-width: 900px)', '(max-width: 450px)']).subscribe((result) => {
      const breakpoints = result.breakpoints;
      if (breakpoints['(max-width: 450px)']) {
        this.currentScreenSize = this.ScreenSizes.MOBILE;
        this.dashboardFlexSize = this.DashboardFlexSizes.MOBILE;
      } else if (breakpoints['(max-width: 900px)']) {
        this.currentScreenSize = this.ScreenSizes.SMALL;
        this.dashboardFlexSize = this.DashboardFlexSizes.SMALL;
      } else if (breakpoints['(max-width: 1368px)']) {
        this.currentScreenSize = this.ScreenSizes.MEDIUM;
        this.dashboardFlexSize = this.DashboardFlexSizes.MEDIUM;
      } else if (breakpoints['(max-width: 1920px)']) {
        this.currentScreenSize = this.ScreenSizes.LARGE;
        this.dashboardFlexSize = this.DashboardFlexSizes.LARGE;
      } else {
        this.currentScreenSize = this.ScreenSizes.XLARGE;
        this.dashboardFlexSize = this.DashboardFlexSizes.XLARGE;
      }
    });
  }

  public addToList(animeSlug: string, listName: string, ): void {
    this.firestoreService.addAnimeToList(animeSlug, listName).subscribe();
  }

  public removeFromList(animeSlug: string, listName: string): void {
    this.firestoreService.removeAnimeFromList(animeSlug, listName).subscribe();
  }

  public moveToNewList(animeSlug: string, sourceListName: string, destinationListName: string): void {
    this.firestoreService.removeAnimeFromList(animeSlug, sourceListName).subscribe();
    this.firestoreService.addAnimeToList(animeSlug, destinationListName).subscribe();
  }

  public addToWatching(animeSlug: string): void {
    this.firestoreService.addAnimeToList(animeSlug, 'watching').subscribe((res) => {
      if (res) {
        alert('Ok');
      }
    })
  }

  public addToWatchList(animeSlug: string): void {
    this.firestoreService.addAnimeToList(animeSlug, 'watchList').subscribe((res) => {
      if (res) {
        this.watchList = res;
      }
    })
  }

  public setAnimeTitle(anime: Anime) {
    let animeTitle = '';
    const animeTitles = anime.attributes.titles;
    if (animeTitles.en !== undefined) {
      animeTitle = animeTitles.en;
    } else if (animeTitles.en_us !== undefined) {
      animeTitle = animeTitles.en_us;
    } else if (animeTitles.en_jp !== undefined) {
      animeTitle = animeTitles.en_jp;
    } else {
      animeTitle = animeTitles.ja_jp;
    }
    return animeTitle;
  }

  public setSelectedAnimeList(selectedList: string) {
    switch (selectedList) {
      case this.AnimeLists.WATCHING:
        this.selectedAnimeList = this.watchingAnime;
        break;
      case this.AnimeLists.WATCHLIST:
        if (!this.watchList) {
          this.firestoreService.initializeList(this.AnimeLists.WATCHLIST);
          this.watchList = this.firestoreService.watchList;
          this.selectedAnimeList = this.watchList;
        } else {
          this.selectedAnimeList =  this.watchList;
        }
        break;
      case this.AnimeLists.FINISHED:
        if (!this.finishedAnime) {
          this.firestoreService.initializeList(this.AnimeLists.FINISHED);
          this.finishedAnime = this.firestoreService.finishedAnime;
          this.selectedAnimeList = this.finishedAnime;
        } else {
          this.selectedAnimeList = this.finishedAnime
        }
        break;
      default:
        break;
    }
  }

  public setDropdownMenuOptions(anime: Anime): any {
    const options = {
      watching: [
        {
          text: 'Remove from Watching',
          list: this.AnimeLists.WATCHING,
          action: () => { this.removeFromList(anime.attributes.slug, this.AnimeLists.WATCHING); }
        }, 
        {
          text: 'Move to Watch List',
          action: () => { this.moveToNewList(anime.attributes.slug, this.AnimeLists.WATCHING, this.AnimeLists.WATCHLIST) }
        }, 
        {
          text: 'Move to Finished',
          action: () => { this.moveToNewList(anime.attributes.slug, this.AnimeLists.WATCHING, this.AnimeLists.FINISHED) }
        }, 
      ],
      watchList: [
        {
          text: 'Remove from Watch List',
          action: () => { this.removeFromList(anime.attributes.slug, this.AnimeLists.WATCHLIST); }
        },
        {
          text: 'Move to Watching',
          action: () => { this.moveToNewList(anime.attributes.slug, this.AnimeLists.WATCHLIST, this.AnimeLists.WATCHING) }
        },
        {
          text: 'Move to Finished',
          action: () => { this.moveToNewList(anime.attributes.slug, this.AnimeLists.WATCHLIST, this.AnimeLists.FINISHED) }
        }
      ],
      finished: [
        {
          text: 'Remove from Finished',
          action: () => { this.removeFromList(anime.attributes.slug, this.AnimeLists.FINISHED); }
        },
        {
          text: 'Move to Watching',
          action: () => { this.moveToNewList(anime.attributes.slug, this.AnimeLists.FINISHED, this.AnimeLists.WATCHING) }
        },
        {
          text: 'Move to Watch List',
          action:  () => { this.moveToNewList(anime.attributes.slug, this.AnimeLists.FINISHED, this.AnimeLists.WATCHLIST) }
        }
      ]
    }

    try {
      switch (this.selectedAnimeList) {
        case this.watchList:
          return options.watchList;
        case this.watchingAnime:
          return options.watching;
        case this.finishedAnime:
          return options.finished;
        default: 
          throw new Error('An error occurred while setting the options.')
      }
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

}
