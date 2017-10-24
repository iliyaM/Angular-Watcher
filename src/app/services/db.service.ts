import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';


import { AuthService } from '../services/auth.service';
import { ApiSearchService } from '../services/api-search.service';

interface OnStage {
  showId: number,
  type: string,
  releaseDate: Date,
}

interface Subscriber {
  name: string,
  userId: number,
  phoneNmber: number,
  email: string,
}

/**
 * Data structure.
 * [  ] => Collections,   (   ) => Document
 * [Subscriptions] => (tv-shows) => [ShowId] => (userInfo)
 * [OnStage] => (tv-shows) => [followed] => (ShowId + ReleaseDate)
 * 
 * 
 * 
 * Todo
 * 
 */

@Injectable()
export class DbService {
  constructor(private afs:AngularFirestore, public authService: AuthService, private api:ApiSearchService) {
  
   }

  handleOnFollowInDb(data) {
    const subscriptionsDoc: AngularFirestoreDocument<Subscriber> = this.afs.doc(`subscriptions/tv-shows/${data.showId}/${data.userName}`);

    const subscriber = {
      name: data.userName,
      userId: data.userId,
      phoneNmber: data.phoneNumber,
      email: data.email,
    }

    //populate on stage 
    const onStageDoc: AngularFirestoreDocument<OnStage> = this.afs.doc(`onStage/tv-shows/followed/${data.showName}`);
    
    const newOnStageShow = {
      showId: data.showId,
      type: data.type,
      releaseDate: data.episodeReleaseDate,
    }

    //Populate users subsribtions
    const userSubs: AngularFirestoreDocument<any> = this.afs.doc(`users/${data.userId}/subscriptions/${data.showName}`);

    const newSubscriptionForUser = {
      showName: data.showName,
      showId: data.showId,
    }

    //Update db
    subscriptionsDoc.set(subscriber);
    onStageDoc.set(newOnStageShow);
    userSubs.set(newSubscriptionForUser);

    return;
  }

  checkOnStage() {
    let today = new Date().toISOString().slice(0,10);
    let soonBeOut:Array<number> = [];
    //Find with smaller that today.
    let data = this.afs.collection(`onStage/tv-shows/followed`, ref => {return ref.where(`releaseDate`, '<' , today)}).valueChanges().subscribe(res => {

      //Extranct show ids.
      res.forEach(result => {
        soonBeOut.push(result['showId']);
      });

      //Grab Users who care
      this.findCaringUsers(soonBeOut);
    });
    

  }

  findCaringUsers(soonBeOutShows) {
    soonBeOutShows.forEach(show => {
      let users = this.afs.collection(`subscriptions/tv-shows/${show}`);
      users.valueChanges().subscribe(res => {
        console.log(res);
      });
    });
  }

  updateUser(avatar:string, phoneNumber:number, userId:string, displayName:string){
    let data = {
        avatar: avatar,
        phoneNumber: phoneNumber,
        displayName: displayName,
      }
    let user = this.afs.doc(`users/${userId}/info/${userId}`); //Where to update
    user.update(data);
  }

  
  getMySubscriptions() {
    let sub: Subscription;
    let fetched = [];
    sub = this.authService.user.subscribe(res => {
        let data = this.afs.collection(`users/${res.userId}/subscriptions`, ref => {return ref.where('showId', '>', 0)}).valueChanges().subscribe(res => {
          res.forEach(result => {
            this.api.fetchTvItem(result['showId']).subscribe(res => fetched.push(res));
          });
        });
    });
    return fetched;
  }

  

  // getNotes(){
  //   this.notesCollection = this.afs.collection('notes');  // refrence

  //   this.notesCollection = this.afs.collection('notes', ref => {
  //     return ref.orderBy('content') //"'content: AAA', 'conent: 'BBB'"
  //   }); 

  //   this.notesCollection = this.afs.collection('notes', ref => {
  //     return ref.orderBy('hearts') //"'hearts: 0, 'hearts: '1' hearts: '2"
  //     return ref.orderBy('hearts', 'desc') //"'hearts: 2, 'hearts: '1' hearts: '0"
  //     return ref.orderBy('hearts', 'desc').limit(2) //"'hearts: 2, 'hearts: '1'

  //     return ref.where('hearts', '>=', 5) // Filter
  //     return ref.where('hearts', '=', 7)
  //     return ref.where('hearts', '==', 1)// error

  //     return ref.where('hearts', '==', 2).where('content', '==', 'AAA');
  //   }); 


  //   this.notes = this.notesCollection.valueChanges() // observable of notes data
  //   ///Loop over data in html. | async
  // }

  // //DOCUMENT
  // noteDoc: AngularFirestoreDocument<Note>;
  // NoteDocument: Observable<Note>;

  // getDocument(){
  //   this.noteDoc = this.afs.doc('notes/8776799i8HHSD') //Id 
  //   this.NoteDocument = this.noteDoc.valueChanges();

  //   //loop in html
  // }


  // //Update
  // newContent: string; //[(NgModle)]="newContent"  // Bound to input;

  // writeDocument() { //ON the refrence not the observable/
  //   this.noteDoc.update({content: this.newContent});
  // }
 
}
