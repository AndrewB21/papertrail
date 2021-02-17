import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  public authenticated: boolean;

  public constructor(private authService: AuthenticationService) { }

  public ngOnInit(): void {
    this.authService.checkAuthState().subscribe(result => this.authenticated = result);
  }

  public signOut() {
    this.authService.signOut();
    this.authenticated = false;
  }

}
