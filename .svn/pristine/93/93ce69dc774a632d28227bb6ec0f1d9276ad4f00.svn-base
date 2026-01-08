import { ChangeDetectorRef, Component } from '@angular/core';
import { FaqDataService } from '../core/data/faq-data.service';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { PaginatedList } from '../core/data/paginated-list.model';
import { Faqs } from '../core/shared/faqs.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ds-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
   faq: any;
  constructor(private faqDataService: FaqDataService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef) {
   this.faqDataService.getFAQs().pipe().subscribe((data) => {
    if(!!data['_embedded']){
      this.faq = data['_embedded'].faqs;
      this.cdRef.detectChanges();
    }
    });
   }

   getSanitizedHtml(value:string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  
}
