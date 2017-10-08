import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-season-information',
  templateUrl: './season-information.component.html',
  styleUrls: ['./season-information.component.css']
})
export class SeasonInformationComponent implements OnInit {
@Input() season;
imageSrc:string = `https://image.tmdb.org/t/p/`;
// Poster sized of easier use
posterSizes = {
	super_small: 'w92',
	small: 'w154',
	small_medium: 'w185',
	medium: 'w342',
	large: 'w500',
	huge: 'w780',
	original: 'original'
}

  constructor() { }

  ngOnInit() {
  }

}
