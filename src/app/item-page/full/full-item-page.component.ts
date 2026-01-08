import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { ItemPageComponent } from '../simple/item-page.component';
import { MetadataMap } from '../../core/shared/metadata.models';
import { ItemDataService } from '../../core/data/item-data.service';

import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';

import { fadeInOut } from '../../shared/animations/fade';
import { hasValue } from '../../shared/empty.util';
import { AuthService } from '../../core/auth/auth.service';
import { Location } from '@angular/common';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { getAllSucceededRemoteData, getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { ChartService } from 'src/app/core/shared/trending-charts/chart.service';
import { HostWindowService } from 'src/app/shared/host-window.service';

/**
 * This component renders a full item page.
 * The route parameter 'id' is used to request the item it represents.
 */

@Component({
  selector: 'ds-full-item-page',
  styleUrls: ['./full-item-page.component.scss'],
  templateUrl: './full-item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class FullItemPageComponent extends ItemPageComponent implements OnInit, OnDestroy {

  itemRD$: BehaviorSubject<RemoteData<Item>>;

  metadata$: Observable<MetadataMap>;

  /**
   * True when the itemRD has been originated from its workspaceite/workflowitem, false otherwise.
   */
  fromSubmissionObject = false;

  subs = [];
  collection:string;
  collectionId:string;
  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected items: ItemDataService,
    protected authService: AuthService,
    protected authorizationService: AuthorizationDataService,
    protected _location: Location,
    protected responseService: ServerResponseService,
    protected signpostingDataService: SignpostingDataService,
    protected linkHeadService: LinkHeadService,
    public collectionService: ChartService,
    public windowService: HostWindowService,
    @Inject(PLATFORM_ID) protected platformId: string,
  ) {
    super(route, router, items, authService, authorizationService, responseService, signpostingDataService, linkHeadService, windowService, platformId);
  }

  /*** AoT inheritance fix, will hopefully be resolved in the near future **/
  ngOnInit(): void {
    super.ngOnInit();
    this.metadata$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      map((item: Item) => item.metadata),);
  
    this.subs.push(this.route.data.subscribe((data: Data) => {
        this.fromSubmissionObject = hasValue(data.wfi) || hasValue(data.wsi);
        if(!!this.fromSubmissionObject) {
          const currentUrl = this.router.url;
          const urlParts = currentUrl.split('/');
          const id = urlParts[2];
          this.collectionService.findCollectionName(id).pipe().subscribe((data)=>{
            this.collection = data['_embedded'].collection.name;
            this.collectionId = data['_embedded'].collection.uuid
          });

        }
      })
    );
    

  }

  /**
   * Navigate back in browser history.
   */
  back() {
    this._location.back();
  }

  ngOnDestroy() {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
