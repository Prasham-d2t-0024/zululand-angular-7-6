import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FaqDataService } from '../core/data/faq-data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ContactDataService } from '../core/data/contact-data.service';
import { CommunityDataService } from '../core/data/community-data.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { BehaviorSubject, Subscription, switchMap } from 'rxjs';
import { PaginatedList } from '../core/data/paginated-list.model';
import { Community } from '../core/shared/community.model';
import { FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { PageInfo } from '../core/shared/page-info.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { combineLatest as observableCombineLatest } from 'rxjs';
@Component({
  selector: 'ds-askus',
  templateUrl: './askus.component.html',
  styleUrls: ['./askus.component.scss']
})
export class AskusComponent implements OnInit {
  askus: any;
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
  currentPageSubscription: Subscription;
  constructor(private faqDataService: FaqDataService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public notificationsService: NotificationsService,
    private cdRef: ChangeDetectorRef,
    protected modalService: NgbModal,
    private router: Router,
    private cds: CommunityDataService,
    public dsoNameService: DSONameService,
    private paginationService: PaginationService) {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = 300;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    this.faqDataService.getAskUs().pipe().subscribe((data) => {
      if (!!data['_embedded']) {
        this.askus = data['_embedded'].faqs;
        this.cdRef.detectChanges();
      }
    });
  }
  ngOnInit(): void {
    this.initPage();
  }
  initPage() {
    const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
    const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);

    this.currentPageSubscription = observableCombineLatest([pagination$, sort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.cds.findAll({
          currentPage: currentPagination.currentPage,
          elementsPerPage: currentPagination.pageSize,
          sort: { field: currentSort.field, direction: currentSort.direction }
        });
      })
    ).subscribe((results) => {
      //console.log(results.payload)
      this.communitiesRD$.next(results.payload);
      this.cdRef.detectChanges();
      // this.pageInfoState$.next(results.payload.pageInfo);
    });
  }

  getSanitizedHtml(value:string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
