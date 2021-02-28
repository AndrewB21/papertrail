import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { ContentCardComponent } from './content-card/content-card.component';
import { CommonModule } from '@angular/common';
import { DashboardAuthenticationResolver } from './user-dashboard/resolvers/dashboard-authentication.resolver';
import { PopularAnimeResolver } from './shared/resolvers/popular-anime.resolver';
import { DashboardWatchingAnimeResolver } from './user-dashboard/resolvers/dashboard-watching-anime.resolver';
import { ContentPageComponent } from './content-page/content-page.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: UserDashboardComponent,
    resolve: {
      authenticated: DashboardAuthenticationResolver,
      popularAnime: PopularAnimeResolver,
      watchingNow: DashboardWatchingAnimeResolver,
    }
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'content/:slug',
    component: ContentPageComponent,
  }
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
