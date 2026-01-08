import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Item } from 'src/app/core/shared/item.model';
import { Chart } from 'src/app/core/shared/trending-charts/chart.model';
import { ChartService } from 'src/app/core/shared/trending-charts/chart.service';
import { ViewMode } from 'src/app/core/shared/view-mode.model';
import { URLCombiner } from 'src/app/core/url-combiner/url-combiner';
import { hasValue } from 'src/app/shared/empty.util';
import { followLink, FollowLinkConfig } from 'src/app/shared/utils/follow-link-config.model';

@Component({
  selector: 'ds-home-trending-item',
  templateUrl: './home-trending-item.component.html',
  styleUrls: ['./home-trending-item.component.scss']
})
export class HomeTrendingItemComponent implements OnInit,AfterViewInit  {
  @Input() collectionorCommunityId;
  @Input() type;
  cardChartdata = [];
  lineChartdata = [];
  barChartOptions : Observable<RemoteData<PaginatedList<Chart>>>;
  i:number=0;
  num:number =0;
  chartOptions:any = [
    {
      "name": "Mauritius",
      "series": [
        {
          "value": 3,
          "name": "2016-09-18"
        },
        {
          "value": 6,
          "name": "2016-09-20"
        },
        {
          "value": 8,
          "name": "2016-09-16"
        },
        {
          "value": 3,
          "name": "2016-09-19"
        },
        {
          "value": 7,
          "name": "2016-09-24"
        }
      ]
    }
  ];
  timeline: boolean = true;
  view: any[] = [200, 150];
  colorScheme = { 
    domain: ['#003D6E']
  };
  colorScheme1 = { 
    domain: ['#0061AF']
  };
  viewMode = ViewMode.ListElement;
  cardData: any = [];
  isLoading:boolean = false;
  isAdmin$: Observable<boolean>;

  constructor(
    public chartService: ChartService,
    public cdRef:ChangeDetectorRef,
    private itemdataservice:ItemDataService,
    private authService: AuthService,
    protected authorizationService: AuthorizationDataService,
  ) {}
  @ViewChild('viewschart1') viewsChartElement: ElementRef; // Reference to the div
  object: any;
  ngAfterViewInit() {
    if (this.viewsChartElement) {
      console.log('Div is loaded:', this.viewsChartElement.nativeElement);
      this.getViewData(this.object); // Call the method when the div is loaded
    }
  }
  ngOnInit(): void {
    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const apiCall = this.collectionorCommunityId ? '/search/getTopViewItemCount?dateType=' + this.i + '&top=10&collectionorcommunityid=' +
      this.collectionorCommunityId + '&type=' + this.type : '/search/getTopViewItemCount?dateType=' + this.i + '&top=10';
    this.chartService.findAllByGeolocation(apiCall).pipe().subscribe((data) => {
      this.isLoading = false;
      this.cdRef.detectChanges();
      if (data && data['_embedded']) {
        this.cardData = data['_embedded'].items;
        for (const i of this.cardData) {
          console.log(i.itemCardData.downlodeDatapoint)
          if (i.itemCardData.downlodeDatapoint) {
            const data = i.itemCardData.downlodeDatapoint;
            if (data && data['series'] && Array.isArray(data['series'])) {
              // Group by date and sum values if needed, or keep each date entry as-is.
              const uniqueSeries = [];

              data['series'].forEach((entry) => {
                // Find if the date already exists in the uniqueSeries array
                const existingEntry = uniqueSeries.find(e => e.name === entry.name);

                if (existingEntry) {
                  // If it exists, add the value (convert to number for addition)
                  existingEntry.value += Number(entry.value);
                } else {
                  // If it doesn't exist, add a new entry with date and value
                  uniqueSeries.push({
                    name: entry.name,
                    value: Number(entry.value)
                  });
                }
              });

              // Assign the transformed data to chartOptions in the required format
              const chartOptions = uniqueSeries;
              // {
              //   name: data['name'],
              // uniqueSeries
              //   }
              // ];
              i.downloadData = chartOptions
            }
          }

          if (i.itemCardData.viewDataPoint) {
            const data = i.itemCardData.viewDataPoint;
            if (data && data['series'] && Array.isArray(data['series'])) {
              // Group by date and sum values if needed, or keep each date entry as-is.
              const uniqueSeries = [];

              data['series'].forEach((entry) => {
                // Find if the date already exists in the uniqueSeries array
                const existingEntry = uniqueSeries.find(e => e.name === entry.name);

                if (existingEntry) {
                  // If it exists, add the value (convert to number for addition)
                  existingEntry.value += Number(entry.value);
                } else {
                  // If it doesn't exist, add a new entry with date and value
                  uniqueSeries.push({
                    name: entry.name,
                    value: Number(entry.value)
                  });
                }
              });

              // Assign the transformed data to chartOptions in the required format
              const chartOptions = uniqueSeries;
              // {
              //   name: data['name'],
              // uniqueSeries;
              //   }
              // ];
              i.viewData = chartOptions
              this.cdRef.detectChanges();
            }
          }

        }
      }
    });
  }

