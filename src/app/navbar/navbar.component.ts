import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { PublicService } from '../services/publicService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})

export class NavbarComponent implements OnInit {

  constructor(public auth:AuthService, public publicService: PublicService) { }

  ngOnInit() {
  }

  toggleSideBar() {
    this.publicService.toggleSidebar.emit();
  }

}