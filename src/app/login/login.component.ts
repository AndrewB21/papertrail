import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private firestoreService: FirestoreService) { }

  public ngOnInit(): void {
  }

  public successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    if (signInSuccessData.authResult.additionalUserInfo.isNewUser) {
      this.firestoreService.addUserToUserAnime(signInSuccessData);
    }
    this.router.navigate(['/dashboard']);
  }

  public errorCallback(errorData: FirebaseUISignInFailure) {
    console.log('Login failed.');
  }
}
