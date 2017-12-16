import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
title:string =  'app component'
isMobile:boolean = false;

	constructor() {
		
		if((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
			this.isMobile = true;
		}
	}
}


