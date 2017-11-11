//Express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const CronJob = require('cron').CronJob;

//Nodemailer
let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'angularwatcher@gmail.com',
    pass: 'angularwatcher1597500'
  }
});

// const mailOptions = {
//     from: 'angularwatcher@gmail.com', // sender address
//     to: 'iliya.melishev@gmail.com', // list of receivers
//     subject: 'Subject of your email', // Subject line
//     html: '<p>Your html here</p>'// plain text body
//   };

// transporter.sendMail(mailOptions, function (err, info) {
//     if(err)
//       console.log(err)
//     else
//       console.log(info);
//  });

const app = express();

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
app.use(express.static(path.join(__dirname, '/dist')));



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
            message.from =  'angularwatcher@gmail.com',
            message.to =  mailingList.users[i].email,
            message.subject =  `New episode of ${mailingList.showName}!`,
            message.html = `
            <div class="email-container" style="background: linear-gradient(35deg, #6F7E95 25%, #394D5A 65%);font-family: arial;min-height: 400px;position: relative;">
                <h1 style="text-align: center;position: relative;margin: 0 auto;padding: 0.5em 0;color: #f9fafb;font-weight: 400;">New Episode!!</h1>
                <h3 style="color: #f9fafb;text-align: center;margin: 0;padding: 2em 0;"> Oh Yeah ${mailingList.showName} is Coming out ${mailingList.linkingWord} prepare yourself!</h3>
                <h4 style="color: #f9fafb;text-align: center;margin: 0;padding: 2em 0;"> Episode ${mailingList.episodeNumber} ${mailingList.episodeName} </h4>

                <div class="footer" style="position: absolute;bottom: 0;left: 0;right: 0;color: #e3a74d;padding: 1em;font-weight: 700;text-align: center;">
                <p> Thank you for using Angular Watcher 
                    for questions or issues contact the developer
                </p>
                <a href="mailto:iliya.melishev@gmail.com" style="color: #f9fafb;text-decoration: none;">Iliya Melishev</a>
                </div>

            </div>`;
            sendWithNodeMailer(message);

    
    }
}

let sendWithNodeMailer = function(message) {
    transporter.sendMail(message, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
}

//will run every day at 10:00 AM
var job = new CronJob('14 14 * * *', function() {
    // do something
    checkUpdates();
     }, function () {
       /* This function is executed when the job stops */
     },
     true, /* Start the job right now */
   );


// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Running'));

module.exports = app; 