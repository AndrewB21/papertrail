import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
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
import { ImmersionFormComponent } from './immersion-form/immersion-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { GoogleChartsModule } from 'angular-google-charts'
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    ImmersionFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    GoogleChartsModule,
    FlexLayoutModule,
    LayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
