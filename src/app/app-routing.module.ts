import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ContentCardComponent } from './content-card/content-card.component';
import { CommonModule } from '@angular/common';
import { DashboardAuthenticationResolver } from './user-dashboard/resolvers/dashboard-authentication.resolver';
import { DashboardPopularAnimeResolver } from './user-dashboard/resolvers/dashboard-popular-anime.resolver';
import { DashboardWatchingAnimeResolver } from './user-dashboard/resolvers/dashboard-watching-anime.resolver';

const routes: Routes = [
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    pathMatch: 'full',
    resolve: {
      authenticated: DashboardAuthenticationResolver,
      popularAnime: DashboardPopularAnimeResolver,
      watchingNow: DashboardWatchingAnimeResolver,
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
