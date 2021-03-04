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
            console.log(this.kitsuService.watchingAnime);
            this.router.navigate(['/dashboard']);
          }
        });
      });
      watchingAnimeSubscription.unsubscribe();
    });
  }

  public errorCallback(errorData: FirebaseUISignInFailure) {
    console.log('Login failed.');
  }
}
