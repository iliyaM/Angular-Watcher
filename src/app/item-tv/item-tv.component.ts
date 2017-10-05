import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ApiSearchService } from '../services/api-search.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-item-tv',
  templateUrl: './item-tv.component.html',
  styleUrls: ['./item-tv.component.css']
})
export class ItemTvComponent implements OnInit {
//Subscriptions
TvSubscription;
TvEpisodesSubscription;
imageSubscription;

// Global Items
tvId;

tvItem = {
	data:null,
	poster:null,
	seasons: {
		data:null,
		posters:null,
	}
}

tvItemEpisodes = {
	data: null,
	posters: null,
}

// Poster sized of easier use
posterSizes = {
	super_small: 'w92',
	small: 'w154',
	small_medium: 'w185',
	medium: 'w342',
	large: 'w500',
	huge: 'w780',
	original: 'original'
}

// Settting overall size of images of component view
imageSrc:string = `https://image.tmdb.org/t/p/${this.posterSizes.small}`;

  constructor(private apiService: ApiSearchService, private activeRoute: ActivatedRoute) { }

	ngOnInit() {
		//Subscribing to active route and getting params
		this.activeRoute.params.subscribe(( params:Params ) => {
			this.tvId = params['id'];

			//Call service to fetch data with id.
			this.TvSubscription = this.apiService.getTvItem(this.tvId).subscribe(res => {
				this.tvItem.data = res;
				this.tvItem.seasons.data = res.seasons;

				this.imageSubscription = this.apiService.getImage(this.posterSizes.original, res.poster_path).subscribe(res => {
					this.tvItem.poster = res.url;
					console.log(res.url)
				});
			});
		});
	}

	//Call service to fetch spisodes of season by seasonNumber
	findSeasonEpisodes(event, seasonNumber) {
		event.preventDefault();
		this.TvEpisodesSubscription = this.apiService.findRelatedEpisodes(this.tvId, seasonNumber).subscribe(res => {
			this.tvItemEpisodes.data = res;
			console.log(res);
		});
	}

	ngOnDestroy() {
		this.TvSubscription.unsubscribe();
		this.TvEpisodesSubscription.unsubscribe();
		this.imageSubscription.usubscribe();
	}
}
