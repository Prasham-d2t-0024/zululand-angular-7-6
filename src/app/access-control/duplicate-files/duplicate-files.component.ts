import { ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Bundle } from 'src/app/core/shared/bundle.model';
import { Item } from 'src/app/core/shared/item.model';
import { getAllCompletedRemoteData, getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { Observable, Subscription, of as observableOf } from 'rxjs';
import { AnyARecord } from 'dns';
import { ViewMode } from 'src/app/core/shared/view-mode.model';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { FindListOptions } from 'src/app/core/data/find-list-options.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';

@Component({
  selector: 'ds-duplicate-files',
  templateUrl: './duplicate-files.component.html',
  styleUrls: ['./duplicate-files.component.scss']
})

export class DuplicateFilesComponent {
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'dfl',
    pageSize: 10
  });
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 10
  });
  itemarray: any = [];
  itemSubarray: any = [];
  pageInfoState$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(undefined);
    /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
    subs: Subscription[] = [];
  isView: boolean = false;
  /**
 * The view-mode we're currently on
 * @type {ViewMode}
 */
  viewMode = ViewMode.ListElement;
  sublist: Observable<RemoteData<PaginatedList<Item>>>;
  bookMarks: BehaviorSubject<PaginatedList<Item>> = new BehaviorSubject<PaginatedList<Item>>({} as any)
  selectedItem: any;
  showDetails:boolean = false;
  selectedIndex:number;
  constructor(private itemDataService: ItemDataService,
    private cdref:ChangeDetectorRef,
    private paginationService: PaginationService,
    protected modalService: NgbModal,
    private notificationsService: NotificationsService,) {
    this.itemDataService.getDuplicateItem('getAuthorAndTitleDublicate')
      .pipe().subscribe((rd: any) => {
        this.itemarray = rd;
        this.cdref.detectChanges();
      });
    
  }
 
  viewItem(item: any,i) {
    if (!!item) {
      this.selectedItem = item;
      this.selectedIndex = i;
      this.showDetails = true;
      this.sublist = this.paginationService.getFindListOptions(this.pageConfig.id, this.config).pipe(
        switchMap((config) =>
          this.itemDataService.getMyBookmark('getItemByAuthorAndTitle?auther=' + item.author + "&title=" + item.title, config, false, false)
        ));
    }
  }

  deleteItem(item:any,content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.itemDataService.delete(item.uuid).pipe().subscribe((data) => {
            if (data.state === "Success" || data.statusCode === 204) {
              this.notificationsService.success("Item deleted successfully", { name: "" });
              this.paginationService.resetPage(this.pageConfig.id);
              this.sublist = this.paginationService.getFindListOptions(this.pageConfig.id, this.config).pipe(
                switchMap((config) =>
                  this.itemDataService.getMyBookmark('getItemByAuthorAndTitle?auther=' + this.selectedItem.author + "&title=" + this.selectedItem.title, config, false, false)
                ))
                ,
                // If needed, you can further process the data using the map operator
                map((data) => {
                  // You can do additional processing here if required
                  return data;
                })
              }
        });
            } else {
              this.notificationsService.error("Something went wrong plz try again.", { name: "" });
            }
          })
        }
      }