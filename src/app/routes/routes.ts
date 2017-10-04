import { Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { RegisterComponent } from '../register/register.component';
import { HomepageComponent } from '../homepage/homepage.component';

export const appRoutes: Routes = [
	{ path: 'home', component: HomepageComponent },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'register', component: RegisterComponent },
];