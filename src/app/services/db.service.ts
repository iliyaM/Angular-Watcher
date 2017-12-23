import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

// FireBase
import * as firebase from 'firebase';

// Services
import { AuthService } from '../services/auth.service';
import { ApiSearchService } from '../services/api-search.service';

// Interfaces Classes
import { Message } from '../interfaces/message';
import { User } from '../interfaces/user';

// Moment JS
import * as moment from 'moment';

interface OnStage {
	showId: number;
	type: string;
}

interface Subscriber {
	name: string;
	userId: number;
	email: string;
}

interface PopupMessage {
	title: string;
	content: string;
}

/**
 * Data structure.
 * [  ] => Collections,   (   ) => Document
 * [Subscriptions] => (tv-shows) => [ShowId] => (userInfo) // Shows with user docs to see who susbscriberd
 * [OnStage] => (tv-shows) => [followed] => (ShowId + ReleaseDate) // Show that peopele intrested in stored to see when released
 * [users] => (userId) => [info] => (userID) // information about user
 * [users] => (userId) => [subscriptions] => (showId) // subsctiptions to user.
 */

@Injectable()
export class DbService {
	messageRef: Subscription;
	subscriptionsList: Subscription;


	constructor(private afs: AngularFirestore, public authService: AuthService, private api: ApiSearchService, private http: Http) { }

	// Handles on follow and pupulates 3 collections ONstage User and Subscriptions
	populateFirestore(data) {
		// Subsctiptions collections handles tv shows by id and user that subscribed to is for notifications.
		const subscriptionsDoc: AngularFirestoreDocument<Subscriber> = this.afs.doc(`subscriptions/tv-shows/${data.showId}/${data.userId}`);
		const subscriber = {
			name: data.userName,
			userId: data.userId,
			email: data.email,
		};

		// OnStage collections handles everyday queries to see what episode is on stage and status of upcoming episodes related to that show.
		const onStageDoc: AngularFirestoreDocument<OnStage> = this.afs.doc(`onStage/tv-shows/followed/${data.showName}`);
		const newOnStageShow = {
			showId: data.showId,
			type: data.type,
		};

		// User collections subscriptions handles for profile page to show what shows specific user is subscribed to.
		const userSubs: AngularFirestoreDocument<any> = this.afs.doc(`users/${data.userId}/subscriptions/${data.showName}`);
		const newSubscriptionForUser = {
			showName: data.showName,
			showId: data.showId,
		};

		// Set to DB
		subscriptionsDoc.set(subscriber);
		onStageDoc.set(newOnStageShow);
		userSubs.set(newSubscriptionForUser);

		return;
	}


	updateUser(avatar: string, userId: string, displayName: string) {
		const data = {
			avatar: avatar,
			displayName: displayName,
		};
		const user = this.afs.doc(`users/${userId}/info/${userId}`); // Where to update
		user.update(data);
	}


	// Get subscription list.
	getMySubscriptions() {
		let api: Subscription;
		const data: Array<object> = [];

		let myObservable: Observable<any>;

		this.authService.user.subscribe(res => {
			if (res != null) {
				// tslint:disable-next-line:max-line-length
				this.subscriptionsList = this.afs.collection(`users/${res.userId}/subscriptions`, ref => ref.where('showId', '>', 0)).valueChanges().subscribe(res => {
					data.length = 0;

					res.forEach(result => {
						api = this.api.fetchTvItem(result['showId']).subscribe(res => {
							data.push(res);
						});
					});

				});
			} else {
				console.log('no user');
			}
		});
		return data;
	}

	removeSubscription(userId, showName, showId) {
		this.afs.doc(`subscriptions/tv-shows/${showId}/${userId}`).delete();
		this.afs.doc(`users/${userId}/subscriptions/${showName}`).delete();
	}

	// Custom made db collections for popup messages
	activatePopup(documentName) {
		const message = {
			title: '',
			content: '',
			modalOpen: false,
		};

		this.messageRef = this.afs.doc(`popupMessages/${documentName}`).valueChanges().subscribe(res => {
			message.title = res['title'];
			message.content = res['content'];
			message.modalOpen = true;
		});

		return message;
	}

