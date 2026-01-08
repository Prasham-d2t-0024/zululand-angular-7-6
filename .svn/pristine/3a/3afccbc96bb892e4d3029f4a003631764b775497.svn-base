import { Component, EventEmitter, Input, Output, OnChanges, ChangeDetectorRef, ViewChild, AfterViewInit, OnInit, PLATFORM_ID, Inject, ElementRef } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Router } from '@angular/router';
import { isNotEmpty } from '../empty.util';
import { SearchService } from '../../core/shared/search/search.service';
import { currentPath } from '../utils/route.utils';
import { PaginationService } from '../../core/pagination/pagination.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScopeSelectorModalComponent } from './scope-selector-modal/scope-selector-modal.component';
import { debounceTime, distinctUntilChanged, pluck, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject, Subscription, fromEvent, of } from 'rxjs';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData, getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { RemoteData } from 'src/app/core/data/remote-data';
import { SearchFilterConfig } from '../search/models/search-filter-config.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import {
  toDSpaceObjectListRD
} from '../../core/shared/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { SearchObjects } from '../search/models/search-objects.model';
import { NgForm } from '@angular/forms';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { Community } from 'src/app/core/shared/community.model';
import { FollowLinkConfig } from '../utils/follow-link-config.model';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from 'src/app/core/cache/models/sort-options.model';
import { CommunityDataService } from 'src/app/core/data/community-data.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'ds-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html'
})
/**
 * Component that represents the search form
 */
