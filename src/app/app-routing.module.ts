import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { PopularAnimeResolver } from './shared/resolvers/popular-anime.resolver';
import { AnimeSearchComponent } from './shared/components/anime-search/anime-search.component';
import { ContentCardComponent } from './shared/components/content-card/content-card.component';
import { ContentPageComponent } from './content-page/content-page.component';
import { ContentBrowserComponent } from './content-browser/content-browser.component';
import { HighestRatedAnimeResolver } from './content-browser/resolvers/highest-rated-anime.resolver';
import { TopCurrentAnimeResolver } from './content-browser/resolvers/top-current-anime.resolver';

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
  },
  {
    path: 'browse',
    component: ContentBrowserComponent,
    resolve: {
      popularAnime: PopularAnimeResolver,
      highestRatedAnime: HighestRatedAnimeResolver,
      topCurrentAnime: TopCurrentAnimeResolver,
    }
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
