import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//Firebase
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

//rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

//Interfaces
import { User } from '../interfaces/user';

@Injectable()
export class AuthService {
user: Observable<User>;
userCollection: AngularFirestoreCollection<User>;
userDocument: AngularFirestoreDocument<User>;

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    // Get auth data
    this.user = this.afAuth.authState.switchMap(user => {
      if(user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    })
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  //Pass any provider
  private oAuthLogin(provider) { 
    return this.afAuth.auth.signInWithPopup(provider).then((credential) => {
      this.updateUserData(credential.user);
    });
  }

  //Create data from loginProvider and navigate
  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    this.router.navigate(['/register']);

    const data: User = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName,
    }

    return userRef.set(data);
  }

  updateUser(avatar:string, phoneNumber:number, userId:string, displayName:string){
    let data = {
        avatar: avatar,
        phoneNumber: phoneNumber,
        displayName: displayName,
      }
    let user:AngularFirestoreDocument<User> = this.afs.doc(`users/${userId}`); //Where to update
    user.update(data);
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

}