export class SearchFormComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * The search query
   */
  communitiesRD$: BehaviorSubject<PaginatedList<Community>> = new BehaviorSubject<PaginatedList<Community>>({} as any);
  linksToFollow: FollowLinkConfig<Community>[] = [];

  pageInfoState$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(undefined);

  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;
  /**
  * The pagination id
  */
  pageId = 'tl';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * The subscription to the observable for the current page.
   */
  currentPageSubscription: Subscription;
  @Input() query: string;
  @Input() contenttype: any;
  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;
  @ViewChild('form') searchFrom: NgForm;
  /**
   * The currently selected scope object's UUID
   */
  @Input()
  scope = '';

  selectedScope: BehaviorSubject<DSpaceObject> = new BehaviorSubject<DSpaceObject>(undefined);

  @Input() currentUrl: string;

  /**
   * Whether or not the search button should be displayed large
   */
  @Input() large = false;

  /**
   * The brand color of the search button
   */
  @Input() brandColor = 'primary';

  /**
   * The placeholder of the search input
   */
  @Input() searchPlaceholder: string;

  /**
   * Defines whether or not to show the scope selector
   */
  @Input() showScopeSelector = false;
  selectedTeam: string = "123";
  @ViewChild('keyupquery') keyupquery: ElementRef;
  /**
   * Output the search data on submit
   */
  @Output() submitSearch = new EventEmitter<any>();
  spinner = false;

  searchExpanded = false;
  @Input() showsuggestion = false;
  datasearch: any = [];
  items: any = [];
  collectionList: any = [];
  suggestionList: any = [];
  constructor(
    private cdRef: ChangeDetectorRef,
    protected router: Router,
    private cds: CommunityDataService,
    protected searchService: SearchService,
    protected paginationService: PaginationService,
    protected searchConfig: SearchConfigurationService,
    protected modalService: NgbModal,
    protected dsoService: DSpaceObjectDataService,
    public dsoNameService: DSONameService,
    public searchConfigService: SearchConfigurationService,
    @Inject(PLATFORM_ID) private platformId: any,

  ) {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = 1000;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
  }

  /**
   * Retrieve the scope object from the URL so we can show its name
   */
  ngOnChanges(): void {
    //console.log("scopescopescopescope...", this.scope);
    if (isNotEmpty(this.scope)) {
      this.dsoService.findById(this.scope).pipe(getFirstSucceededRemoteDataPayload())
        .subscribe((scope: DSpaceObject) => this.selectedScope.next(scope));

    }
  }
  ngOnInit() {
    this.initPage();
  }

  initPage() {
    const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
    const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);

    this.currentPageSubscription = observableCombineLatest([pagination$, sort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.cds.findAll({
          currentPage: currentPagination.currentPage,
          elementsPerPage: 1000,
          sort: { field: currentSort.field, direction: currentSort.direction }
        }, true, false, ...this.linksToFollow,);
      })
    ).subscribe((results) => {
      this.communitiesRD$.next(results.payload);
      this.cdRef.detectChanges();
      // this.pageInfoState$.next(results.payload.pageInfo);
    });
  }
  ngAfterViewInit() {
    const formvalue = this.searchFrom.valueChanges;
    if (isPlatformBrowser(this.platformId)) {

      fromEvent(this.keyupquery.nativeElement, 'keyup').pipe(distinctUntilChanged()).subscribe((data: any) => {
        let text = data.currentTarget.value;
        if (text.length > 1) {
          this.spinner = true;
          formvalue.pipe(pluck('query'),
            debounceTime(500),
            distinctUntilChanged(),

            switchMap(text => this.searchService.searchSuggestion(
              new PaginatedSearchOptions({
                query: text,
              }), true)
            )
          ).subscribe((rd: RemoteData<SearchObjects<DSpaceObject>>) => {
            if (rd.isRequestPending) {
              this.spinner = true;
            }
            if (rd.hasCompleted) {
              this.items = [];
              this.collectionList = [];
              this.datasearch = rd.payload.page;
              this.suggestionList = rd.payload;
              console.log(this.suggestionList);
              this.showsuggestion = true;
              for (let dobject of this.datasearch) {

                if (dobject.indexableObject.type === 'item') {
                  this.items.push(dobject);
                  console.log(this.items)
                } else if (dobject.indexableObject.type === 'collection') {

                  this.collectionList.push(dobject);
                }
              }
              this.spinner = false;

              this.cdRef.detectChanges();
            }
          })
        }
      })
      /*  formvalue.pipe(pluck('query')).subscribe((data) => {
          if (data.length > 1) {
            this.spinner = true;
            formvalue.pipe(pluck('query'),
              debounceTime(500),
              distinctUntilChanged(),
  
              switchMap(data => this.searchService.searchSuggestion(
                new PaginatedSearchOptions({
                  query: data,
                }), true)
              )
            ).subscribe((rd: RemoteData<SearchObjects<DSpaceObject>>) => {
              if (rd.isRequestPending) {
                this.spinner = true;
              }
              if (rd.hasCompleted) {
                this.items = [];
                this.collectionList = [];
                this.datasearch = rd.payload.page;
                this.suggestionList = rd.payload;
                this.showsuggestion = true;
                for (let dobject of this.datasearch) {
  
                  if (dobject.indexableObject.type === 'item') {
                    this.items.push(dobject);
                  } else if (dobject.indexableObject.type === 'collection') {
  
                    this.collectionList.push(dobject);
                  }
                }
                this.spinner = false;
  
                this.cdRef.detectChanges();
              }
            })
          }
        })*/
    }


  }
  /**
   * Updates the search when the form is submitted
   * @param data Values submitted using the form
   */
  onSubmit(data: any) {
    // this.scope = this.selectedScopedrop;
    if (isNotEmpty(this.scope)) {
      data = Object.assign(data, { scope: this.scope });
    }
    if (this.selectedTeam != '123') {
      data['f.itemtype'] = this.selectedTeam + ",equals";
    } else {
      delete data['f.itemtype']
    }


    this.updateSearch(data);
    this.submitSearch.emit(data);
  }
  onSelected(value: string): void {
    this.selectedTeam = value;
  }
  onSelectedScope(value: string): void {
    this.scope = value;
  }
  /**
   * Updates the search when the current scope has been changed
   * @param {string} scope The new scope
   */
  onScopeChange(scope: DSpaceObject) {
    if (this.inPlaceSearch) {
      this.updateSearch({ scope: scope ? scope.uuid : undefined });
    } else {
      this.scope = scope.uuid;
    }
  }

  /**
   * Updates the search URL
   * @param data Updated parameters
   */
  updateSearch(data: any) {
    data['scope'] = this.scope ? this.scope : undefined;
    const queryParams = Object.assign({}, data);

    this.router.navigate(this.getSearchLinkParts(), {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });


  }
  setQuery(sugge): void {
    this.query = sugge;
    this.showsuggestion = false;
  }
  public getCleanedString(itemobj) {
    if (itemobj.hitHighlights) {
      return itemobj.hitHighlights['dc.title'][0].value
    } else {
      return itemobj.indexableObject.name
    }

  }

  focuseinput() {
    if (this.query != undefined && this.query.length > 1) {
      this.showsuggestion = true;
    }
  }
  focuseoutinput() {

    this.showsuggestion = false;
    //console.log(this.showsuggestion);
  }
  SearchRepo(event: KeyboardEvent): void {
    const key = event.keyCode || event.charCode;
    // alert(key)
    if (this.query.length > 1) {


      this.searchService.searchSuggestion(
        new PaginatedSearchOptions({
          query: this.query,
        }), true).pipe(debounceTime(500), distinctUntilChanged(), switchMap(rd => this.getdataswith(rd))).subscribe((rd: RemoteData<SearchObjects<DSpaceObject>>) => {

        });

    } else {
      this.showsuggestion = false;
    }

  }
  getdataswith(data) {
    return data;
  }
  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
   */
  public getSearchLinkParts(): string[] {
    if (this.inPlaceSearch) {
      return [];
    }
    return this.getSearchLink().split('/');
  }

  /**
   * Open the scope modal so the user can select DSO as scope
   */
  openScopeModal() {
    const ref = this.modalService.open(ScopeSelectorModalComponent);
    ref.componentInstance.scopeChange.pipe(take(1)).subscribe((scope: DSpaceObject) => {
      this.selectedScope.next(scope);
      this.onScopeChange(scope);
    });
  }
}
