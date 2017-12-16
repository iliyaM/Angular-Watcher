import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Item Module component
import { ItemTvComponent } from './components/item-tv/item-tv.component';
import { SeasonInformationComponent } from './components/season-information/season-information.component';
import { ModalComponent } from './components/modal/modal.component';
import { SubscriberComponent } from './components/subscriber/subscriber.component';

// Routes
import { itemRoutes } from './itemRoutes';

// Services
import { ApiSearchService } from '../services/api-search.service';
import { DbService } from '../services/db.service';
import { PublicService } from '../services/publicService';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(itemRoutes),
	],
	declarations: [
		ItemTvComponent,
		SeasonInformationComponent,
		ModalComponent,
		SubscriberComponent
	],
	providers: [ApiSearchService, DbService, PublicService]
})
export class ItemModule { }
