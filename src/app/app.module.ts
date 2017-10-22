import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { appRoutes } from './routes/routes';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//FireStore AUTH
import { CoreModule } from './core/core.module';

//Firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';

//Services
import { ApiSearchService } from './services/api-search.service';
import { DbService } from './services/db.service';

//Components
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ItemMovieComponent } from './item-movie/item-movie.component';
import { ItemTvComponent } from './item-tv/item-tv.component';
import { SeasonInformationComponent } from './season-information/season-information.component';
import { SearchResultsComponent } from './search-results/search-results.component';

//Directives
import { clickOutsideDirective } from './directives/click';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomepageComponent,
    NavbarComponent,
    ItemMovieComponent,
    ItemTvComponent,
    SeasonInformationComponent,
    SearchResultsComponent,
    clickOutsideDirective,
  ],
  imports: [
    CoreModule,
    HttpModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ApiSearchService,DbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
