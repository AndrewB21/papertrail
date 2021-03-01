import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { DashboardAuthenticationResolver } from './user-dashboard/resolvers/dashboard-authentication.resolver';
import { PopularAnimeResolver } from './shared/resolvers/popular-anime.resolver';
import { AnimeSearchComponent } from './shared/components/anime-search/anime-search.component';
import { ContentCardComponent } from './shared/components/content-card/content-card.component';
import { ContentPageComponent } from './content-page/content-page.component';
import { ContentBrowserComponent } from './content-browser/content-browser.component';

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
    ReactiveFormsModule,
  ],
  exports: [RouterModule],
  declarations: [
    UserDashboardComponent,
    ContentCardComponent,
    AnimeSearchComponent,
    ContentBrowserComponent,
  ],
})
export class AppRoutingModule { }
