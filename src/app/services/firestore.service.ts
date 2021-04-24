import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { element } from 'protractor';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/operators';
import { Anime } from '../models/anime.model';
import { KitsuService } from './kitsu.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public validListNames = ['watching', 'watchList', 'finished']
  public watchingAnime: Anime[];
  public watchList: Anime[] = [];
  public finishedAnime: Anime[] = [];

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
    userAnimeCollection.doc(user.uid).collection('anime').doc('watchList').set({});
    userAnimeCollection.doc(user.uid).collection('anime').doc('finished').set({});
    userAnimeCollection.doc(user.uid).collection('immersionEntries').doc('default').set({});
  }

  // Update watching status of anime that are common accross different arrays when it is updated in one array
  // (i.e updating the watching of an anime that appears in the most popular and highest rated anime arrays
  // in the content browser)
  public updateCommonAnimeWatchingStatus(animeListToCheck: Anime[], updatedAnime: Anime): boolean {
    const animeIndex = animeListToCheck.findIndex(element => element.id === updatedAnime.id);
    if (animeIndex !== -1) {
      animeListToCheck[animeIndex].watching = updatedAnime.watching;
      return true;
    } else {
      return false;
    }
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

  public getSlugsFromList(listName: string): Observable<{}> {
    if (this.validListNames.find(element => element === listName)) {
      return this.afAuth.authState.pipe(switchMap((user) => {
        if (user) {
          return this.firestore
          .collection('UserAnime')
          .doc(user.uid)
          .collection('anime')
          .doc(listName)
          .valueChanges()
          .pipe(
            map((animeSlugList: {}) => {
              // Filter the slug list to only return the anime that are marked 'true' for this list
              let trueSlugs = {};
              for (const [slug, status] of Object.entries(animeSlugList)) {
                if (status) {
                  trueSlugs[slug] = true;
                }
              }
              return trueSlugs;
            }));
        } else {
          return null;
        }
      }));
    } else {
      return null;
    }
    
  }

  public addAnimeToList(slug: string, listName: string): Observable<Anime[]> {
    try {
      if (this.validListNames.find(element => element === listName)) {
        this.afAuth.authState.subscribe(user => {
          this.firestore
          .collection('UserAnime')
          .doc(user.uid)
          .collection('anime')
          .doc(listName)
          .set(
            { [slug]: true },
            { merge: true }
          );
        });
    
        return this.kitsuService.getAnime(slug).pipe(map((animeResponse) => {
          switch (listName) {
            case 'watching':
              if (!this.watchingAnime.find(element => element.id === animeResponse.id)){
                this.watchingAnime.push(animeResponse);
              }
              return this.watchingAnime;
            case 'watchList':
              if (!this.watchList) {
                this.watchList = [animeResponse]
              } else {
                if (!this.watchList.find(element => element.id === animeResponse.id)) {
                  this.watchList.push(animeResponse);
                }
              }
              return this.watchList;
            case 'finished':
              if (!this.finishedAnime) {
                this.finishedAnime = [animeResponse];
              } else {
                if (!this.finishedAnime.find(element => element.id === animeResponse.id)) {
                  this.finishedAnime.push(animeResponse);
                }
              }
              return this.finishedAnime;
            default:
              throw new Error("An error occurred while modifying the list.")
          }
        }));
      } else {
        throw new Error("Invalid list name provided.");
      }
    } catch (e) {
      return e;
    }
  }

  public removeAnimeFromList(slug: string, listName: string): Observable<Anime[]> {
    try {
      if (this.validListNames.find(element => element === listName)) {
        this.afAuth.authState.subscribe(user => {
          this.firestore
          .collection('UserAnime')
          .doc(user.uid)
          .collection('anime')
          .doc(listName)
          .set(
            { [slug]: false },
            { merge: true }
          );
        });

        let animeIndex;
        switch(listName) {
          case 'watching':
            animeIndex = this.watchingAnime.findIndex(element => element.attributes.slug === slug);
            this.watchingAnime.splice(animeIndex, 1);
            return of(this.watchingAnime);
          case 'watchList':
            animeIndex = this.watchList.findIndex(element => element.attributes.slug === slug);
            this.watchList.splice(animeIndex, 1);
            return of(this.watchList);
          case 'finished':
            animeIndex = this.finishedAnime.findIndex(element => element.attributes.slug === slug);
            this.finishedAnime.splice(animeIndex, 1);
            return of(this.finishedAnime);
          default:
            throw new Error("An error occurred removing the anime from the list");
        }
      } else {
        throw new Error("Invalid list name provided.");
      }
    } catch (e) {
      return e;
    }
  }

  public initializeList(listName: string): void {
    if (this.validListNames.find(element => element === listName)) {
      const initializationSubscription = this.getSlugsFromList(listName).subscribe((animeSlugs) => {
        console.log(animeSlugs);
        const animeObservables = this.kitsuService.getMultipleAnimeBySlugs(Object.keys(animeSlugs));
        animeObservables.forEach((animeObservable) => {
          animeObservable.subscribe((animeResponse) => {
            try {
                  this.addAnimeToList(animeResponse.attributes.slug, listName).subscribe();
            } catch (e) {
              console.warn(e);
            }
          })
        });
        initializationSubscription.unsubscribe();
      });
    };
  }

  public clearAllLists(): void {
    this.watchingAnime = [];
    this.watchList = [];
    this.finishedAnime = [];
  }
}
