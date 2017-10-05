import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class ApiSearchService {
	private base_url:string = 'https://api.themoviedb.org/3';
	private apikey: string = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';
	private sorting = {
    now_playing: 'now_playing',
    popularity: '&popularity'
  }

  constructor(private http: Http) { }
  //Calls HTTP to api with **NOW PLAYING filter and maps to json format
  getMovieList() {
    return this.http.get(`${this.base_url}/movie/now_playing${this.apikey}&language=en-US&page=1`).map(res => res.json());
  }
  //Calls HTTP to api with **POPULAR filter and maps to json format
  getTvList() {
    return this.http.get(`${this.base_url}/tv/popular${this.apikey}&language=en-US&page=1`).map(res => res.json());
  }
  //Calls HTTP to api with ID qurty and maps 
  getTvItem(id) {
    return this.http.get(`${this.base_url}/tv/${id}${this.apikey}&language=en-US`).map(res => res.json());
  }
  //Calls HTTP to api with ID qurty for SeasonEpisodes and maps 
  findRelatedEpisodes(tvItemId, seasonNumber) {
    return this.http.get(`${this.base_url}/tv/${tvItemId}/season/${seasonNumber}${this.apikey}&language=en-US`).map(res => res.json());
  }

}
