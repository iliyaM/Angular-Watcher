import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as Rx from "rxjs/Rx";
import { TvShow } from '../interfaces/tv-show';
import { Movie } from '../interfaces/movie';
import { TvItem } from '../interfaces/tv-item';
import { TvSeasonInfo } from '../interfaces/tv-season-information';
import { TvSeason } from '../interfaces/tv-season';
import { TvEpisode } from '../interfaces/tv-episode';
import { TvCreators } from '../interfaces/tv-creators';

@Injectable()
export class ApiSearchService {
  private base_url:string = 'https://api.themoviedb.org/3';
  private apikey: string = '?api_key=ebbcc2bbea6a3127c6715e6d4e044f66';

  subscribtion;

  constructor(private http: Http) {  }

  /*
   * Initial Page load Batch call for popular on tv and movie
  */
  getTopTen() {
    return Rx.Observable.forkJoin(
        this.http.get(`${this.base_url}/tv/popular${this.apikey}&language=en-US&page=1&`).map((res:Response) => res.json()),
        this.http.get(`${this.base_url}/movie/now_playing${this.apikey}&language=en-US&page=1&`).map((res:Response) => res.json())
      )
  }

  /*
   * Extract Information from popular tv and movie and return
  */
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

  /*
   * Get infomation on tv item by Id
   * Extracting information from data
   * Creating custom observable and returning
  */

  fetchTvItem(itemId) {

    let data = this.http.get(`${this.base_url}/tv/${itemId}${this.apikey}&language=en-US&page=1&`).map(res => res.json());
    let mainObject = new TvItem();

    data.forEach(res => {
      mainObject.id =  res.id;
      mainObject.title =  res.name;
      mainObject.poster =  res.backdrop_path;
      mainObject.first_air_date =  res.first_air_date;
      mainObject.number_of_seasons =  res.number_of_seasons;
      mainObject.number_of_episodes =  res.number_of_episodes;
      mainObject.overview =  res.overview;
      mainObject.status =  res.status;

      //Construct Seasons
      res.seasons.forEach(season =>{
        let object = new TvSeasonInfo();

        object.id = season.id;
        object.season_number = season.season_number;
        object.episode_count = season.episode_count;
        object.poster = season.poster_path;
        
        mainObject.seasons.push(object)
      });

      //Construct Creators
      res.created_by.forEach(creators => {
        let Creators = new TvCreators();

        Creators.creator_id =  creators.id;
        Creators.name =  creators.name;
        Creators.profile_poster =  creators.profile_path;

        mainObject.creators.push(Creators)
      });
    });

    //Create observable from consctucted data
    let observable = Observable.create(observer => {
      observer.next(mainObject);
      observer.complete(console.log('TvItem completed'));
      observer.error(new Error("error TvItem"));
    });

    return observable;
  }

  /*
   * Get episodes to related season by item-id and season n
   * Extracting information from data
   * Creating custom observable and returning
  */
  fetchSeasonEpisodes(itemId, number) {
    let season =  new TvSeason();
    
    let data = this.http.get(`${this.base_url}/tv/${itemId}/season/${number}${this.apikey}&language=en-US&page=1&`).map(res => res.json());

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
