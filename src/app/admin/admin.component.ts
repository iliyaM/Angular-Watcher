import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  OnstageRelease;
  showsWithImages;

  constructor(private db: DbService) { }

  ngOnInit() {
  }

  //Clear on stage with 0 release date.
  showNoReleaseDate() {
    this.db.ShowNoReleaseDate().subscribe(res => {
      console.log(res)
      this.OnstageRelease = res;
    });
  }
}

  
 /**
  * Function to add images to released episdes.
  update actual api to get images when subsribed.
  take into account by the time of subscruotiuon is not going to have an image.
  */
