import { Component, Inject, ChangeDetectorRef, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { hasValue } from 'src/app/shared/empty.util';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';
import { TruncatableService } from 'src/app/shared/truncatable/truncatable.service';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest as observableCombineLatest, Subject, of, Subscription } from 'rxjs';
import { filter, first, map, mergeMap, startWith, switchMap, take } from 'rxjs/operators';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { BookmarkDataService } from 'src/app/core/data/bookmark-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { Bookmark } from 'src/app/core/shared/bookmark.model';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AppState } from 'src/app/app.reducer';
import { select, Store } from '@ngrx/store';
import { isAuthenticated } from 'src/app/core/auth/selectors';
import { AuthService } from 'src/app/core/auth/auth.service';
import { HostWindowService } from 'src/app/shared/host-window.service';
import { RelationshipDataService } from 'src/app/core/data/relationship-data.service';
import { MetadataValue } from 'src/app/core/shared/metadata.models';
import { MetadataRepresentation } from 'src/app/core/shared/metadata-representation/metadata-representation.model';
import {
  Observable,
  zip as observableZip
} from 'rxjs';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> implements AfterViewInit {
  /**
   * Route to the item's page
   */
  isAuthorized$: Observable<boolean> = of(false);
  bookmarkitem: any;
  cirteanselection = 'APA';
  cirtation = [];
  itemPageRoute: string;
  private modalRef: NgbModalRef;
  isMobileView:boolean = false;
  incrementBy = 30;
  objects: any[];
  parentItem: Item;
  itemType: string;
  authorListByRelationship: any[] = [];
  authorNamesList: any[] = [];
  authors: string[] = [];

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected modalService: NgbModal,
    private store: Store<AppState>,
    private authService: AuthService,
    protected bookmarkdataservice: BookmarkDataService,
    public notificationsService: NotificationsService,
    protected truncatableService: TruncatableService,
    protected cdRef: ChangeDetectorRef, 
    public dsoNameService: DSONameService,
    public itemDataService: ItemDataService,
    private windowService: HostWindowService,
    private relationshipService: RelationshipDataService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(APP_CONFIG) protected appConfig?: AppConfig)
  { super(truncatableService, dsoNameService, appConfig) 
    if (isPlatformBrowser(this.platformId)) {
      this.windowService.isXsOrSm().pipe(
        first()
      ).subscribe((isMobile) => {
        this.isMobileView = isMobile;
      });
    }
  }
  ngOnInit(): void {
    this.cirteanselection = "RefMan";
    super.ngOnInit();
    this.authorListByRelationship = this.allMetadataValues('dc.contributor.author');
    this.getauthor();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
    this.itemPageRoute = getItemPageRoute(this.dso);
  }
  ngAfterViewInit(): void{
    if (isPlatformBrowser(this.platformId)) {
     // this.isAuthorized$ = this.authorizationService.isAuthorized(FeatureID.CanDownload, this.object.indexableObject.self);
      this.isAuthorized$ = this.authService.isAuthenticated()
      this.findBookMark();
      this.getpdf();
    }
   
    //console.log("after view init")
  }

  bitstreamLength: number;
  objbistem:Bitstream;
  getpdf() {
    this.bitstreamDataService.findAllByItemAndBundleName(this.object.indexableObject, 'ORIGINAL', {
      currentPage: 1,
      elementsPerPage: 2
    }, true, true, followLink('format')).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      if (bitstreamsRD.errorMessage) {

      } else if (hasValue(bitstreamsRD.payload)) {
        this.bitstreamLength = bitstreamsRD.payload.page.length;
        if(bitstreamsRD.payload.page.length > 0){
          this.objbistem=bitstreamsRD.payload.page[0];
         // window.open("/bitstreams/" + bitstreamsRD.payload.page[0].id + "/viewer?itemid="+this.object.indexableObject.id)
        }
      }
    });

  }
 openpdf(){
    window.open("/bitstreams/" + this.objbistem.id + "/viewer?itemid="+this.object.indexableObject.id)
       
 }
  Citation(content) {
    this.itemDataService.getCitetion(this.object.indexableObject.id).pipe().subscribe((data) => {
        if(!!data && data.statusCode === 200 && !!data.payload) {
          this.cirtation = Object.entries(data.payload);
        }
    });
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    // this.modalService.open(content);
  }
  copyInputMessage(inputElement: HTMLDivElement) {
    const range = document.createRange();
    range.selectNode(inputElement);
  
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
  
      document.execCommand('copy');
  
      // Clear the selection to prevent visual disruption
      selection.removeAllRanges();
    }
  }
  savebookmark() {

    if (this.bookmarkitem != undefined && this.bookmarkitem.id) {
      if (this.bookmarkitem.status === 'active') {
        this.bookmarkitem.status = 'dactive';
      } else {
        this.bookmarkitem.status = 'active'
      }
      this.bookmarkdataservice.put(this.bookmarkitem).pipe(
        getFirstCompletedRemoteData()
      ).subscribe((rd: RemoteData<Bookmark>) => {
        if (rd.hasSucceeded) {
          debugger;
          this.bookmarkitem = rd.payload;
          //this.CommentFormGroup.reset();
          //this.getCommentList();
          this.cdRef.detectChanges();
          if (this.bookmarkitem.status === 'active') {
            this.notificationsService.success('Bookmark this item  successfully!');
          } else {
            this.notificationsService.success('UnBookmark this item  successfully!');
          }

        } else {
          this.notificationsService.error('An error occurred while Bookmarking this item! ');
        }
      })
    } else {
      let data = {
        "itemRest": {
          "uuid": this.object.indexableObject.uuid
        }
      };
      const bookmarkToCreate = Object.assign(new Bookmark(), data);
      this.bookmarkdataservice.create(bookmarkToCreate).pipe(
        getFirstCompletedRemoteData()
      ).subscribe((rd: RemoteData<Bookmark>) => {

        if (rd.hasSucceeded) {
          debugger;
          this.bookmarkitem = rd.payload;
          //this.CommentFormGroup.reset();
          //this.getCommentList();
          this.cdRef.detectChanges();
          this.notificationsService.success('Bookmark this item  successfully!');
        } else {
          this.notificationsService.error('An error occurred while Bookmarking this item! ');
        }
      })
    }


  }
  findBookMark() {
    // console.log(this.bookmarkitem);
    this.isAuthorized$.pipe(take(1)).subscribe((isautho: Boolean) => {
      if (isautho) {
        this.bookmarkdataservice.findBookmarkByuserofItem(this.object.indexableObject.id).pipe(getFirstCompletedRemoteData()).subscribe((rd) => {
          if (rd.hasSucceeded) {
            this.bookmarkitem = rd.payload;
            // this.cdRef.detectChanges();
          }
        })

      }
    })

  }

  dowloadFile() {
    let URL =this.itemDataService.downloadCitetion(this.object.indexableObject.id,this.cirteanselection);
    const link = document.createElement('a');
    link.href = URL;
    link.download = URL;
    link.click()
  }

  close(event:any) {
    debugger;
    this.modalRef.close();
    // event.preventDefault();
  }
  isModalOpen:boolean = false;
  openModal() {
    this.itemDataService.getCitetion(this.object.indexableObject.id).pipe().subscribe((data) => {
      if(!!data && data.statusCode === 200 && !!data.payload) {
        this.cirtation = Object.entries(data.payload);
        this.isModalOpen = true;
        this.cdRef.detectChanges();
      }
  });
    
  }

  closeModal() {
    this.isModalOpen = false;
  }

  getauthor() {
    this.relationshipService.getRelatedItemsByLabel(this.object['indexableObject'], 'isAuthorOfPublication')
    .subscribe((rd) => {
      this.authorListByRelationship = [];
      this.authorNamesList = [];
      this.authors = [];
      for (let case1 of rd.payload.page) {
        this.authorListByRelationship.push(case1);
      }
      // get all authors list in tempAuthors
      let tempAuthors = this.object['indexableObject'].allMetadataValues('dc.contributor.author');

      // Push all authors in authorNamesList from authorListByRelationship
      this.authorListByRelationship.forEach((author)=>{
        let fullName = `${author.firstMetadataValue('person.familyName')},${author.firstMetadataValue('person.givenName')}`;
        this.authorNamesList.push({fullName:fullName.replace(/<[^>]+>/g, '').replace(/,\s+/g, ",").trim(), id: author.id } as any);
      })

      // Add all other authors which dont have relationship with this item object which will be with search/browse link
      tempAuthors.forEach(author => {
        const cleanedAuthor = author.replace(/<[^>]+>/g, '').replace(/,\s+/g, ",").trim();
        const foundIndex = this.authorNamesList.findIndex((data) => data.fullName === cleanedAuthor);
        if (foundIndex == -1) {
          this.authors.push(author);
        }
      })

      // Till now arrangement ensures the duplicate authors dont get pushed
      // But this will ensure that if user searches an author which are not in relationship with this item then need to add that author highlight to the authorList which is alredy present there
      // this.authors.forEach((author,index) => {
      //   const cleanedAuthor = author.replace(/<[^>]+>/g, '').replace(/,\s+/g, ",").trim();
      //   const foundIndex = this.authorNamesList.findIndex((data) => data.fullName === cleanedAuthor);
      //   if (foundIndex !== -1) {
      //     this.authorNamesList[foundIndex] = { fullName: author, id: this.authorNamesList[foundIndex].id };
      //     this.authors.splice(index, 1);
      //   }
      // });

      this.authorListByRelationship = [...new Set([...this.authorNamesList, ...this.authors])];
      console.log("AuthorListByRelationship",this.authorListByRelationship);
      this.cdRef.detectChanges();
    }
  )}

   resolveMetadataRepresentations(metadata: MetadataValue[], page: number): Observable<MetadataRepresentation[]> {
      return observableZip(
        ...metadata
          .slice((this.objects.length * this.incrementBy), (this.objects.length * this.incrementBy) + this.incrementBy)
          .map((metadatum: any) => Object.assign(new MetadataValue(), metadatum))
          .map((metadatum: MetadataValue) => {
            if (metadatum.isVirtual) {
              return this.relationshipService.resolveMetadataRepresentation(metadatum, this.parentItem, this.itemType);
            } else {
              // Check for a configured browse link and return a standard metadata representation
              // let searchKeyArray: string[] = [];
              // this.metadataFields.forEach((field: string) => {
              //   searchKeyArray = searchKeyArray.concat(BrowseService.toSearchKeyArray(field));
              // });
              // return this.browseDefinitionDataService.findByFields(this.metadataFields).pipe(
              //   getRemoteDataPayload(),
              //   map((def) => Object.assign(new MetadatumRepresentation(this.itemType, def), metadatum))
              // );
            }
          }),
      );
    }

}

