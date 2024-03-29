import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent implements OnInit {
  public authenticated: boolean;
  public authClass = 'nav-menu';
  public expandedClass = 'auth-text expanded-false';

  public constructor(private router: Router, private firestoreService: FirestoreService, private authService: AuthenticationService) { }

  public ngOnInit(): void {
    this.authService.checkAuthState().subscribe(result => {
      this.authClass = `nav-menu auth-${result}`;
      this.authenticated = result;
      setTimeout(() => this.expandedClass = 'auth-text expanded-true', 275);
    });
  }

  public signOut() {
    this.authService.signOut().then(res => {
      this.firestoreService.clearAllLists();
      this.authenticated = false;
      this.router.navigate(['/']);

    });
  }
}
