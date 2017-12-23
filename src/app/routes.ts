import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AdminComponent } from './admin/admin.component';

import { AuthGuard } from './guards/canActivate';
import { AuthAdmin } from './guards/authAdmin';

export const appRoutes: Routes = [
	{ path: 'home', component: HomepageComponent },
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'tv/:tv-name/:id', loadChildren: './item-module/item.module#ItemModule' },
	{ path: 'profile', loadChildren: './profile-module/profile.module#ProfileModule' }
];
