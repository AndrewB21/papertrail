import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  public authenticated: boolean;

  public constructor(private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.authenticated = this.route.snapshot.data['authenticated'];
  }

}
