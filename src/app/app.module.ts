import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { appRoutes } from './routes/routes';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// FireStore AUTH
import { CoreModule } from './core/core.module';

// Firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';

// Services
import { ApiSearchService } from './services/api-search.service';
import { DbService } from './services/db.service';
import { PublicService } from './services/publicService';

// Route Guards
import { AuthGuard } from './guards/canActivate';
import { AuthAdmin } from './guards/authAdmin';

// Components
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { AdminComponent } from './admin/admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';

// Directives
import { clickOutsideDirective } from './directives/click';

@NgModule({
	declarations: [
		AppComponent,
		HomepageComponent,
		NavbarComponent,
		SearchResultsComponent,
		clickOutsideDirective,
		SidebarComponent,
		AdminComponent,
	],
	imports: [
		CoreModule,
		HttpModule,
		BrowserModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		RouterModule.forRoot(appRoutes),
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
	],
	providers: [ApiSearchService, DbService, AuthGuard, PublicService, AuthAdmin],
	bootstrap: [AppComponent]
})
export class AppModule { }
