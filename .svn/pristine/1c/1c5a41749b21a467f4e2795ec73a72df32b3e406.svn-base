import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { combineLatest, Observable } from 'rxjs';
import { hasValue } from '../../shared/empty.util';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getFirstSucceededRemoteData } from '../../core/shared/operators';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { BehaviorSubject, combineLatest as observableCombineLatest } from 'rxjs';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { SortDirection, SortOptions } from 'src/app/core/cache/models/sort-options.model';
import { isPlatformBrowser } from '@angular/common';
import { fadeIn } from 'src/app/shared/animations/fade';
import { AuthService } from 'src/app/core/auth/auth.service';
import { HostWindowService } from 'src/app/shared/host-window.service';

@Component({
  selector: 'ds-sub-com-coll-page',
  templateUrl: './sub-com-coll-page.component.html',
  styleUrls: ['./sub-com-coll-page.component.scss'],
  animations:[fadeIn]
})
export class SubComCollPageComponent implements OnInit, AfterViewInit {

  parent$: Observable<RemoteData<DSpaceObject>>;
  logoRD$: Observable<RemoteData<Bitstream>>;
  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The pagination id
   */
  pageId = 'cmscm';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * A list of remote data objects of communities' collections
   */
  subCommunitiesRDObs: BehaviorSubject<RemoteData<PaginatedList<Community>>> = new BehaviorSubject<RemoteData<PaginatedList<Community>>>({} as any);

  totalCommunityElements: number = 1;
  adjustLayout$: Observable<any>;
  isLoggedIn$: Observable<any>;
  isXsOrSm$: Observable<any>;

  @ViewChild('communityTab') communityTab: ElementRef;
  @ViewChild('collectionTab') collectionTab: ElementRef;

  constructor(private route: ActivatedRoute,
    private _router: Router,
    protected dsoService: DSpaceObjectDataService,
    public dsoNameService: DSONameService,
    public cds: CommunityDataService,
    public paginationService: PaginationService,
    public windowService: HostWindowService,
    public auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: any,) { }

  ngOnInit(): void {
    this._router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        view: 'grid'
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: true
      // do not trigger navigation
    });
    this.route.paramMap.subscribe(params => {
      const paramValue = params.get('id');
      this.updateParent(paramValue);
      this.updateLogo();
    });
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.isLoggedIn$ = this.auth.isAuthenticated();
    this.adjustLayout$ = combineLatest([this.isLoggedIn$, this.isXsOrSm$]).pipe(
      map(([loggedIn, isXsOrSm]) => ( loggedIn && !isXsOrSm))
    );
    this.initPage();
  }

  /**
   * Update the parent Community or Collection using their scope
   * @param scope   The UUID of the Community or Collection to fetch
   */
  updateParent(scope: string) {
    if (hasValue(scope)) {
      const linksToFollow = () => {
        return [followLink('logo')];
      };
      this.parent$ = this.dsoService.findById(scope,
        true,
        true,
        ...linksToFollow() as FollowLinkConfig<DSpaceObject>[]).pipe(
          getFirstSucceededRemoteData()
        );
    }
  }

  /**
   * Update the parent Community or Collection logo
   */
  updateLogo() {
    if (hasValue(this.parent$)) {
      this.logoRD$ = this.parent$.pipe(
        map((rd: RemoteData<Collection | Community>) => rd.payload),
        filter((collectionOrCommunity: Collection | Community) => hasValue(collectionOrCommunity.logo)),
        mergeMap((collectionOrCommunity: Collection | Community) => collectionOrCommunity.logo)
      );
    }
  }

  initPage() {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = this.route.snapshot.queryParams[this.pageId + '.rpp'] ?? this.config.pageSize;
    this.config.currentPage = this.route.snapshot.queryParams[this.pageId + '.page'] ?? 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection[this.route.snapshot.queryParams[this.pageId + '.sd']] ?? SortDirection.ASC);
    const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
    const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);
    let parentContextId;
    this.parent$.subscribe(parentRD => {
      if (parentRD?.payload) {
        parentContextId = parentRD?.payload?.id;
        observableCombineLatest([pagination$, sort$]).pipe(
          switchMap(([currentPagination, currentSort]) => {
            return this.cds.findByParent(parentContextId, {
              currentPage: currentPagination.currentPage,
              elementsPerPage: currentPagination.pageSize,
              sort: { field: currentSort.field, direction: currentSort.direction }
            });
          })
        ).subscribe((results) => {
          this.subCommunitiesRDObs.next(results);
          this.totalCommunityElements = results.payload?.totalElements;
        })
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
          if (this.totalCommunityElements > 0 && this.communityTab) {
            this.communityTab.nativeElement.click();
          } else if (this.collectionTab) {
            this.collectionTab.nativeElement.click();
          }
        }, 300);
    }
  }

   ngOnDestroy(): void {
    this.paginationService.clearPagination(this.config.id);
  }
}
