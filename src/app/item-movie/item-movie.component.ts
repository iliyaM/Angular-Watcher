import { Component, OnInit, OnDestroy, Pipe } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiSearchService } from '../services/api-search.service';
import { Movie } from '../interfaces/movie';
import { MovieItem } from '../interfaces/movie-item';



@Component({
  selector: 'app-item-movie',
  templateUrl: './item-movie.component.html',
  styleUrls: ['./item-movie.component.less']
})
export class ItemMovieComponent implements OnInit {
movieId:string;
subscriber;
safeUrlYoutube;
MovieItem:MovieItem;

// Poster sized of easier use
imageSrc:string = `https://image.tmdb.org/t/p/`;
posterSizes = {
	super_small: 'w92',
	small: 'w154',
	small_medium: 'w185',
	medium: 'w342',
	large: 'w500',
	huge: 'w780',
	original: 'original'
}

youtubeUrl = 'wwww.youtube.com/embed/';

  constructor(private apiService: ApiSearchService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(( params:Params ) => {
			this.movieId = params['id'];
      this.subscriber = this.apiService.fetchMovieItem(this.movieId).subscribe(res => this.MovieItem = res);
      console.log(this.MovieItem)
    });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

}
