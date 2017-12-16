import { Component, OnInit } from '@angular/core';
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
	tvList: Array<TvShow>;
	movieList: Array<Movie>;
	mediaListSubscription;
	posterSizes = {
		super_small: 'w92',
		small: 'w154',
		small_medium: 'w185',
		medium: 'w342',
		large: 'w500',
		huge: 'w780',
		original: 'original'
	};
	imageSrc = `https://image.tmdb.org/t/p/${this.posterSizes.small_medium}`;
	filters = {
		popular: 'popular',
		toRated: 'top_raterd',
		upcoming: 'upcoming',
		tv: {
			airing_today: 'airing_today',
			on_the_air: 'on_the_air',
		}
	};

	seeMoreFunction(event) {
		event.preventDefault();
		alert('Something need to happen here');
	}

	constructor(private apiService: ApiSearchService, public dbService: DbService) { }

	ngOnInit() {
		this.mediaListSubscription = this.apiService.getTopTen().subscribe(data => {
			this.tvList = this.apiService.getTvCustomData(data.results);
		});
	}
}
