import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ApiSearchService } from '../services/api-search.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { TvItem } from '../interfaces/tv-item';
import { TvSeason } from '../interfaces/tv-season';

import { SeasonInformationComponent } from '../season-information/season-information.component';

@Component({
  selector: 'app-item-tv',
  templateUrl: './item-tv.component.html',
  styleUrls: ['./item-tv.component.css']
})

export class ItemTvComponent implements OnInit {
tvId:string;
tvItem:TvItem;
TvSeason:TvSeason;

subscriber;
seasonSubscriber;


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

  constructor(private apiService: ApiSearchService, private activeRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activeRoute.params.subscribe(( params:Params ) => {
			this.tvId = params['id'];

			this.subscriber = this.apiService.fetchTvItem(this.tvId).subscribe(res => {
				this.tvItem = this.apiService.constructTvItem(res);
			});
		});
	}

	findSeasonEpisodes(number) {
		this.seasonSubscriber = this.apiService.fetchSeasonEpisodes(this.tvId, number).subscribe(res=> this.TvSeason = res);
	}

	ngOnDestroy() {
		this.subscriber.unsubscribe();
		this.seasonSubscriber.unsubscribe();
	}
}
