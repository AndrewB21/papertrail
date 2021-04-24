import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { FirestoreService } from '../services/firestore.service';
import { KitsuService } from '../services/kitsu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public constructor(private router: Router, private firestoreService: FirestoreService, private kitsuService: KitsuService) { }

  public ngOnInit(): void {
  }

  public successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    if (signInSuccessData.authResult.additionalUserInfo.isNewUser) {
      this.firestoreService.addUserToUserAnime(signInSuccessData);
    }

    // Initialize watching anime and navigate to the dashboard when finished
    const watchingAnimeSubscription = this.firestoreService.getSlugsFromList('watching').subscribe((watchingAnimeSlugs) => {
      // Initialize the watching anime array in the kitsuService
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
            this.router.navigate(['/']);
          }
        });
      });
      watchingAnimeSubscription.unsubscribe();
    });
  }

  public errorCallback(errorData: FirebaseUISignInFailure) {
    console.warn('Login failed.');
  }
}
