const express = require('express');
const path = require('path');
const CronJob = require('cron').CronJob;
const moment = require('moment');
const axios = require('axios');
const mailSender = require('./emailSender');

const Observable = require('rxjs/Observable').Observable;
const BehaviorSubject = require('rxjs/BehaviorSubject').BehaviorSubject;
const Subject = require('rxjs/Subject').Subject;

// patch Observable with appropriate methods
require('rxjs/add/observable/of');
require('rxjs/add/operator/map');
require('rxjs/add/operator/filter');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/delay');


// FireStore
const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
	projectId: 'angular-watcher',
	keyFilename: './Angular-Watcher-5494dd72116a.json',
});

const app = express();

const apiKey = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';

const showIds$ = new BehaviorSubject(null);
const shows$ = new BehaviorSubject(null);
const releases$ = new BehaviorSubject(null);

const today = moment().startOf('day');
const tomorrow = moment().startOf('day').add(1, 'days');

// Get all showIDs from firebase in followed collection and push to observable.
const handleReleases = () => {
	const fireBaseCollection = firestore.collection('onStage/tv-shows/followed').get()
		.then(result => {
			result.forEach(item => {
				showIds$.next(item.data().showId);
			});
		}).catch(err => console.log(err));
};

// Show id's observable gets the final episode from final season and checks if it up to release.
showIds$
	.map(x => x)
	.subscribe(showId => {
		if (showId) {
			axios.get(`https://api.themoviedb.org/3/tv/${showId}${apiKey}`)
				.then(result => {
					shows$.next(
						{
							showId: showId,
							finalSeason: result.data.seasons[result.data.seasons.length - 1].season_number,
							showName: result.data.name
						}
					)
				}).catch(err => console.log(err));
		}
	});

shows$
	.map(x => x)
	.delay(10000)
	.subscribe(result => {
		if (result) {
			axios.get(`https://api.themoviedb.org/3/tv/${result.showId}/season/${result.finalSeason}${apiKey}`)
				.then(seasonInfo => {
					seasonInfo.data.episodes.forEach(episode => {
						if (moment(episode.air_date).startOf('day').isSame(today)) {
							releases$.next({
								seriesName: result.showName,
								seasonNumber: episode.season_number,
								episodeNumber: episode.episode_number,
								episodeName: episode.name,
								episodeOverview: episode.overview,
								image: episode.still_path,
								showId: result.showId,
								linkingWord: 'today'
							});
						}
						if (moment(episode.air_date).isSame(tomorrow)) {
							releases$.next({
								seriesName: result.showName,
								seasonNumber: episode.season_number,
								episodeNumber: episode.episode_number,
								episodeName: episode.name,
								episodeOverview: episode.overview,
								image: episode.still_path,
								showId: result.showId,
								linkingWord: 'tomorrow'
							});
						}
					});
				}).catch(err => console.log(err));
		}
	});

releases$
	.map(x => x)
	.subscribe(res => {
		if (res) {
			const fireBaseCollection = firestore.collection(`subscriptions/tv-shows/${res.showId}`).get()
				.then(result => {
					result.forEach(item => {
						const userData = item.data();
						const finalObject = res;
						finalObject.userName = userData.name;
						finalObject.email = userData.email;
						mailSender.emailSender(finalObject);
					});
				}).catch(err => console.log(err));
		}
	});

const job = new CronJob({
	cronTime: '00 10 * * *',
	onTick: function () {
		handleReleases();
	},
	start: false,
	timeZone: 'Asia/Jerusalem'
});
job.start();

app.use(express.static(path.join(__dirname, '/dist')));

app.get('*', function (req, res) {
	res.send('Something')
	res.sendFile(path.join(__dirname, '/dist/index.html'));
});
app.listen(80, function () {
	console.log('Server is running on port 80');
});
