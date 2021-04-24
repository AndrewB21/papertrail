import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public constructor(private afAuth: AngularFireAuth, private firestoreService: FirestoreService) { }

  public checkAuthState(): Observable<boolean> {
    return this.afAuth.authState.pipe(map(userResponse => {
      if (userResponse) {
        return true;
      } else {
        return false;
      }
    }));
  }

  public signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}
