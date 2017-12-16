import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { ProfileComponent } from './profile.component';

// Routes
import { profileRoutes } from './profileRoutes';

// ngchart
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AuthAdmin } from '../guards/authAdmin';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(profileRoutes),
		FormsModule,
		ReactiveFormsModule,
		ChartsModule,
	],
	declarations: [
		ProfileComponent
	],
	providers: [AuthAdmin]
})
export class ProfileModule { }
