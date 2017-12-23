import { Component, OnInit, Input } from '@angular/core';
// rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import { Router, ActivatedRoute, Params } from '@angular/router';

// Services
import { DbService } from '../../../services/db.service';
import { AuthService } from '../../../services/auth.service';
import { ApiSearchService } from '../../../services/api-search.service';

// Interfaces
import { User } from '../../../interfaces/user';

// Moment JS
import * as moment from 'moment';
import { TvSeasonInfo } from '../../../interfaces/tv-season-information';

@Component({
	selector: 'app-subscriber',
	templateUrl: './subscriber.component.html',
	styleUrls: ['./subscriber.component.less']
})

export class SubscriberComponent implements OnInit {
	subscriber: Subscription;
	user;
	finalEpisodeSubscription: Subscription;
	popupMessage: object;

	@Input() information;

	constructor(private db: DbService, private auth: AuthService, private api: ApiSearchService) { }

	ngOnInit() {
		this.subscriber = this.auth.user.subscribe(res => {
			if (res == null) {
				this.user = null;
			} else {
				this.user = res;
			}
		});
	}

	followInit() {

		// Check status of tvShow
		if (this.information.status === 'Ended') {
			// Activate popip with ended info
			this.popupMessage = this.db.activatePopup('ended');
			return;
		}

		if (this.user == null) {
			this.popupMessage = this.db.activatePopup('notLoggedIn');
			return;
		}

		if (this.user != null) {
			this.getEpisode(this.user);
		}
	}

	getEpisode(user) {
		const today = moment();
		const finalSeason = this.information.seasons[this.information.seasons.length - 1].season_number;
		const seasonId = this.information.seasons[this.information.seasons.length - 1].id;

		// Query api for episode realease date.
		this.finalEpisodeSubscription = this.api.findFinalEpisode(this.information.id, finalSeason).subscribe(res => {

			for (const i in res.episodes) {
				// tslint:disable-next-line:max-line-length
				if (moment(res.episodes[i]['air_date']) > today && moment(res.episodes[i]['air_date']) < moment(res.episodes[i]['air_date']).add(7, 'days')) {
					this.popupMessage = this.db.activatePopup('sucsess');
					break;
				} else {
					this.popupMessage = this.db.activatePopup('noMoreEpisodesMessage');
				}
			}
			// Construct data object for firestore
			const data = {
				userId: user.userId,
				seasonId: seasonId,
				showName: this.information.title,
				phoneNumber: user.phoneNumber,
				email: user.email,
				type: 'tvShow',
				showId: this.information.id,
				userName: user.displayName,
			};
			// Go populate Db
			this.db.populateFirestore(data);
			return;
		});
	}
}
