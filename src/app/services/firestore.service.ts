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

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  public addUserToUserAnime(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    const userAnimeCollection = this.firestore.collection('UserAnime');
    const user = signInSuccessData.authResult.user;
    // Create the document for our UserAnime collection based on the user's ID
    userAnimeCollection.doc(user.uid).set({});

    // Create empty docs to instantiate the anime and immersionEntries collections on the new UserAnime collection
    userAnimeCollection.doc(user.uid).collection('anime').doc('default').set({});
    userAnimeCollection.doc(user.uid).collection('immersionEntries').doc('default').set({});
  }

  public getWatchingAnimeSlugs(): Observable<string[]> {
    return this.afAuth.authState.pipe(switchMap((user) => {
      if (user) {
        return this.firestore
        .collection('UserAnime')
        .doc(user.uid)
        .collection('anime')
        .get()
        .pipe(
          map((querySnapshot) => {
            const animeSlugList: string[] = [];
            querySnapshot.forEach((doc) => {
                // Ignore the unfortunately necessary empty default documents on the anime collection
                if (doc.id !== 'default') {
                  animeSlugList.push(doc.id);
                }
              });
            return animeSlugList;
          }));
      } else {
        return null;
      }
    }));
  }

  public addAnimeToWatching(slug: string) {
    this.afAuth.authState.subscribe(user => {
      this.firestore.collection('UserAnime').doc(user.uid).collection('anime').doc(slug).set({
        timeWatched: 0,
        watching: true,
      });
    });
  }

  public removeAnimeFromWatching(slug: string) {
    this.afAuth.authState.subscribe(user => {
      this.firestore.collection('UserAnime').doc(user.uid).collection('anime').doc(slug).delete();
    });
  }

  public checkIfWatching(slug: string): Observable<boolean> {
    return this.afAuth.authState.pipe(switchMap((user) => {
        return this.firestore.collection('UserAnime')
        .doc(user.uid)
        .collection('anime')
        .doc(slug)
        .get()
        .pipe(
          map((response) => {
            const watching: boolean = response.exists;
            return watching;
          }));
    }));
  }
}
