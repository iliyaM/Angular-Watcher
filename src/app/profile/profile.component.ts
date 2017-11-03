import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

//Rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

//services
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { ApiSearchService} from '../services/api-search.service';
//Interfaces;
import { User } from '../interfaces/user';

//Random namesArray
import { getRandomName } from '../../assets/random_names';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
userLoggedIn:User; //User object from authentication subscription

subscribtion: Subscription; 
mySubscriptions;

genres:Array<object>;

singupForm: FormGroup; //From group

//Form erros
displayNameError: string;

//Svg Sprite arrayNames
index:number = 0;
male:boolean = true;
menAvatars:Array<string> = ['icon-man2','icon-man3','icon-man4','icon-man5','icon-man'];
womenAvatars:Array<string> = ['icon-woman1', 'icon-woman2','icon-woman3','icon-woman4','icon-woman5','icon-woman6','icon-woman7','icon-woman8','icon-woman9'];

	constructor(private fb: FormBuilder, public auth: AuthService, public db: DbService, private apiService: ApiSearchService) {
		//Subscribe to the user observable in auth service
		this.subscribtion = this.auth.user.subscribe(res => {
			this.userLoggedIn = res;
		});
	 }

	ngOnInit() {
		this.singupForm = this.fb.group({
			'displayName':['',Validators.pattern('[\\w\\-\\s\\/]+')],
		});
		this.singupForm.valueChanges.subscribe(res => this.validation()); //Subscribe to value changes and run validation function
		this.mySubscriptions = this.db.getMySubscriptions()
		this.genres = this.db.getMyStatistics();
		console.log(this.genres)
	}

	ngOnDestroy() {
		this.subscribtion.unsubscribe();
	}

	//Form validation function
	validation() {
		this.displayNameError = '';

		let displayName = this.singupForm.get('displayName');

		//checkDisplayName
		if (displayName.invalid && displayName.dirty) {
			if (displayName.errors['pattern']) {
				this.displayNameError = 'only English characters are allowed'
			}
		}
	}
	
	//Form submit function
	signUpFormSubmit(){
		let displayName = this.singupForm.value['displayName'];

		//Check for avatar gender
		let avatar;
		if(this.male) {
			avatar = this.menAvatars[this.index];
		} else {
			avatar = this.womenAvatars[this.index];
		}

		//If no value has changed drab default value from user authObject
		if(displayName == '') {
			displayName = this.userLoggedIn.displayName;
		}
		this.db.updateUser(avatar, this.userLoggedIn.userId, displayName);
	}

	//Avatar buttons
	next(arrayType) {
		this.index ++
		if(this.index >= arrayType.length) {
			this.index = 0;
		}
	}

	prev(arrayType) {
		if(this.index == 0) {
			 this.index = arrayType.length;
		}
		this.index --;
	}
	
	//Generate random name
	generateRandom() {
		let name = getRandomName();
		this.singupForm.patchValue({displayName: name});
	}

	stopFollowing(userId, showName) {
		this.db.removeSubscription(userId, showName, showId);
	}
}
