import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardAuthenticationResolver implements Resolve<boolean> {

  public constructor(private authService: AuthenticationService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.checkAuthState().pipe(take(1));
  }
}
