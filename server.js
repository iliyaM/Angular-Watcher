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
require('rxjs/add/observable/fromPromise');

// FireStore
const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
	projectId: 'angular-watcher',
	keyFilename: './Angular-Watcher-5494dd72116a.json',
});

const app = express();

const apiKey = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';

const showIds$ = new BehaviorSubject(null);
const finalSeason$ = new BehaviorSubject(null);
const releases$ = new BehaviorSubject(null);

// Get all showIDs from firebase in followed collection and push to observable.
const handleReleases = () => {
	const fireBaseCollection = firestore.collection('onStage/tv-shows/followed').where('episodesReleaseDate', '>', '0').get()
		.then(result => {
			result.forEach(item => {
				showIds$.next(item.data().showId);
			});
		}).catch(err => console.log(err));
};

// Show id's observable gets the final episode from final season and checks if it up to release.
showIds$
	.filter(x => x)
	.subscribe(res => {
		const showId = res;
		const today = moment();
		const tommorow = moment().startOf('day').add(1, 'day');

		axios.get(`https://api.themoviedb.org/3/tv/${showId}${apiKey}`)
			.then(result => {
				let finalSeasonNumber = result.data.seasons[result.data.seasons.length - 1].season_number;
				let showName = result.data.name;

				axios.get(`https://api.themoviedb.org/3/tv/${showId}/season/${finalSeasonNumber}${apiKey}`)
					.then(season => {
						let finalEpisode = season.data.episodes[season.data.episodes.length - 1];
						if (moment(finalEpisode.air_date).startOf('day').isSame(today.startOf('day'))) {
							releases$.next({
								seriesName: showName,
								seasonNumber: finalEpisode.season_number,
								episodeNumber: finalEpisode.episode_number,
								episodeName: finalEpisode.name,
								episodeOverview: finalEpisode.overview,
								image: finalEpisode.still_path,
								showId: showId
							});
						}
						if (moment(finalEpisode.air_date).isSame(tommorow, 'days')) {
							releases$.next({
								seriesName: showName,
								seasonNumber: finalEpisode.season_number,
								episodeNumber: finalEpisode.episode_number,
								episodeName: finalEpisode.name,
								episodeOverview: finalEpisode.overview,
								image: finalEpisode.still_path,
								showId: showId
							});
						}
					}).catch(err => console.log(err));
			}).catch(err => console.log(err))
	});

releases$.subscribe(res => {
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
