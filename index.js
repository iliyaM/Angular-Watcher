var express = require('express');
var path = require('path');
var nodemailer = require('nodemailer');
var CronJob = require('cron').CronJob;
var moment = require('moment');

const axios = require('axios');

//FireStore
var Firestore = require('@google-cloud/firestore');
var firestore = new Firestore({
    projectId: 'angular-watcher',
    keyFilename: './Angular-Watcher-5494dd72116a.json',
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
            user: 'angularwatcher@gmail.com',
            pass: 'angularwatcher1597500'
    }
});

var app = express();

const checkReleases = function() {
  const today = moment();
  const tommorow = moment().startOf('day').add(1, 'day');
  // Message class
  const episodesOnstage = [];
  const item;

  //Api key
  let apikey = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';
  let finalSeasonNumber;

    //Queries all subsribtion collection and finds what is comming out today or tomorrow
    firestore.collection('onStage/tv-shows/followed').get().then(result => {
        result.forEach(dbItem => {
            item = dbItem.data();

            if( moment(item['episodesReleaseDate']).isSame(today, 'days') ) {
                var episodeInfo = {};
                    episodeInfo.episodeName =  item['episodeName'],
                    episodeInfo.episodeNumber =  item['episodeNumber'],
                    episodeInfo.showName =  item['showName'],
                    episodeInfo.showId =  item['showId'],
                    episodeInfo.linkingWord =  "today",
                    episodeInfo.users = [],

                    episodesOnstage.push(episodeInfo);
            }

            if( moment(item['episodesReleaseDate']).isSame(tommorow, 'days') ) {
				var episodeInfo = {};
                    episodeInfo.episodeName =  item['episodeName'];
                    episodeInfo.episodeNumber =  item['episodeNumber'];
                    episodeInfo.showName =  item['showName'];
                    episodeInfo.showId =  item['showId'];
                    episodeInfo.linkingWord = "tomorrow";
                    episodeInfo.users = [];

                episodesOnstage.push(episodeInfo);
            }
        });
    }).catch(err => {
        console.log(err);
    }).then(result => {
        episodesOnstage.forEach(episode => {
            firestore.collection(`subscriptions/tv-shows/${episode.showId}`).get().then(userItem => {

                // Collection of users gets pushed into array inside episode object.
                userItem.forEach(dbUser => {
                    var user = {};
                    var tempDate = dbUser.data();

                    user.displayName = tempDate['name'];
                    user.email = tempDate['email'];
                    episode.users.push(user);

                });
            }).catch(err => {
                console.log(err);
            }).then(send => {
                getImage(episode.episodeNumber, episode.showId).then(res => {
                    episode.imagePath = res;
                    sendEmail(episode);
                });

            });
        });
    });
}

const getImage = async (epNumber, showId) => {
    let apiKey = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';

    //Get seson information for api
    let season = await axios.get(`https://api.themoviedb.org/3/tv/${showId}${apiKey}`)
        .then(response => {
        return finalSeasonNumber = response.data.seasons[response.data.seasons.length -1].season_number;
    }).catch(error => {console.log(error);});
    //Get episode image
    let image = await axios.get(`https://api.themoviedb.org/3/tv/${showId}/season/${season}/episode/${epNumber}/images${apiKey}`)
    .then(response => {
        return response.data.stills[0].file_path;
    }).catch(error => {console.log(error);});

    return image;
}

var sendEmail = function(mailingList) {
    for(var i in mailingList.users) {

        var message = {};
            message.from =  'angular-watcher.com',
            message.to =  mailingList.users[i].email,
            message.subject =  `New episode of ${mailingList.showName}!`,
            message.html = `
            <div class="email-container" style="background: linear-gradient(180deg, #6F7E95 5%, #394D5A 85%);font-family: arial;min-height: 400px;position: relative;">
                <h1 style="text-align: center;position: relative;margin: 0 auto;padding: 0.5em 0;color: #f9fafb;font-weight: 400;">New Episode!!</h1>
        
                <h3 style="color: #f9fafb;text-align: center;margin: 0;padding: 0.5em 0;"> Oh Yeah ${mailingList.showName} is Coming out ${mailingList.linkingWord} prepare yourself!</h3>
                <h4 style="color: #f9fafb;text-align: center;margin: 0;padding: 0.5em 0;">Episode number ${mailingList.episodeNumber}</h4>
                <h4 style="color: #f9fafb;text-align: center;margin: 0;padding: 0.5em 0;">${mailingList.episodeName}</h4>
        
                <a href="http://angular-watcher.com">
                    <img src="https://image.tmdb.org/t/p/w500${mailingList.imagePath}" alt="episode_poster" style="display: block;width: 90%;margin: 1em auto;box-shadow: -10px 10px 18px -2px rgba(0,0,0,0.70);">
                </a>
                
                <div class="app" style="color: #f9fafb;box-sizing: border-box;padding: 0.5em;margin: 1em 0;">
                    <h2 style="margin: 0.5em 0;">Good news now there is an Android App for angular-watcher</h2>
                    <p style="margin: 0.5em 0;">its really is revolutionary. its going to change the world! you should try it.</p>
                    <p style="margin: 0.5em 0;">Just open this link from your mobile device</p>
                    <strong style="color: #f53d3d;">*fair warning...Mind blowing stuff ahead</strong>
                    <a href="http://angualr-watcher.com" style="color: #e3a74d;text-decoration: none;padding: 0.5em 0;text-align: center;display: block;font-weight: 700;">Angular-Watcher</a>
                </div>
        
                <div class="footer" style="color: #e3a74d;padding: 1em;font-weight: 700;text-align: center;">
                    <p style="margin: 0.5em 0;"> Thank you for using Angular Watcher 
                        for questions or issues contact the developer in the link below;
                    </p>
                    <a href="mailto:iliya.melishev@gmail.com" style="color: #f9fafb;text-decoration: none;">Iliya Melishev</a>
                </div>
         </div>`;
            sendWithNodeMailer(message);
    }
}

var sendWithNodeMailer = function(message) {
    transporter.sendMail(message, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}

// //will run every day at 10:00 AM
// var job = new CronJob('28 20 * * *', function() {
//         //checkUpdates();
//         console.log('Cron job started');
// }, false);
// job.start();

const job = new CronJob({
  cronTime: '00 10 * * *',
  onTick: function() {
    checkReleases();
  },
  start: false,
  timeZone: 'Asia/Jerusalem'
});
job.start();


// Check db for new episodes comming out
const updateDb = function () {

  const episodeData = {
    episodesReleaseDate: null,
    episodeNumber: null,
    name: null,
  };

  const today = moment();

  // Grab final season number and id

  //Query api for episode realease date.
  this.api.findFinalEpisode(this.information.id, finalSeason) // Call api.

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
      episode: episodeData,
    }


// Update Database for releases info
const releseInfoJob = new CronJob({
  cronTime: '00 00 * * *',
  onTick: function() {
    updateDb();
  },
  start: false,
  timeZone: 'Asia/Jerusalem'
});

releseInfoJob.start();

// Point static path to distnodemo
app.use(express.static(path.join(__dirname, '/dist')));

app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

app.listen(80, function () {
  console.log('Server is running on port 80');
});


