import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ApiSearchService } from '../services/api-search.service';
import { MediaItem } from '../interfaces/media_item';

// Rxjs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: ['./search-results.component.less']
})

export class SearchResultsComponent implements OnInit {
	public results;
	public menuSwitcher = false;
	public search = new FormControl();

	imageSrc = `https://image.tmdb.org/t/p/`;
	posterSizes = {
		super_small: 'w92',
		small: 'w154',
		small_medium: 'w185',
		medium: 'w342',
		large: 'w500',
		huge: 'w780',
		original: 'original'
	};

	navigateToPage(type, name, id) {
		const newName = name.split(' ').join('_');
		this.router.navigate([type, newName, id]);
	}

	close() {
		this.menuSwitcher = false;
	}
	constructor(private apiSearch: ApiSearchService, private router: Router) { }

	ngOnInit() {
		this.search.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.switchMap(observableValue => this.apiSearch.search(observableValue))
			.subscribe(res => {
				this.menuSwitcher = true;
				this.results = res;
			});
	}

}




