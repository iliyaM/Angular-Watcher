import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiSearchService } from '../services/api-search.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
movieSubscription; // Interface can be added  here to define the type of observable like MovieList[]
tvSubscription;
movieList: Array<object>;
tvList: Array<object>;
displayCount:number = 20;

posterSizes = {
	super_small: 'w92',
	small: 'w154',
	small_medium: 'w185',
	medium: 'w342',
	large: 'w500',
	huge: 'w780',
	original: 'original'
}

seeMoreFunction(event) {
	event.preventDefault();
	alert('Something need to happen here');
}

imageSrc:string = `https://image.tmdb.org/t/p/${this.posterSizes.small_medium}`;

  constructor(private apiService: ApiSearchService) { }

  ngOnInit() {
  	// Subscribing to api call from service and Storing to Global
  	this.movieSubscription = this.apiService.getMovieList().subscribe(res => {
  		this.movieList = res.results;
  	});

  	// Subscribing to api call from service and Storing to Global
  	this.tvSubscription = this.apiService.getTvList().subscribe(res => {
  		this.tvList = res.results;
  	});
  }

  ngOnDestroy() {
  	this.movieSubscription.unsubscribe();
  	this.tvSubscription.unsubscribe();
  }



}