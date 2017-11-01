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
        return this.afs.doc<User>(`users/${user.uid}/info/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
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
  private updateUserData(userCredential) {

    //Get user document
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${userCredential.uid}/info/${userCredential.uid}`);
    const userCollections: AngularFirestoreCollection<User> = this.afs.collection('users');

    //Construct user data object
    const data: User = {
      userId: userCredential.uid,
      email: userCredential.email,
      displayName: userCredential.displayName,
      avatar: 'icon-man',
    }

    if(userRef == null) {
      console.log('Found user')
      return;
    } else {
      console.log('Creating user')
      userRef.set(data);
    }
    return;
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

}
