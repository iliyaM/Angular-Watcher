import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   
        style({scale: '(0)', opacity: 0}),
        animate('300ms', style({scale: '(1.1)', opacity: 1}))
      ]),
      transition(':leave', [   
        style({transform: 'translateX(0)', opacity: 1}),
        animate('300ms', style({transform: 'translateX(100%)', opacity: 0}))
      ])
    ])
  ]

})

export class ModalComponent implements OnInit {
@Input()popupMessage;

  constructor(private db:DbService) { }

  ngOnInit() {
    console.log(this.popupMessage)
  }

  ngOnDestroy() {
    this.db.destroyMessage();
  }

}
