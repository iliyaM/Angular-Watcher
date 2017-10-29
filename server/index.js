var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var api_key = 'key-614ee94b7f8c17ebb9e9281cc612afbd';
var domain = 'sandboxfda8d951321e462aa50000d436f30b31.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
// const path = require('path');

// Permit the app to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });

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

app.listen(3000, function () {
    console.log('Example listening on port 3000!');
});

module.exports = app; 