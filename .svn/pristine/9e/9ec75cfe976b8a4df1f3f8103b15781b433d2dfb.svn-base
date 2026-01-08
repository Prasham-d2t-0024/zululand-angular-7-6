import { ViewChildren,Component, OnInit, Inject, PLATFORM_ID, AfterViewInit, AfterViewChecked, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router, Navigation } from '@angular/router';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { hasValue, isNotEmpty } from '../empty.util';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { AuthService } from '../../core/auth/auth.service';
import { filter, map, switchMap, take, tap, catchError, } from 'rxjs/operators';
@Component({
  selector: 'ds-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.scss']
})
export class PdfviewComponent implements OnInit, AfterViewInit, AfterViewChecked {
  path: string = "";
  @ViewChild('pdfViewer', { static: false }) public pdfViewer;
  constructor(private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private router: Router,
    private authorizationService: AuthorizationDataService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
  ) { 
    this._document.getElementById('headerhide').remove();
    this._document.getElementById('bredhide').remove();
    this._document.getElementById('innerremove').style.removeProperty('padding-left');
    this._document.getElementById('menubarhide').remove();
    
    
    this._document.getElementById('fotterremove').remove();
    
    Array.from(document.querySelectorAll('.main-content')).forEach((el) => el.classList.remove('main-content'));
   
  }

  ngOnInit(): void {
    
  

  }
  ngAfterViewInit() { 
    if (isPlatformBrowser(this.platformId)) {
      this._document.getElementById('innerremove').style.setProperty('padding-left', '0px');
      this._document.getElementById('outerwrapperhide').style.setProperty('padding-left', '0px !important');
    }
    this.route.queryParamMap.subscribe(queryParams => {
      let URLDATA = queryParams.get("file") + "&item=" + queryParams.get("item");
      this._document.getElementById('titleID').innerHTML = decodeURIComponent(queryParams.get("itemid"));


      //  this.authorizationService.isAuthorized(FeatureID.CanDownload, decodeURI(queryParams.get("file")))
      this.authService.getShortlivedToken().pipe(take(1), map((token) =>
        hasValue(token) ? new URLCombiner(decodeURI(queryParams.get("file")), `?authentication-token=${token}`).toString() : decodeURI(queryParams.get("file")))).subscribe((logs: string) => {
          //console.log(logs)
          window.open("/assets/pdfjs/web/viewer.html?file=" + encodeURIComponent(logs), "_self")
        });


    })
  }
  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId)) {
      this._document.getElementById('innerremove').style.setProperty('padding-left', '0px');
      this._document.getElementById('outerwrapperhide').style.setProperty('padding-left', '0px !important');
    }
  }
}
