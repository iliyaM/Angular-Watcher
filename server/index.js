//Express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

//Moment js
const moment = require('moment');

//MailGun
const api_key = 'key-614ee94b7f8c17ebb9e9281cc612afbd';
const domain = 'sandboxfda8d951321e462aa50000d436f30b31.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

//FireStore
const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
    projectId: 'angular-watcher',
    keyFilename: '/projects/Angular-Watcher-5494dd72116a.json',
});



// Permit the app to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/test', function(req, res) {
    console.log(req.body)
    // let message = {
    //     from: 'iliya.melishev@gmail.com',
    //     to: req.body.email,
    //     subject: `New episode of ${req.body.showName}!`,
    //     text: `There is new episode coming out ${req.body.linkingWord} for ${req.body.showName} - episode: ${req.body.episodeNumber} - '${req.body.episodeName}'`,
    // };

    // mailgun.messages().send(message, function (error, body) {
    //     console.log('Message Inside MailGun:');
    //     console.log(message);
    
    //     if(!error) {
    //         console.log('Mail sent')
    //     } else {
    //         console.log('Error')
    //         console.log(error)
    //     }
    // });
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

checkUpdates();



// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(3000, function () {
    console.log('Example listening on port 3000!');
});

module.exports = app; 