import { Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { ProfileComponent } from '../profile/profile.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { ItemMovieComponent } from '../item-movie/item-movie.component';
import { ItemTvComponent } from '../item-tv/item-tv.component';
import { SeasonInformationComponent } from '../season-information/season-information.component';

export const appRoutes: Routes = [
	{ path: 'home', component: HomepageComponent },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'profile', component: ProfileComponent },
	{ path: 'movie/:movie-name/:id', component: ItemMovieComponent },
	{ path: 'tv/:tv-name/:id', component: ItemTvComponent,
		children: [
				{ path: 'season/:season_number', component: SeasonInformationComponent },
			]
	},
];