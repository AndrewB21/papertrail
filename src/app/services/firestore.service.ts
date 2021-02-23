import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  public getWatchingAnimeSlugs(): Observable<string[]> {
    return this.afAuth.authState.pipe(switchMap((user) => {
      if (user) {
        return this.firestore.collection('UserAnime').doc(user.uid).collection('anime')
        .get()
        .pipe(
          map((querySnapshot) => {
            const animeSlugList: string[] = [];
            querySnapshot.forEach((doc) => {
                animeSlugList.push(doc.id);
              });
            return animeSlugList;
          }));
      } else {
        return null;
      }
    }));
  }
}
