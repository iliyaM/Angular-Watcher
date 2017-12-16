import { Injectable } from '@angular/core';
import { CanActivate,  ActivatedRouteSnapshot,  RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthAdmin implements CanActivate {
	private admin;

	constructor(private auth: AuthService, private router: Router, private afauth: AngularFireAuth) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> {
		console.log("canActivate");

		return this.afauth.authState.take(1).map(auth => {

			if (auth.uid == 'hH9FnGCLLrYqOz14j0taHn9du3K2' ) {
				console.log('Access with uid')
				return true;
			} else {
				console.log('Denied by uid')
				this.router.navigateByUrl('home');
				return false;
			}

		});
	} 
}
