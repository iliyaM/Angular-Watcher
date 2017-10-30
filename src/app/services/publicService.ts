import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class PublicService {
  public toggleSidebar: EventEmitter<any> = new EventEmitter();
  
}