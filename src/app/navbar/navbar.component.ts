import { Component, OnInit } from '@angular/core';
import { ApiSearchService } from '../services/api-search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
results;
imageSrc:string = `https://image.tmdb.org/t/p/`;
//Check what fits and remove
posterSizes = {
	super_small: 'w92',
	small: 'w154',
	small_medium: 'w185',
	medium: 'w342',
	large: 'w500',
	huge: 'w780',
	original: 'original'
}
  constructor(private apiSearch: ApiSearchService) { }

  onKeyUp(event) {
    this.results = this.apiSearch.query('tv', event.target.value).subscribe(res => {
      this.results = res;
      console.log(res)
    });
  }

  ngOnInit() {
  }

}
