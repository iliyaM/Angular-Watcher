import { Component, OnInit, Input } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

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

  constructor() { }

  ngOnInit() {
  }

}
