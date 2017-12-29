const mailSender = require('./emailSender');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'angularwatcher@gmail.com',
		pass: 'angularwatcher1597500'
	}
});

module.exports = {
	emailSender: (data) => {
		const message = {};
			message.from = 'angular-watcher.com',
			message.to = data.email,
			message.subject = `New episode of ${data.seriesName}!`,
			message.html = `
			<div class="email-container" style="background: linear-gradient(180deg, #6F7E95 5%, #394D5A 85%);font-family: arial;min-height: 400px;position: relative;">
                <h1 style="text-align: center;position: relative;margin: 0 auto;padding: 0.5em 0;color: #f9fafb;font-weight: 400;">New Episode!!</h1>
        
                <h3 style="color: #f9fafb;text-align: center;margin: 0;padding: 0.5em 0;"> Oh Yeah ${data.seriesName} is Coming out ${data.linkingWord} prepare yourself!</h3>
                <h4 style="color: #f9fafb;text-align: center;margin: 0;padding: 0.5em 0;">Season ${data.seasonNumber} Episode ${data.episodeNumber}</h4>
                <h4 style="color: #f9fafb;text-align: center;margin: 0;padding: 0.5em 0;">${data.episodeName}</h4>
        
                <a href="http://angular-watcher.com">
                    <img src="https://image.tmdb.org/t/p/w500${data.image}" alt="episode_poster" style="display: block;width: 90%;margin: 1em auto;box-shadow: -10px 10px 18px -2px rgba(0,0,0,0.70);">
				</a>
				
                <h5 style="color: #f9fafb;text-align: center;margin: 0;padding: 0.5em 0;">${data.episodeOverview}</h5>
                
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
			transporter.sendMail(message, function (err, info) {
				if (err)
					console.log(err)
				else
					console.log(info);
			});
	}
}
