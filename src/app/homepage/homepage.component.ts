import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiSearchService } from '../services/api-search.service';
import { Observable } from 'rxjs/Observable';
import { TvShow } from '../interfaces/tv-show';
import { Movie } from '../interfaces/movie';


import { DbService } from '../services/db.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit {
  
tvList:Array<TvShow>;
movieList:Array<Movie>;
subscriber;

posterSizes = {
  super_small: 'w92',
  small: 'w154',
  small_medium: 'w185',
  medium: 'w342',
  large: 'w500',
  huge: 'w780',
  original: 'original'
}

filters = { //See if there are more filters. dont care at the momoent.
  popular: 'popular',
  toRated: 'top_raterd',
  upcoming: 'upcoming',
  tv: {
   airing_today: 'airing_today',
   on_the_air: 'on_the_air',
  }
}

seeMoreFunction(event) {
	event.preventDefault();
	alert('Something need to happen here');
}

imageSrc:string = `https://image.tmdb.org/t/p/${this.posterSizes.small_medium}`;

  constructor(private apiService: ApiSearchService, public dbService: DbService) { }

  ngOnInit() {
    this.subscriber = this.apiService.getTopTen().subscribe(data => {
        this.tvList = this.apiService.getTvCustomData(data[0].results);
        this.movieList = this.apiService.getMovieCustomData(data[1].results);
    });
  }

  ngOnDestroy() {
  	this.subscriber.unsubscribe();
  }

  checkOnStage() {
    this.dbService.checkOnStage();
  }

}