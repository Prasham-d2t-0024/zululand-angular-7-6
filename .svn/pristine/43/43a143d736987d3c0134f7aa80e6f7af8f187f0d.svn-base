import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AboutusDataService } from '../core/data/aboutus-data.service';

@Component({
  selector: 'ds-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent {
  html : string;
  constructor(private sanitizer: DomSanitizer,
    private aboutusDataService :AboutusDataService,
    private cdref : ChangeDetectorRef) { 
    this.aboutusDataService.getAboutus().pipe().subscribe((data)=>{
      if(!!data && !!data['_embedded'] && !!data['_embedded']['abouts'][0]['texteditor']) {
        this.html = data['_embedded']['abouts'][0]['texteditor'];
        this.cdref.detectChanges();
      }
    });
   }
  
  getSanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.html);
  }
}
