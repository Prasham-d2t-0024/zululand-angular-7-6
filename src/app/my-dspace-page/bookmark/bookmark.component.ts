import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Item } from 'src/app/core/shared/item.model';
import { getAllCompletedRemoteData } from 'src/app/core/shared/operators';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { ViewMode } from 'src/app/core/shared/view-mode.model';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';

@Component({
  selector: 'ds-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {
  bookMarks: BehaviorSubject<PaginatedList<Item>> = new BehaviorSubject<PaginatedList<Item>>({} as any)// Observable<RemoteData<PaginatedList<Bookmark>>>;
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'elp',
    pageSize: 5,
    currentPage: 1
  });
  itemarray: any = [];
  pageInfoState$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(undefined);
  workFlow: Observable<RemoteData<PaginatedList<Item>>>;
  /**
* The view-mode we're currently on
* @type {ViewMode}
*/
  viewMode = ViewMode.ListElement;

  constructor(private itemDataService: ItemDataService) { }

  ngOnInit(): void {
    this.itemDataService.getMyBookmark('getMyBookMarkItems', this.config, true, false)
      .pipe(getAllCompletedRemoteData()).subscribe((rd: RemoteData<PaginatedList<Item>>) => {
        this.bookMarks.next(rd.payload);
        this.pageInfoState$.next(rd.payload.pageInfo);
      });
  }
}