  buttonClick(j) {
    this.i = j;
    this.loadData();
  }

  linksToFollow: FollowLinkConfig<Item>[] = [followLink('thumbnail')];

  castingObject(item:any)  {
  return this.itemdataservice.findById(item.id,true,true,...this.linksToFollow);
  }

  getViewData(object) {
    if(!!object.itemCardData.viewDataPoint){
      const data = object.itemCardData.viewDataPoint
      if (data && data['series'] && Array.isArray(data['series'])) {
        // Group by date and sum values if needed, or keep each date entry as-is.
        const uniqueSeries = [];
    
        data['series'].forEach((entry) => {
          // Find if the date already exists in the uniqueSeries array
          const existingEntry = uniqueSeries.find(e => e.name === entry.name);
    
          if (existingEntry) {
            // If it exists, add the value (convert to number for addition)
            existingEntry.value += Number(entry.value);
          } else {
            // If it doesn't exist, add a new entry with date and value
            uniqueSeries.push({
              name: entry.name,
              value: Number(entry.value)
            });
          }
        });
    
        // Assign the transformed data to chartOptions in the required format
        const chartData = [
          {
            name: data['name'],
            series: uniqueSeries
          }
        ];
        this.chartOptions=  chartData;
      }
      
    } 
  }

  getDownloadData(object) {
    if (this.num !== 2) {
      this.num = 2;
      if (!!object.itemCardData.downlodeDatapoint) {
        const data = object.itemCardData.downlodeDatapoint;
        if (data && data['series'] && Array.isArray(data['series'])) {
          // Group by date and sum values if needed, or keep each date entry as-is.
          const uniqueSeries = [];

          data['series'].forEach((entry) => {
            // Find if the date already exists in the uniqueSeries array
            const existingEntry = uniqueSeries.find(e => e.name === entry.name);

            if (existingEntry) {
              // If it exists, add the value (convert to number for addition)
              existingEntry.value += Number(entry.value);
            } else {
              // If it doesn't exist, add a new entry with date and value
              uniqueSeries.push({
                name: entry.name,
                value: Number(entry.value)
              });
            }
          });

          // Assign the transformed data to chartOptions in the required format
          const chartOptions = [
            {
              name: data['name'],
              series: uniqueSeries
            }
          ];
          return chartOptions;
        }
      }

    }
  }

   downloadExcel() {
    this.chartService.downloadZIP().subscribe((data: any) => {
      this.authService.getShortlivedToken().pipe(take(1), map((token) =>
            hasValue(token) ? new URLCombiner(data +'/report/downloadTrandingReport?dateType=' + this.i , `&authentication-token=${token}`).toString() : data+'/report/downloadTrandingReport?dateType=' + this.i)).subscribe((logs: string) => {
              window.open(logs);
            });
    },
    (error) => {
      console.error('Error downloading the ZIP file', error);
    })
  }

}
