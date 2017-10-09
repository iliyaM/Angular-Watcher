import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiSearchService } from '../services/api-search.service';
import { TvSeason } from '../interfaces/tv-season';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-season-information',
  templateUrl: './season-information.component.html',
  styleUrls: ['./season-information.component.css']
})
export class SeasonInformationComponent implements OnInit {
season_number;
tvId;

seasonSubscriber;
routeSub;
routeParentsub;

TvSeason:TvSeason;

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

  constructor(private apiService:ApiSearchService, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.routeParentsub = this.activeRoute.parent.params.subscribe((parentParams:Params) => {
      this.tvId = parentParams['id'];
    });
    this.routeParentsub.unsubscribe(); // Get initial value and unsubscribe
      
    this.routeSub = this.activeRoute.params.subscribe(( params:Params ) => {
        this.season_number = params['season_number'];
        this.seasonSubscriber = this.apiService.fetchSeasonEpisodes(this.tvId, this.season_number).subscribe(res => this.TvSeason = res);
        
    });

  }

  ngOnDestroy() {
    this.seasonSubscriber.unsubscribe();
    this.routeSub.unsubscribe();
  }

}
