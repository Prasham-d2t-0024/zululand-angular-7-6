import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';

import { BehaviorSubject, combineLatest as observableCombineLatest, Subscription } from 'rxjs';

import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { PaginatedList } from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { fadeInOut } from '../shared/animations/fade';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { hasValue } from '../shared/empty.util';
import { switchMap } from 'rxjs/operators';
import { PaginationService } from '../core/pagination/pagination.service';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { followLink, FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';
import { PageInfo } from '../core/shared/page-info.model';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { getAllCompletedRemoteData, getFirstCompletedRemoteData } from '../core/shared/operators';

@Component({
  selector: 'ds-ecds-partners',
  templateUrl: './ecds-partners.component.html',
  styleUrls: ['./ecds-partners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class EcdsPartnersComponent implements OnInit, OnDestroy {
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

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private cds: CommunityDataService,
    public dsoNameService: DSONameService,
    private cdRef: ChangeDetectorRef,
    private paginationService: PaginationService
  ) {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = 300;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    this.linksToFollow.push(followLink('logo'));
  }

  ngOnInit() {
    this.initPage();
  }


  /**
   * Update the list of top communities
   */
  initPage() {
    const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
    const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);

    this.currentPageSubscription = observableCombineLatest([pagination$, sort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.cds.findAll({
          currentPage: currentPagination.currentPage,
          elementsPerPage: currentPagination.pageSize,
          sort: { field: currentSort.field, direction: currentSort.direction }
        },true,false, ...this.linksToFollow,);
      })
    ).subscribe((results) => {
      console.log(results.payload)
      this.communitiesRD$.next(results.payload);
      this.cdRef.detectChanges();
     // this.pageInfoState$.next(results.payload.pageInfo);
    });
  }

  /**
   * Unsubscribe the top list subscription if it exists
   */
  private unsubscribe() {
    if (hasValue(this.currentPageSubscription)) {
      this.currentPageSubscription.unsubscribe();
    }
  }

  /**
   * Clean up subscriptions when the component is destroyed
   */
  ngOnDestroy() {
    this.unsubscribe();
    this.paginationService.clearPagination(this.config.id);
  }

}
