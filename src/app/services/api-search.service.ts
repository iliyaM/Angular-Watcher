import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class ApiSearchService {
	private base_url:string = 'https://api.themoviedb.org/3/';
	private apikey: string = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';
	private sortByPopularity = '&sort_by=popularity.desc';

  constructor(private http: Http) { }

  getImageById(id, order='first', type='poster') {
  	// declarations
  	let image_obj= {image_path :''};

  	// request list of images, contains posters/backdrops
  	let images =  this.http.get(`${this.base_url}movie/${id}/images${this.apikey}`).map(res => res.json());
  	let subscribtion = images.subscribe( res => {
		// Show first poster. change if you needed
		let image_list
		// choose poster/backdrops
		if (type == 'poster') { image_list = res.posters }
		if (type == 'backdrop') { image_list = res.backdrops }

		// choose item from list by order/popularity
		if (order == 'first') {
			image_obj.image_path = image_list[0].file_path
		}
  })
	console.warn(image_obj)
  	return image_obj
  }
  getMovieList() {
  	// declerations
  	let letters = 'the'
  	let query;

   	let movieList = {
   		type: 'movieList',
   		apiObject: [],
   		images: [],
   	}

  	// get response
	query = `${this.base_url}search/movie${this.apikey}&query=${letters}`;
  	let res = this.http.get(query).map(res => res = res.json());

   	// realize object
   	let my_object;

   	let my_subscription = res.subscribe(res => {
   		my_object = res.results;

   		for (var i = 0; i < my_object.length; ++i) {
   			movieList["images"].push(this.getImageById(my_object[i].id))
   		}
   		
   		// set in dict
   		movieList["apiObject"] = my_object;
   	});

    // summary
   	console.warn(movieList)
   	console.log(query)
  	console.log(res)
   	console.log(my_subscription)

   	console.log(my_object); // contains list of api objects
  	let  resDEBUG = 'Hi'
  	return movieList
  }

}
