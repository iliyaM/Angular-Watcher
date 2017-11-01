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
userId:string;

popupMessage = {
	title: null,
	content: null,
	isOpen: false,
}

@Input()information;

  constructor(private db:DbService, private auth:AuthService, private api:ApiSearchService) { }

  ngOnInit() {
	  
  }

  followInit() {
		console.log(this.information)
    //Check status of tvShow
    if(this.information.status === "Ended") {

			//Activate popip with ended info
			this.db.activatePopup('ended').subscribe(res => {
				console.log(res)
				this.popupMessage.title = res['title'];
				this.popupMessage.content = res['content'];
				this.popupMessage.isOpen = true;
			});
    } else {
      //Check Authentication state. if not user disable button functions
      this.subscriber = this.auth.user.subscribe(res => {
          if(res == null) {

						this.db.activatePopup('notLoggedIn').subscribe(res => {
							console.log(res)
							this.popupMessage.title = res['title'];
							this.popupMessage.content = res['content'];
							this.popupMessage.isOpen = true;
						});

          } else {

						this.db.activatePopup('sucsess').subscribe(res => {
							console.log(res)
							this.popupMessage.title = res['title'];
							this.popupMessage.content = res['content'];
							this.popupMessage.isOpen = true;
						});
						
            this.getEpisode(res);
          }
      });
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
    let finalEpisodeSubscription:Subscription = this.api.findFinalEpisode(this.information.id, finalSeason).subscribe(res => {

		for(var i in res.episodes) {

			if( moment(res.episodes[i]['air_date']).startOf('day').isSame(today.startOf('day')) ) {
				episodeData.episodesReleaseDate = res.episodes[i]['air_date'];
				episodeData.episodeNumber = res.episodes[i]['episode_number'],
				episodeData.name = res.episodes[i]['name'];
				console.log('Found today')
				break;
			}

			//If release date is before today plus 7 days AND its bigger than today.
			if(moment(res.episodes[i]['air_date']) < moment(res.episodes[i]['air_date']).add(7, 'days') && moment(res.episodes[i]['air_date']) > today) {
				console.log('Taking next')
				episodeData.episodesReleaseDate = res.episodes[i]['air_date'];
				episodeData.episodeNumber = res.episodes[i]['episode_number'],
				episodeData.name = res.episodes[i]['name'];
			}
		}
		
		// Check if nothing found set to 0
		if(episodeData.episodesReleaseDate == null) {

			this.db.activatePopup('noMoreEpisodesMessage').subscribe(res => {
				console.log(res)
				this.popupMessage.title = res['title'];
				this.popupMessage.content = res['content'];
				this.popupMessage.isOpen = true;
			});
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
  }

  

}
