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
mySubscriptions:Array<number>;

singupForm: FormGroup; //From group

//Form erros
displayNameError: string;
phoneNumberError: string;

//Svg Sprite arrayNames
index:number = 0;
male:boolean = true;
menAvatars:Array<string> = ['icon-man2','icon-man3','icon-man4','icon-man5','icon-man'];
womenAvatars:Array<string> = ['icon-woman1', 'icon-woman2','icon-woman3','icon-woman4','icon-woman5','icon-woman6','icon-woman7','icon-woman8','icon-woman9'];

	constructor(private fb: FormBuilder, public auth: AuthService, private db: DbService, private apiService: ApiSearchService) {
		//Subscribe to the user observable in auth service
		this.subscribtion = this.auth.user.subscribe(res => {
			this.userLoggedIn = res;
		});
	 }

	ngOnInit() {
		this.singupForm = this.fb.group({
			'displayName':['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*[a-zA-Z0-9]$')])],
			'phoneNumber':['', Validators.compose([Validators.required, Validators.pattern(/^05\d([-]{0,1})\d{7}$/)])]
		});
		this.singupForm.valueChanges.subscribe(res => this.validation()); //Subscribe to value changes and run validation function
		this.getSupscriptionDate();
	}

	ngOnDestroy() {
		this.subscribtion.unsubscribe();
	}

	getSupscriptionDate() {
		this.mySubscriptions = this.db.getMySubscriptions();
	}

	//Form validation function
	validation() {
		this.displayNameError = '';
		this.phoneNumberError = '';

		let displayName = this.singupForm.get('displayName');
		let phoneNumber = this.singupForm.get('phoneNumber');

		//checkDisplayName
		if (displayName.invalid) {
			if (displayName.errors['required']) {
				this.displayNameError = 'The NickName is required';
			}
			if (displayName.errors['pattern']) {
				this.displayNameError = 'only English characters are allowed'
			}
		}

		//CheckPhone
		if (phoneNumber.invalid && phoneNumber.dirty) {
			if (phoneNumber.errors['required']) {
				this.phoneNumberError = 'The phoneNumber is required';
			}
			if (phoneNumber.errors['pattern']) {
				this.phoneNumberError = 'Normal Israeli Phone number Please'
			}
		}
	}
	
	//Form submit function
	signUpFormSubmit(){
		let displayName = this.singupForm.value['displayName'];
		let phoneNumber = this.singupForm.value['phoneNumber'];

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
		this.db.updateUser(avatar, phoneNumber, this.userLoggedIn.userId, displayName);
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
}
