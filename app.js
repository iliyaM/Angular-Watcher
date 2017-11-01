//Express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const CronJob = require('cron').CronJob;
const app = express();

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function() {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(
            ['https://', req.get('Host'), req.url].join('')
        );
        }
        next();
    }
}

// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());

//Moment js
const moment = require('moment');

//FireStore
const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
    projectId: 'angular-watcher',
    keyFilename: '/projects/Angular-Watcher-5494dd72116a.json',
});

// Permit the app to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Point static path to distnodemo
app.use(express.static(path.join(__dirname, '../dist')));

//will run every day at 12:00 AM
let job = new CronJob('0 0 0 * * *', function() {
    checkUpdates();
});

let checkUpdates = function() {
    let today = moment();
    let tommorow = moment().startOf('day').add(1, 'day');
    // Message class
    let episodesOnstage = [];
    let item;

    //Queries all subsribtion colletion and finds what is comming out today or tomorrow
    firestore.collection('onStage/tv-shows/followed').get().then(result => {
        result.forEach(dbItem => {
            item = dbItem.data();

            if( moment(item['episodesReleaseDate']).isSame(today, 'days') ) {
                let episodeInfo = {};
                    episodeInfo.episodeName =  item['episodeName'],
                    episodeInfo.episodeNumber =  item['episodeNumber'],
                    episodeInfo.showName =  item['showName'],
                    episodeInfo.showId =  item['showId'],
                    episodeInfo.linkingWord =  "today",
                    episodeInfo.users = [],
 
                episodesOnstage.push(episodeInfo);
            }
            
            if( moment(item['episodesReleaseDate']).isSame(tommorow, 'days') ) {
				let episodeInfo = {};
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
                    let user = {};
                    let tempDate = dbUser.data();

                    user.displayName = tempDate['name'];
                    user.email = tempDate['email'];
                    episode.users.push(user);
                    
                });
            }).catch(err => {
                console.log(err);
            }).then(dick => sendEmail(episode) );
        });
    });
}

let sendEmail = function(mailingList) {
    console.log('mailingList')
    console.log(mailingList)
    
    for(var i in mailingList.users) {
        let message = {};
            message.from =  'iliya.melishev@gmail.com',
            message.to =  mailingList.users[i].email,
            message.subject =  `New episode of ${mailingList.showName}!`,
            message.text = `There is new episode coming out ${mailingList.linkingWord} for ${mailingList.showName} - episode: ${mailingList.episodeNumber} - '${mailingList.episodeName}'`;

            sendFromMailGun(message);
    }
}

let sendFromMailGun = function(message) {
    mailgun.messages().send(message, function (error, body) {
    
        if(!error) {
            console.log('Mail sent')
        } else {
            console.log('Error')
            console.log(error)
        }
    });
}


// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Running'));

module.exports = app; 