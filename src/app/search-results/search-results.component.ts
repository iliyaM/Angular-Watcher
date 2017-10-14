import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ApiSearchService } from '../services/api-search.service';
import { MediaItem } from '../interfaces/media_item';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})

export class SearchResultsComponent implements OnInit {
public results:Array<MediaItem>;
public menuSwitcher:boolean = false;
public search = new FormControl();

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

navigateToPage(type, name, id) {
  let newName = name.split(' ').join('_');
  this.router.navigate([type, newName, id]);
}

close() {
  this.menuSwitcher = false;
}
  constructor(private apiSearch: ApiSearchService, private router:Router) { }

  ngOnInit() {

    this.search.valueChanges.subscribe(data => {
        if (this.search.dirty && data == '') {
          this.menuSwitcher = false;
        } else {
          this.menuSwitcher = true;
          this.apiSearch.search(data).subscribe(res => this.results = res);
        }
    });
  }

}




