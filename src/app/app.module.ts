import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { appRoutes } from './routes/routes';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//Firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//Services
import { AuthService } from './services/auth.service';
import { ApiSearchService } from './services/api-search.service';

//Components
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ItemMovieComponent } from './item-movie/item-movie.component';
import { ItemTvComponent } from './item-tv/item-tv.component';
import { SeasonInformationComponent } from './season-information/season-information.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomepageComponent,
    NavbarComponent,
    ItemMovieComponent,
    ItemTvComponent,
    SeasonInformationComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [AuthService,ApiSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
