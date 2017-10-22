import { NgModule } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

@NgModule({
  imports: [
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AuthService],
  declarations: []
})
export class CoreModule { }
