import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserDashboardResolver } from './user-dashboard/user-dashboard.resolver';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    pathMatch: 'full',
    resolve: {
      authenticated: UserDashboardResolver,
    }
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
