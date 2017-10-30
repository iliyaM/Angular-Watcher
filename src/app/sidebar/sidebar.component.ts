import { Component, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { PublicService } from '../services/publicService';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
sidebarClose:boolean = false;
userInfo:object;
subscriptionLink = false;
subscriptions:Array<object>;

  constructor(private auth:AuthService, private db: DbService, public publicService: PublicService) { }

  ngOnInit() {
	//Get user info
	this.auth.user.subscribe(res => {
		if(res != null) {
			this.db.getUserInfo(res.userId).subscribe(res => {
				this.userInfo = res;
			});
		} else {
			this.userInfo = null;
		}
	});

	this.publicService.toggleSidebar.subscribe(() => {
		this.sidebarClose = !this.sidebarClose;
	});

  }

  getSubscriptions() {
		this.subscriptions = this.db.getMySubscriptions();
		this.subscriptionLink = !this.subscriptionLink;
  }




}
