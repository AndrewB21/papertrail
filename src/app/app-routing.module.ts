import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserDashboardResolver } from './user-dashboard/user-dashboard.resolver';
import { ContentCardComponent } from './content-card/content-card.component';
import { DashboardAnimeResolver } from './user-dashboard/dashboard-anime.resolver';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    pathMatch: 'full',
    resolve: {
      authenticated: UserDashboardResolver,
      popularAnime: DashboardAnimeResolver,
    }
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
  ],
  exports: [RouterModule],
  declarations: [
    UserDashboardComponent,
    ContentCardComponent
  ],
})
export class AppRoutingModule { }
