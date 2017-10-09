import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private santisizer: DomSanitizer){}

  transform(url) {
    return this.santisizer.bypassSecurityTrustUrl(url);
  }
}
