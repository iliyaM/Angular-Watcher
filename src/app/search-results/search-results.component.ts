import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiSearchService } from '../services/api-search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
public type:string = 'tv';
public results;
public menuSwitcher:boolean = false;

public isMovie:boolean;
public isTv:boolean = true;

imageSrc:string = `https://image.tmdb.org/t/p/`;
posterSizes = {
	super_small: 'w92',
	small: 'w154',
	small_medium: 'w185',
	medium: 'w342',
	large: 'w500',
	huge: 'w780',
	original: 'original'
}

public search = new FormControl();

  constructor(private apiSearch: ApiSearchService) { }

  ngOnInit() {

    this.search.valueChanges.subscribe(data => {
        if (this.search.dirty && data == '') {
          this.menuSwitcher = false;
        } else {
          this.menuSwitcher = true;
          this.apiSearch.search(this.type, data).subscribe(result => this.results = result);
        }
    });
  }

}




