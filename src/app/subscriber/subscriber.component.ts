import { Component, OnInit, OnDestroy, Input } from '@angular/core';
//rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { Router, ActivatedRoute, Params } from '@angular/router';

//Services
import { DbService } from '../services/db.service';
import { AuthService } from '../services/auth.service';
import { ApiSearchService } from '../services/api-search.service';

//Interfaces
import { User } from '../interfaces/user';

// Moment JS
import * as moment  from 'moment';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.less']
})
export class SubscriberComponent implements OnInit {
subscriber:Subscription;
user;
finalEpisodeSubscription:Subscription;
popupMessage:object;


@Input()information;

  constructor(private db:DbService, private auth:AuthService, private api:ApiSearchService) { }

  ngOnInit() {
	this.subscriber = this.auth.user.subscribe(res => {
		if(res == null) {
			this.user = null;
		} else {
			this.user = res;
		}
	});

  }

  followInit() {
    //Check status of tvShow
    if(this.information.status === "Ended") {
		//Activate popip with ended info
		this.popupMessage  = this.db.activatePopup('ended');
		return;
	}

	if(this.user == null) {
		this.popupMessage = this.db.activatePopup('notLoggedIn');
		return;
	}
	
	if(this.user != null) {
		this.popupMessage = this.db.activatePopup('sucsess');
		this.getEpisode(this.user);
	}
  }

  //Grab Series information
  getEpisode(user) {

	let episodeData = {
		episodesReleaseDate: null,
		episodeNumber: null,
		name: null,
	}

    let today = moment();
    // Grab final season number and id
    let finalSeason = this.information.seasons[this.information.seasons.length -1].season_number;
    let seasonId = this.information.seasons[this.information.seasons.length -1].id;

    //Query api for episode realease date.
    this.finalEpisodeSubscription = this.api.findFinalEpisode(this.information.id, finalSeason).subscribe(res => {

		for(var i in res.episodes) {

			//If episode releases today
			if( moment(res.episodes[i]['air_date']).startOf('day').isSame(today.startOf('day')) ) {
				episodeData.episodesReleaseDate = res.episodes[i]['air_date'];
				episodeData.episodeNumber = res.episodes[i]['episode_number'],
				episodeData.name = res.episodes[i]['name'];
				console.log('Found today')
				break;
			}

			//If today is after episode release and before the next episode release. this is the one.
			if( moment(res.episodes[i]['air_date']) > today  && moment(res.episodes[i]['air_date']) < moment(res.episodes[i]['air_date']).add(7, 'days') ) {
				console.log('Taking episode for this week')
				episodeData.episodesReleaseDate = res.episodes[i]['air_date'];
				episodeData.episodeNumber = res.episodes[i]['episode_number'],
				episodeData.name = res.episodes[i]['name'];
				console.log(res.episodes[i]['air_date'])
				break;
			}
		}
		
		// Check if nothing found set to 0
		if(episodeData.episodesReleaseDate == null) {
			this.popupMessage = this.db.activatePopup('noMoreEpisodesMessage');
		  	episodeData.episodesReleaseDate = 0;
		}

		//Construct data object for firestore
		const data = {
			userId: user.userId,
			seasonId: seasonId,
			showName: this.information.title,
			phoneNumber: user.phoneNumber,
			email: user.email,
			type: 'tvShow',
			showId: this.information.id,
			userName: user.displayName,
			episode: episodeData,
		}

		//Go populate Db
		this.db.populateFirestore(data);
	});
	return;
  }

  OnDestroy () {
		this.subscriber.unsubscribe();
		this.popupMessage = null;
		this.finalEpisodeSubscription.unsubscribe();
  }

  

}