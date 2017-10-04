import { Component, OnInit } from '@angular/core';
import { ApiSearchService } from '../services/api-search.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
movieList: object;

  constructor(private apiService: ApiSearchService) { }

  ngOnInit() {
  	this.movieList = this.apiService.getMovieList();
  }



}
