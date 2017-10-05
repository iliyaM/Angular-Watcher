import { Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { RegisterComponent } from '../register/register.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { ItemMovieComponent } from '../item-movie/item-movie.component';
import { ItemTvComponent } from '../item-tv/item-tv.component';


export const appRoutes: Routes = [
	{ path: 'home', component: HomepageComponent },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'register', component: RegisterComponent },
	{ path: 'movie/:movie-name/:id', component: ItemMovieComponent },
	{ path: 'tv/:tv-name/:id', component: ItemTvComponent },
	
];