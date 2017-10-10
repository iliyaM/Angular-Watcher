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
* [ ] Login/Signup pages
* [x] Home page - Shows top ten movies and tvShows.
* [x] ShowItem Tv page
* [x] ShowItem Movie page
* [ ] Browse page
* [ ] Subscription page
* [ ] User profile page
* [x] Service
* [ ] Do Search in header and show result in drop down. on click implement same functionality as allways.

### Todo:
* [x] Service function to call query all movies by their popularity and call all images and display one.

* [x] Service function called for GetItemById
* Queries api with id and brings all related images
* Checks to see if movie or tvshow once and bring additional data.

* [x] Two seprate templates according to item type the expect specific data to work with.
* [x] TvShow item template is seperated into one include to handle episodes to each season (Done with subscribing to child route).



** Refrence
"backdrop_sizes": [
  "w300",
  "w780",
  "w1280",
  "original"
],
"logo_sizes": [
  "w45",
  "w92",
  "w154",
  "w185",
  "w300",
  "w500",
  "original"
],
"poster_sizes": [
  "w92",
  "w154",
  "w185",
  "w342",
  "w500",
  "w780",
  "original"
],
"profile_sizes": [
  "w45",
  "w185",
  "h632",
  "original"
],
"still_sizes": [
  "w92",
  "w185",
  "w300",
  "original"
]