import { Routes } from '@angular/router';
import { ItemTvComponent } from './components/item-tv/item-tv.component';
import { SeasonInformationComponent } from './components/season-information/season-information.component';
import { ModalComponent } from './components/modal/modal.component';
import { SubscriberComponent } from './components/subscriber/subscriber.component';

export const itemRoutes: Routes = [
	{
		path: '', component: ItemTvComponent, children: [
			{ path: 'season/:season_number', component: SeasonInformationComponent },
		]
	}
];
