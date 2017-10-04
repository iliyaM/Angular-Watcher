<<<<<<< .merge_file_a19048
import { Component, OnInit } from '@angular/core';
import { ApiSearchService } from '../services/api-search.service';
=======
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
imageSrc:string = 'https://image.tmdb.org/t/p/w500';
  constructor(private apiService: ApiSearchService) { }

  ngOnInit() {
  	//this.movieList = this.apiService.getMovieList();
  	this.apiService.testing_list();
  }
}
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

