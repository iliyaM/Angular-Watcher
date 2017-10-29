import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DaysUntillPipe'
})
export class DaysUntillPipe implements PipeTransform {

  transform(value: string, args?: any): any {

    return
  }

}