	getUserInfo(userId) {
		return this.afs.doc(`users/${userId}/info/${userId}`).valueChanges();
	}

	destroyMessage() {
		this.messageRef.unsubscribe();
	}

	getUserGenres(userId) {
		return this.afs.collection(`users/${userId}/subscriptions`, ref => ref.where('showId', '>', 0)).valueChanges();
	}

	/**
	 * Clearing db functions.
	 */
	ShowNoReleaseDate() {
		return this.afs.collection(`onStage/tv-shows/followed`, ref => {
			return ref.where('episodesReleaseDate', '==', 0);
		}).valueChanges();
	}

}
















  // Daily function to be called to check whether some release daye is close to today.
  // checkOnStage() {
  //   console.log('called')
  //   let today = moment();
  //   let tommorow = moment().startOf('day').add(1, 'day');
	//  // Message class
  //   let episodesOnstage:Array<Message> = [];

  //   //Fetch all data from onStage tvshows
  //   let data = this.afs.collection(`onStage/tv-shows/followed`).valueChanges().subscribe(res => {

	// 	//Find what episode is comming out tommorow or today.
	// 	res.forEach(dbItem => {

	// 		//Consctucts object with data structure in mind. like array of users that will be fetched later.
	// 		if( moment(dbItem['episodesReleaseDate']).isSame(today, 'days') ) {
	// 			let episodeInfo =  new Message();

	// 			episodeInfo.episodeName =  dbItem['episodeName'];
	// 			episodeInfo.episodeNumber =  dbItem['episodeNumber'];
	// 			episodeInfo.showName =  dbItem['showName'];
	// 			episodeInfo.showId =  dbItem['showId'];
	// 			episodeInfo.linkingWord =  "today";
	// 			episodeInfo.users = [];
	// 			episodesOnstage.push(episodeInfo);
	// 		}

	// 		if( moment(dbItem['episodesReleaseDate']).isSame(tommorow, 'days') ) {
	// 			let episodeInfo =  new Message();

	// 			episodeInfo.episodeName =  dbItem['episodeName'];
	// 			episodeInfo.episodeNumber =  dbItem['episodeNumber'];
	// 			episodeInfo.showName =  dbItem['showName'];
	// 			episodeInfo.showId =  dbItem['showId'];
	// 			episodeInfo.linkingWord =  "tomorrow";
	// 			episodeInfo.users = [];
	// 			episodesOnstage.push(episodeInfo);
	// 		}
	// 	});

	// 	//Call for handaling users that susbscribed to tv show.
	// 	this.addUserInfotoEpisode(episodesOnstage);
  //   });
  // }

  // //Queries subscription DB to find shows by id and show collection of users subsribed to it.
  // addUserInfotoEpisode(episodesOnStage) {
	// console.log('Called addUserInfotoEpisode')
	// console.log(episodesOnStage.length)

	// //Each episode in the array gets checked for users collection in db
	// episodesOnStage.forEach(episode => {

	// 	this.afs.collection(`subscriptions/tv-shows/${episode.showId}`).valueChanges().subscribe(res => {
	// 		console.log(res)
	// 		// Collection of users gets pushed into array inside episode object.
	// 		res.forEach(dbUser => {
	// 			let user = new User();

	// 			user.displayName = dbUser['name'];
	// 			user.email = dbUser['email'];
	// 			episode.users.push(user);

	// 		});

	// 		// Each item is Sent through http post with episode object to server to handle mail sending.
	// 		this.sendMessages(episode)
	// 	});
	// });
  // }

  // sendMessages(messageData) {
	// let headers = new Headers({"Content-Type": "application/json"});
	// let options = new RequestOptions({headers: headers});

	// console.log(messageData);
	// let params = JSON.stringify(messageData);

	// //** DB POST */
	// //this.http.post('http://localhost:3000/test', params, options).subscribe(res => console.log(res));
  // }
