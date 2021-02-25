import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { firebase, FirebaseUIModule } from 'firebaseui-angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AngularFireModule } from '@angular/fire';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ContentPageComponent } from './content-page/content-page.component';
import { HomeComponent } from './home/home.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
};

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    ContentPageComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
