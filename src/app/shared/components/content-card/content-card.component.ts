import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { Anime } from 'src/app/models/anime.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { KitsuService } from 'src/app/services/kitsu.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.css']
})
export class ContentCardComponent implements OnInit, AfterViewChecked {
  @Input() public anime: Anime;
  @Input() public index: number;
  @Output() public animeUpdated = new EventEmitter<Anime>();
  @Output() public addToWatching = new EventEmitter<null>();
  @Output() public removeFromWatching = new EventEmitter<Anime>();
  public authenticated: boolean;
  public cardTitle: string;
  public descriptionHeight: string;

  public constructor(
    private firestoreService: FirestoreService,
    private snackbarService: SnackBarService,
    private authenticationService: AuthenticationService,
  ) { }

  public ngOnInit(): void {
    this.authenticationService.checkAuthState().subscribe((result) => { 
      if(result) {
        this.authenticated = true;
        if (this.anime.watching === undefined) {
          this.anime.watching = this.firestoreService.watchingAnime.find(element => element.id === this.anime.id) ? true : false;
        }
        this.descriptionHeight = '53%';
      } else {
        this.authenticated = false;
        this.descriptionHeight = '80%';
      }
    })
    
    // Set the card title, trying different variations of the English titles first, and defaulting to the
    // fully Japanese title if an english title does not exist.
    const animeTitles = this.anime.attributes.titles;
    if (animeTitles.en !== undefined) {
      this.cardTitle = animeTitles.en;
    } else if (animeTitles.en_us !== undefined) {
      this.cardTitle = animeTitles.en_us;
    } else if (animeTitles.en_jp !== undefined) {
      this.cardTitle = animeTitles.en_jp;
    } else {
      this.cardTitle = animeTitles.ja_jp;
    }
  }

  public ngAfterViewChecked(): void {
  }

  public addAnimeToWatching() {
    this.anime.watching = true;
    this.firestoreService.addAnimeToList(this.anime.attributes.slug, 'watching').subscribe((res) => {
      if (res) {
        this.animeUpdated.emit(this.anime);
        this.snackbarService.openSnackBar("Successfully added anime to watching.");
      }
    })
  }

  public removeAnimeFromWatching() {
    this.anime.watching = false;
    this.firestoreService.removeAnimeFromList(this.anime.attributes.slug, 'watching');
    this.animeUpdated.emit(this.anime);

    // Update the watchingAnime list in KitsuService
    const kitsuServiceAnimeIndex = this.firestoreService.watchingAnime.findIndex(element => element.id === this.anime.id);
    this.firestoreService.watchingAnime.splice(kitsuServiceAnimeIndex, 1);

    this.snackbarService.openSnackBar("Successfully removed anime from watching.");
  }
}
