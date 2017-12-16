import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// services
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { ApiSearchService } from '../services/api-search.service';
// Interfaces;
import { User } from '../interfaces/user';

// Random namesArray
import { getRandomName } from '../../assets/random_names';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit, OnDestroy {
	userLoggedIn: User; // User object from authentication subscription

	subscribtion: Subscription;
	mySubscriptions;

	singupForm: FormGroup; // From group

	// Form erros
	displayNameError: string;

	// Svg Sprite arrayNames
	index = 0;
	male = true;
	menAvatars: Array<string> = ['icon-man2', 'icon-man3', 'icon-man4', 'icon-man5', 'icon-man'];
	womenAvatars: Array<string> = ['icon-woman1', 'icon-woman2', 'icon-woman3', 'icon-woman4', 'icon-woman5', 'icon-woman6', 'icon-woman7', 'icon-woman8', 'icon-woman9'];

	// CHART configs
	public doughnutChartLabels: string[] = ["Animation", "Comedy", "Action & Adventure", "Sci-Fi & Fantasy", "Drama", "Crime"];
	public doughnutChartData: number[] = [];
	public doughnutChartType = 'doughnut';
	private options = {
		legend: { position: 'left' }
	};

	dataArrived = false;
	colors = [
		{
			backgroundColor: ['#2FBCD0',
				'#A47669',
				'#C4996C',
				'#949599',
				'#FFC853',
				'#F48859',
				'#EE534F',
				'#E52765',
				'#582E60',
				'#74507C',
				'#1170A8',
				'#19A8E2',
				'#31BBA1',
				'#8FCA6E'
			]
		}
	];


	constructor(private fb: FormBuilder, public auth: AuthService, public db: DbService, private apiService: ApiSearchService) {
		// Subscribe to the user observable in auth service
		this.subscribtion = this.auth.user.subscribe(res => {
			this.userLoggedIn = res;
			this.getMyStatistics();
		}); // End Auth
	}

	ngOnInit() {
		this.singupForm = this.fb.group({
			'displayName': ['', Validators.pattern('[\\w\\-\\s\\/]+')],
		});
		this.singupForm.valueChanges.subscribe(res => this.validation()); // Subscribe to value changes and run validation function
		this.mySubscriptions = this.db.getMySubscriptions();
	}

	ngOnDestroy() {
		this.subscribtion.unsubscribe();
	}

	// Get statistsics objects
	getMyStatistics() {
		// get user genres
		const data = this.db.getUserGenres(this.userLoggedIn.userId);

		data.subscribe(res => {
			if (res.length > 0) {
				const array = [];
				res.forEach(result => {
					array.push(result['showId']);
				});
				this.apiService.getGenres(array).subscribe(res => {
					this.doughnutChartData = res.data;
					this.doughnutChartLabels = res.labels;

					setTimeout(() => {
						this.dataArrived = !this.dataArrived;
					}, 400);
				});
			}
		});
	}

	// Form validation function
	validation() {
		this.displayNameError = '';

		const displayName = this.singupForm.get('displayName');

		// checkDisplayName
		if (displayName.invalid && displayName.dirty) {
			if (displayName.errors['pattern']) {
				this.displayNameError = 'only English characters are allowed';
			}
		}
	}

	// Form submit function
	signUpFormSubmit() {
		let displayName = this.singupForm.value['displayName'];

		// Check for avatar gender
		let avatar;
		if (this.male) {
			avatar = this.menAvatars[this.index];
		} else {
			avatar = this.womenAvatars[this.index];
		}

		// If no value has changed drab default value from user authObject
		if (displayName === '') {
			displayName = this.userLoggedIn.displayName;
		}
		this.db.updateUser(avatar, this.userLoggedIn.userId, displayName);
	}

	// Avatar buttons
	next(arrayType) {
		this.index++;
		if (this.index >= arrayType.length) {
			this.index = 0;
		}
	}

	prev(arrayType) {
		if (this.index === 0) {
			this.index = arrayType.length;
		}
		this.index--;
	}

	// Generate random name
	generateRandom() {
		const name = getRandomName();
		this.singupForm.patchValue({ displayName: name });
	}

	stopFollowing(userId, showName, showId) {
		this.db.removeSubscription(userId, showName, showId);
		this.dataArrived = !this.dataArrived;
	}
}
