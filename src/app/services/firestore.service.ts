import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  public addUserToUserAnime(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    const userAnimeCollection = this.firestore.collection('UserAnime');
    const user = signInSuccessData.authResult.user;
    // Create the document for our UserAnime collection based on the user's ID
    userAnimeCollection.doc(user.uid).set({});

    // Create empty docs to instantiate the anime and immersionEntries collections on the new UserAnime collection
    userAnimeCollection.doc(user.uid).collection('anime').doc('watching').set({});
    userAnimeCollection.doc(user.uid).collection('immersionEntries').doc('default').set({});
  }

  public getImmersionEntries(animeSlug: string): Observable<{}> {
    return this.afAuth.authState.pipe(map((user) => {
      if (user) {
        return this.firestore
          .collection('UserAnime')
          .doc(user.uid)
          .collection('immersionEntries')
          .doc(animeSlug)
      } else {
        return null;
      }
    }))
  }

  public getWatchingAnimeSlugs(): Observable<{}> {
    return this.afAuth.authState.pipe(switchMap((user) => {
      if (user) {
        return this.firestore
        .collection('UserAnime')
        .doc(user.uid)
        .collection('anime')
        .doc('watching')
        .valueChanges()
        .pipe(
          map((animeSlugList: {}) => {
            return animeSlugList;
          }));
      } else {
        return null;
      }
    }));
  }

  public addAnimeToWatching(slug: string) {
    this.afAuth.authState.subscribe(user => {
      this.firestore
      .collection('UserAnime')
      .doc(user.uid)
      .collection('anime')
      .doc('watching')
      .set(
        { [slug]: true },
        { merge: true }
      );
    });
  }

  public removeAnimeFromWatching(slug: string) {
    this.afAuth.authState.subscribe(user => {
      this.firestore
      .collection('UserAnime')
      .doc(user.uid)
      .collection('anime')
      .doc('watching')
      .set(
        { [slug]: false },
        { merge: true }
      );
    });
  }
}
