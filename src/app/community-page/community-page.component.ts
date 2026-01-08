import { mergeMap, filter, map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { CommunityDataService } from '../core/data/community-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Bitstream } from '../core/shared/bitstream.model';

import { Community } from '../core/shared/community.model';

import { MetadataService } from '../core/metadata/metadata.service';

import { fadeInOut } from '../shared/animations/fade';
import { hasValue } from '../shared/empty.util';
import { getAllSucceededRemoteDataPayload, getFirstSucceededRemoteData } from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getCommunityPageRoute } from './community-page-routing-paths';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SortDirection } from '../core/cache/models/sort-options.model';
import { PaginatedList } from '../core/data/paginated-list.model';
import { Chart } from '../core/shared/trending-charts/chart.model';
import { ChartService } from '../core/shared/trending-charts/chart.service';
import { ViewMode } from '../core/shared/view-mode.model';
import { Item } from '../core/shared/item.model';
import { HostWindowService } from '../shared/host-window.service';
@Component({
  selector: 'ds-community-page',
  styleUrls: ['./community-page.component.scss'],
  templateUrl: './community-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
/**
 * This component represents a detail page for a single community
 */
export class CommunityPageComponent implements OnInit {
  /**
   * The community displayed on this page
   */
  communityRD$: Observable<RemoteData<Community>>;

  /**
   * Whether the current user is a Community admin
   */
  isCommunityAdmin$: Observable<boolean>;

  /**
   * The logo of this community
   */
  logoRD$: Observable<RemoteData<Bitstream>>;

  /**
   * Route to the community page
   */
  communityPageRoute$: Observable<string>;
  communityId$:Observable<string>;
  isXsOrSm$:Observable<any>;
  adjustLayout$:Observable<any>;
  isLoggedIn$:Observable<any>;
  
  constructor(
    private communityDataService: CommunityDataService,
    private metadata: MetadataService,
    private paginationService: PaginationService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authorizationDataService: AuthorizationDataService,
    public dsoNameService: DSONameService,
    public searchConfigurationService: SearchConfigurationService,
    public chartService: ChartService,
    public windowService: HostWindowService,
    public auth:AuthService
  ) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.isLoggedIn$ = this.auth.isAuthenticated();
    this.adjustLayout$ = combineLatest([this.isLoggedIn$, this.isXsOrSm$]).pipe(
      map(([loggedIn, isXsOrSm]) => ( loggedIn && !isXsOrSm))
    );
    this.communityRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService)
    );
    this.communityRD$.pipe(getFirstSucceededRemoteData()).subscribe((rd: RemoteData<Community>) => {
      this.paginationService.updateRoute(this.searchConfigurationService.paginationID, {
        sortField: 'dc.date.accessioned',
        sortDirection: 'DESC' as SortDirection,
        page: 1
      }, { scope: rd.payload.id });
    });

    this.chartOptions = [
      {
        "name": "Sri Lanka",
        "series": [
          {
            "value": 4,
            "name": "2016-09-18"
          },
          {
            "value": 6,
            "name": "2016-09-20"
          },
          {
            "value": 3,
            "name": "2016-09-16"
          },
          {
            "value": 5,
            "name": "2016-09-19"
          },
          {
            "value": 2,
            "name": "2016-09-24"
          }
        ]
      }
    ]
  }

  ngOnInit(): void {
    this.logoRD$ = this.communityRD$.pipe(
      map((rd: RemoteData<Community>) => rd.payload),
      filter((community: Community) => hasValue(community)),
      mergeMap((community: Community) => community.logo));
    this.communityPageRoute$ = this.communityRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((community) => getCommunityPageRoute(community.id))
    );
    this.communityId$ = this.communityRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((community: Community) => community.id)
    );
  }

  cardData = [];
  cardChartdata = [];
  lineChartdata = [];
  barChartOptions : Observable<RemoteData<PaginatedList<Chart>>>;
  chartOptions:any = [];
  timeline: boolean = true;
  i:number=0;
  colorScheme = { 
    domain: ['#26A0FC', '#FEB019', '#FF4560']
  };
  view: any[] = [300, 150];
  viewMode = ViewMode.ListElement;
  buttonClick(j) {
    this.i = j;
  }

  castingObject(item:any) :Item{
    return Object.assign(new Item(),item);
  }
}
