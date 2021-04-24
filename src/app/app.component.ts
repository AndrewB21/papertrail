import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
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
  public loadingMessageClass = "loading-msg"
  public displayLoadingMessage = false;

  public constructor (
    private kitsuService: KitsuService,
    private firestoreService: FirestoreService,
    private authenticationService: AuthenticationService,
    private afAuth: AngularFireAuth,
  ) { }

  public ngOnInit() {
    setTimeout(() => {
      if(!this.initialized) {
        this.loadingMessageClass = "loading-msg active-msg"
      }
    }, 700)
    const appInitializationObservable = this.authenticationService.checkAuthState().subscribe((result) => {
      if (result) {
          const watchingAnimeSubscription = this.firestoreService.getSlugsFromList('watching').subscribe((watchingAnimeSlugs) => {
            // Initialize the watching anime array in the kitsuService
            if (Object.keys(watchingAnimeSlugs).length === 0) {
              // Ensure that the watchingAnime array is defined even when no anime have been added to the "watching" array.
              this.firestoreService.watchingAnime = [];
              this.initialized = true;
            } else {
              this.kitsuService.getMultipleAnimeBySlugs(Object.keys(watchingAnimeSlugs)).forEach((animeObservable) => {
                animeObservable.subscribe((anime) => {
                    // Define the watchingAnime array if it hasn't been defined yet, otherwise just push to it.
                    if (!this.firestoreService.watchingAnime) {
                      this.firestoreService.watchingAnime = [anime];
                    } else {
                      this.firestoreService.watchingAnime.push(anime);
                    }
                  
                  // Check if we have reached the end of the anime slugs list, and mark initilization as completed if so.
                  // This prevents the app from loading before the watching anime list is defined, which leads to errors.
                  if (Object.keys(watchingAnimeSlugs).slice(-1)[0] === anime.attributes.slug) {
                    this.initialized = true;
                  }
                });
              });
            }
            watchingAnimeSubscription.unsubscribe();
            appInitializationObservable.unsubscribe();
          });
        } else {
          // Initialize app and unsubscribe from the observable as the login component will handle initialization if a sign in occurs
          this.initialized = true;
          appInitializationObservable.unsubscribe();
      }
    });
  }
}
