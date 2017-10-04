import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

@Injectable()
export class AuthService {

private authState: Observable<firebase.User>;
private userDetails: firebase.User = null;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
  	this.authState = afAuth.authState;

  	this.authState.subscribe((res) => {
  		if (res) {
  			this.userDetails = res;
  			console.log(this.userDetails);
  		} else {
  			this.userDetails = null;
  		}
  	});

  }
    createNewUser(email, password, displayName) {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          this.saveUserData(email, displayName);
        }).catch(error => console.log(`You have a fucking error${error}`));
      this.router.navigate(['home']);
    };

    saveUserData(email:string, displayName:string) {
      let path = `users/${this.afAuth.auth.currentUser.uid}`;
      let data = {
        email: email,
        displayName: displayName
      };
      this.db.object(path).set(data)
        .catch(error => console.log(`error in set new user ${error}`));
    }
}
