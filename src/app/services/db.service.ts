import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';


interface Note {
  something: number;
  somethingElse: number;
  id?: number;
}


@Injectable()
export class DbService {

  notesCollection: AngularFirestoreCollection<Note>;
  notes: Observable<Note[]>;

  constructor(private afs:AngularFirestore) { }

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
