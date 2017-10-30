import { Injectable } from '@angular/core';
import { CanActivate,  ActivatedRouteSnapshot,  RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	user:boolean;
	constructor(private auth: AuthService) {
		this.auth.user.subscribe(res => {
			if(res != null) {
			this.user = true;
			}else {
				this.user = false;
			}
		});
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if(this.user) {
			return true
		} else {
			return false;
		}
	}
}