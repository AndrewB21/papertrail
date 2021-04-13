import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/operators';
import { Anime } from '../models/anime.model';
import { KitsuService } from './kitsu.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private kitsuService: KitsuService
  ) { }

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

  public addAnimeToWatching(slug: string): Observable<Anime[]> {
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

    return this.kitsuService.getAnime(slug).pipe(map((animeResponse) => {
      this.kitsuService.watchingAnime.push(animeResponse);
      return this.kitsuService.watchingAnime;
    }));
  }

  public removeAnimeFromWatching(slug: string): Observable<Anime[]> {
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

    return this.kitsuService.getAnime(slug).pipe(map((animeResponse) => {
      const animeIndex = this.kitsuService.watchingAnime.findIndex(element => element.id === animeResponse.id);
      this.kitsuService.watchingAnime.splice(animeIndex, 1);
      return this.kitsuService.watchingAnime;
    }));
  }
}
