# Application idea

* Movies and TV show browser

### Features:
* [ ] Follow shows
* [ ]  Notify on new episodes: 
	* Phone
	* Mail
* [ ]  Desktop application
* [ ] ? Recommendation system
* [ ] Log user activity for statistics
* [ ] Tool tip with explanations on how the site was built 
		OR an admin login that shows another version of the site with explicit explanations\

## Components
* Login/Signup pages
* Home page
* Browse page
* ShowItem page
* Subscription page
* User profile page
* Service


### Todo:
* [ ] Service function to call query all movies by their popularity and call all images and display one.
	* [ ] In tempale Homepage confine showing only 10 with option to 'show more'.

* [ ] Service function called for GetItemById
	* Queries api with id and brings all related images
	* Checks to see if movie or tvshow once and bring additional data.

* [ ] Two seprate templates according to item type the expect specific data to work with.
* [ ] TvShow item template is seperated into one include to handle episodes to each season.

