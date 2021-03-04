import { Component, OnInit } from '@angular/core';
import { observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { FirestoreService } from './services/firestore.service';
import { KitsuService } from './services/kitsu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'PaperTrail';
  public initialized = false;

  public constructor (
    private kitsuService: KitsuService,
    private firestoreService: FirestoreService,
    private authenticationService: AuthenticationService
  ) { }

  public ngOnInit() {
    const appInitializationObservable = this.authenticationService.checkAuthState().subscribe((result) => {
      if (result) {
        const watchingAnimeSubscription = this.firestoreService.getWatchingAnimeSlugs().subscribe((watchingAnimeSlugs) => {
          this.kitsuService.setWatchingAnimeSlugs(watchingAnimeSlugs);

          // Initialize the watching anime array in the kitsuService
          this.kitsuService.getMultipleAnimeBySlugs(Object.keys(watchingAnimeSlugs)).forEach((animeObservable) => {
            animeObservable.subscribe((anime) => {
              this.kitsuService.setAnimeWatchingStatus(anime);

              if (anime.watching === true) {
                this.kitsuService.watchingAnime.push(anime);
              }

              if (Object.keys(watchingAnimeSlugs).slice(-1)[0] === anime.attributes.slug) {
                this.initialized = true;
              }
            });
          });
          watchingAnimeSubscription.unsubscribe();
        });
      } else {
        // Initialize app and unsubscribe from the observable as the login component will handle initialization if a sign in occurs
        this.initialized = true;
        appInitializationObservable.unsubscribe();
      }
    });
  }
}
