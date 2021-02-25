import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public authenticated: boolean;
  public constructor(private authenticationService: AuthenticationService, private router: Router) { }

  public ngOnInit(): void {
    this.authenticationService.checkAuthState().subscribe((authenticated) => {
      if (authenticated) {
        this.router.navigate(['/dashboard']);
      } else {
        this.authenticated = false;
      }
    });
  }
}
