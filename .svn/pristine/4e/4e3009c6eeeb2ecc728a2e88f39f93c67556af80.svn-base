import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getBitstreamDownloadRoute, getBitstreamRequestACopyRoute, getBitstreamViewerRoute } from '../../app-routing-paths';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { hasValue, isNotEmpty } from '../empty.util';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { of as observableOf, combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { Item } from '../../core/shared/item.model';
import { getFirstSucceededRemoteData, getRemoteDataPayload } from 'src/app/core/shared/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/auth/auth.service';
import { filter, map, switchMap, take, tap, catchError, } from 'rxjs/operators';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';
@Component({
  selector: 'ds-file-download-link',
  templateUrl: './file-download-link.component.html',
  styleUrls: ['./file-download-link.component.scss']
})
/**
 * Component displaying a download link
 * When the user is authenticated, a short-lived token retrieved from the REST API is added to the download link,
 * ensuring the user is authorized to download the file.
 */
export class FileDownloadLinkComponent implements OnInit {

  /**
   * Optional bitstream instead of href and file name
   */
  @Input() bitstream: Bitstream;

  @Input() item: Item;
  PDFStaticPath: string = "/assets/pdfjs/web/viewer.html?file=";
  /**
   * Additional css classes to apply to link
   */
  @Input() cssClasses = '';

  /**
   * A boolean representing if link is shown in same tab or in a new one.
   */
  @Input() isBlank = false;

  @Input() enableRequestACopy = true;

  bitstreamPath$: Observable<{
    routerLink: string,
    queryParams: any,
  }>;

  canDownload$: Observable<boolean>;

  constructor(
    private authorizationService: AuthorizationDataService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit() {
    //console.log("inside viewers")
    if (this.enableRequestACopy) {
      this.canDownload$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
      const canRequestACopy$ = this.authorizationService.isAuthorized(FeatureID.CanRequestACopy, isNotEmpty(this.bitstream) ? this.bitstream.self : undefined);
      this.bitstream.format.pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
      ).subscribe(format => {
        this.bitstreamPath$ = observableCombineLatest([this.canDownload$, canRequestACopy$]).pipe(
          map(([canDownload, canRequestACopy]) => 
            (format.mimetype === 'application/pdf' || format.mimetype === 'video/mp4') 
              ? this.getBitstreamViewrPath(canDownload, canRequestACopy) 
              : this.getBitstreamPath(canDownload, canRequestACopy,format.mimetype)
          )
        );
        // this.bitstreamPath$ = format.mimetype === 'application/pdf' ?
        //   observableOf(this.getBitstreamViewrPath()) : observableCombineLatest([this.canDownload$, canRequestACopy$]).pipe(
        //     map(([canDownload, canRequestACopy]) => this.getBitstreamPath(canDownload, canRequestACopy))
        //   );
      }) 
      
     
    } else {
      this.bitstreamPath$ = observableOf(this.getBitstreamDownloadPath());
      this.canDownload$ = observableOf(true);
    }
  }

  getBitstreamPath(canDownload: boolean, canRequestACopy: boolean,mimetype:any) {
    if (!canDownload && canRequestACopy && hasValue(this.item)) {
      return getBitstreamRequestACopyRoute(this.item, this.bitstream);
    } else if (mimetype === 'application/pdf') {
      return this.getBitstreamViewrPath(canDownload, canRequestACopy);
    } else {
      return this.getBitstreamDownloadPath();
    }
       
  }

  getBitstreamDownloadPath() {
    return {
      routerLink: getBitstreamDownloadRoute(this.bitstream),
      queryParams: {}
    };
  }

  getBitstreamViewrPath(canDownload: any, canRequestACopy: any) {
    if (!canDownload && canRequestACopy && hasValue(this.item)) {
      return getBitstreamRequestACopyRoute(this.item, this.bitstream);
    }
      return {
        routerLink: getBitstreamViewerRoute(this.bitstream),
        queryParams: { "itemid": this.item.id }
      };
  }
}
