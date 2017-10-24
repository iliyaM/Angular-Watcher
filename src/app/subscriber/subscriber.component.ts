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

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.css']
})
export class SubscriberComponent implements OnInit {
subscriber:Subscription;
userId:string;

@Input()information;

  constructor(private db:DbService, private auth:AuthService, private api:ApiSearchService) { }

  ngOnInit() {
    // Query on stage release date
    this.db.checkOnStage();
  }

  OnDestroy () {
    this.subscriber.unsubscribe();
  }

  
  followInit() {
    if(this.information.status == "Ended") {
      alert('you cannot susbsribe to an ended series') //Check status of tvShow
      return;
    } else {
      //Check Authentication state. if not user disable button functions
      this.subscriber = this.auth.user.subscribe(res => {
          if(res == null) {
            alert('You must be loggen in')
          } else {
            this.getFinalEpisode(res);
          }
      });
    }
  }

  //Grab Series information
  getFinalEpisode(user) {
    let date = new Date().toISOString().slice(0,10); //Create date of today to compare.
    let episodeReleaseDate:number;
    
    // Grab final season number and id
    let finalSeason = this.information.seasons[this.information.seasons.length -1].season_number;
    let seasonId = this.information.seasons[this.information.seasons.length -1].id;

    //Query api for episode realease date.
    let finalEpisodeSubscription:Subscription = this.api.findFinalEpisode(this.information.id, finalSeason).subscribe(res => {

      res.episodes.forEach(episode => { 
        //Get not only released episode air date.
        if(date >= episode.air_date) {
          episodeReleaseDate = episode.air_date;
          return;
        } else {
          episodeReleaseDate = res.episodes[0].air_date;
        }
      });

      //Construct object
      const data = {
        userId: user.userId,
        seasonId: seasonId,
        episodeReleaseDate: episodeReleaseDate,
        showName: this.information.title,
        phoneNumber: user.phoneNumber,
        email: user.email,
        type: 'tvShow',
        showId: this.information.id,
        userName: user.displayName,
      }

      this.db.handleOnFollowInDb(data);
    });
    
    return;
  }

  

}
