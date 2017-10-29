import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
sidebarClose:boolean = false;
userInfo:object;
subscriptions:Array<object>;

  constructor(private auth:AuthService, private db: DbService) { }

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

  }

  getSubscriptions() {
	this.subscriptions = this.db.getMySubscriptions();
	console.log(this.subscriptions)
  }

}
