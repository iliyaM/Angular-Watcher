import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as Rx from "rxjs/Rx";
import { TvShow } from '../interfaces/tv-show';
import { Movie } from '../interfaces/movie';
import { TvItem } from '../interfaces/tv-item';
import { TvSeason } from '../interfaces/tv-season';
import { TvEpisode } from '../interfaces/tv-episode';

@Injectable()
export class ApiSearchService {
  private base_url:string = 'https://api.themoviedb.org/3';
  private apikey: string = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';

  subscribtion;

  constructor(private http: Http) {  }

  getTopTen() {
    return Rx.Observable.forkJoin(
        this.http.get(`${this.base_url}/tv/popular${this.apikey}&language=en-US&page=1&`).map((res:Response) => res.json()),
        this.http.get(`${this.base_url}/movie/now_playing${this.apikey}&language=en-US&page=1&`).map((res:Response) => res.json())
      )
  }

  getTvCustomData(data) {
    let object:Array<TvShow> = [];

    data.forEach(result => {

      let custom = {
        title: result.name,
        vote_count : result.vote_count,
        posters :  result.poster_path,
        overview : result.overview,
        genre_ids :  result.genre_ids,
        id :  result.id,
        release_date : result.first_air_date,
      }
      object.push(custom)
    });
    return object;
  }

  getMovieCustomData(data) {
     let object:Array<Movie> = [];

     data.forEach(result => {
       let custom = {
         title: result.title,
         vote_count : result.vote_count,
         posters :  result.poster_path,
         overview : result.overview,
         genre_ids :  result.genre_ids,
         id :  result.id,
         release_date : result.release_date,
       }
       object.push(custom)
     });
     return object;
  }

  fetchTvItem(itemId) {
    return this.http.get(`${this.base_url}/tv/${itemId}${this.apikey}&language=en-US&page=1&`).map(res => res.json());
  }

  constructTvItem(res) {
    let mainObject = new TvItem();

    mainObject = {
      id: res.id,
      title: res.name,
      poster: res.backdrop_path,
      first_air_date: res.first_air_date,
      number_of_seasons: res.number_of_seasons,
      number_of_episodes: res.number_of_episodes,
      overview: res.overview,
      status: res.status,
      seasons: [],
      creators: [],
    }

    //Check seasons
    res.seasons.forEach(function(season){
      let construction = {
        id: season.id,
        season_number: season.season_number,
        episode_count: season.episode_count,
        poster: season.poster_path,
      }
      mainObject.seasons.push(construction) //Push to main object
    });

    //Check creators
    res.created_by.forEach(function(creators){
      let object = {
        creator_id: creators.id,
        name: creators.name,
        profile_poster: creators.profile_path,
      }
      mainObject.creators.push(object) //Push to main object
    });
 
    return mainObject
  }

  fetchSeasonEpisodes(itemId, number) {
    let season =  new TvSeason();
    
    let data = this.http.get(`${this.base_url}/tv/${itemId}/season/${number}${this.apikey}&language=en-US&page=1&`).map(res => res.json());
    //Getting observable and fetching json and forEaching and constructing.
    data.forEach(res => {
      season.id = res.id;
      season.name = res.name;
      season.release_data = res.air_date;
      season.poster = res.poster_path;
      season.overview = res.overview;

      res.episodes.forEach(res => {
        let episode = new TvEpisode();

        episode.id = res.id,
        episode.name  = res.name,
        episode.release_date  = res.air_date,
        episode.poster  = res.still_path,
        episode.overview = res.overview,
        episode.number = res.episode_number;

        season.episodes.push(episode);
      });
    });

    console.log(season)
    //Create custom fucking observable and subscribe in component.
    let observable = Observable.create(observer => {
      observer.next(season);
      observer.complete(console.log('completed'));
      observer.error(new Error("error"));
    });

    return observable;
  }


  unsubscribe() {
    this.subscribtion.unsubscribe();
  }


}
