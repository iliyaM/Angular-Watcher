import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
singupForm: FormGroup;

emailError: string;
passwordError: string;
displayNameError: string;

	constructor(private fb: FormBuilder, private authService: AuthService ) { }

	ngOnInit() {
		this.singupForm = this.fb.group({
			'email': ['', [Validators.required, Validators.email]],
			'password': ['', [Validators.required]],
			'displayName':['', Validators.required]
		});
		this.singupForm.valueChanges.subscribe(res => this.validation());
	}

	validation() {
		// this.emailError = '';
		// this.passwordError = '';
		// this.displayNameError = '';

		let email = this.singupForm.get('email');
		let password = this.singupForm.get('password');
		let displayName = this.singupForm.get('displayName');

		//Email validation
		if (email.invalid && email.dirty) {
			if (email.errors['required']) {
				this.emailError = 'This is fucked up esse';
			}
		}
	}
//Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')

	signUpFormSubmit(){
		let email = this.singupForm.value['email'];
		let password = this.singupForm.value['password'];
		let displayName = this.singupForm.value['displayName'];
		this.authService.createNewUser(email, password, displayName);
	}
}
