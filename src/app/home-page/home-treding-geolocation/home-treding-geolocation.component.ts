import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { first, map, Observable, take } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { FindListOptions } from 'src/app/core/data/find-list-options.model';
import { ChartService } from 'src/app/core/shared/trending-charts/chart.service';
import { URLCombiner } from 'src/app/core/url-combiner/url-combiner';
import { hasValue } from 'src/app/shared/empty.util';
import { HostWindowService } from 'src/app/shared/host-window.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
declare var $: any;
@Component({
  selector: 'ds-home-treding-geolocation',
  templateUrl: './home-treding-geolocation.component.html',
  styleUrls: ['./home-treding-geolocation.component.scss']
})
export class HomeTredingGeolocationComponent implements OnInit {
  @Input() collectionorCommunityId;
  @Input() type;
  init: boolean = false;
  data: any;
  tableData: any;
  i: number = 0;
  totalView: number = 0;
  totalDownload: number = 0;
  totalSearches: number = 0;
  public isCollapsed = true;
  subtableData: any;
  config: FindListOptions = Object.assign(new FindListOptions(), {
    elementsPerPage: 10
  });
  countriesData: any = {
    plots: {
      "Ahmedabad": {
        "city": "Ahmedabad",
        "latitude": 23.033295,
        "tooltip": {
          "content": "\u003cstrong class\u003d\"country_name\"\u003eAhmedabad\u003c/strong\u003e\u003cbr /\u003e\u003cspan class\u003d\"support3lbl\"\u003eViews: 3\u003c/span\u003e\u003c/br\u003e \u003cspan class\u003d\"support3lbl\"\u003eDownloads: 0\u003c/span\u003e \u003c/br\u003e\u003cspan class\u003d\"support3lbl\"\u003e Searches: 20 \u003c/span\u003e"
        },
        "width": 12,
        "type": "image",
        "value": 23,
        "url": "http://localhost:4000/assets/images/marker.png",
        "height": 40,
        "longitude": 72.6167
      },
    },
  };
  plotsData: any;
  areaData: any;
  countryData: any;
  selectedCountry: string = 'All Countries';
  isLoading: boolean = false;
  isLoading1: boolean = false;
  isMobileView: boolean = false;
  isAdmin$: Observable<boolean>;

  constructor(
    public chartService: ChartService,
    private windowService: HostWindowService,
    private cdref: ChangeDetectorRef,
    private authService: AuthService,
    protected authorizationService: AuthorizationDataService,
) {
      this.windowService.isXsOrSm().pipe(
        first()
      ).subscribe((isMobile) => {
        this.isMobileView = isMobile;
      });
     }

  ngOnInit(): void {
    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
    setTimeout(() => {
      $('#map').mapael({
        map: {
          name: 'world_countries',
          zoom: {
            enabled: true,
            maxLevel: 10
          },
          defaultArea: {
            attrs: {
              fill: "#ced8d0",
              stroke: "#ced8d0"
            }
          }
        },

        // Corrected placement of the legend
        legend: {
          area: {
            mode: "horizontal",
            slices: [
              {
                label: "< 100 Views",
                max: 100,
                attrs: {
                  fill: "#F9BFA9"
                }
              },
              {
                label: "100 - 500 Views",
                min: 101,
                max: 500,
                attrs: {
                  fill: "#F69F7E"
                }
              },
              {
                label: "500 - 1000 Views",
                min: 501,
                max:1000,
                attrs: {
                  fill: "#F37F51"
                }
              },
              {
                label: "> 1000 Views",
                min: 1001,
                attrs: {
                  fill: "#003D6E"
                }
              }
            ]
          }
        },
        areas: this.areaData,
        plots: this.plotsData
      });
    }, 1000);
    this.loadData();
  }

  loadData() {
    this.isLoading1 = true;
    const API1 = this.collectionorCommunityId ? '/getTopViewDownloadserch?dateType='+ this.i +'&top=10&collectionorcommunityid=' + this.collectionorCommunityId+ '&type='+this.type : '/getTopViewDownloadserch?dateType='+ this.i +'&top=10';
    this.chartService.findAllByGeolocation(API1).pipe().subscribe((data) => {
      this.isLoading1 = false;
      this.subtableData = !!data ? data : [];
      const totalRow = this.subtableData.find((row) => row.contry === 'Total');
      if (totalRow) {
        // Do something with the total row, e.g., log it or store it in a variable
        this.totalView = totalRow.view;
        this.totalDownload = totalRow.download;
        this.totalSearches = totalRow.search;
      } else {
        this.totalView = 0;
        this.totalDownload = 0;
        this.totalSearches = 0;
      }
      this.cdref.detectChanges();
    });
    this.isLoading = true;
    const API2 = this.collectionorCommunityId ? '/getTopViewDownloadserchMap?dateType='+ this.i +'&top=10&collectionorcommunityid=' + this.collectionorCommunityId+ '&type='+this.type : '/getTopViewDownloadserchMap?dateType='+ this.i +'&top=10';
    this.chartService.findAllByGeolocation(API2).pipe().subscribe((data) => {
      this.isLoading = false;
      this.plotsData = data;
      this.updateMap();
      this.cdref.detectChanges();
    });
    const API3 = this.collectionorCommunityId ? '/getTopViewDownloadserchMapArea?dateType='+ this.i +'&top=10&collectionorcommunityid=' + this.collectionorCommunityId+ '&type='+this.type : '/getTopViewDownloadserchMapArea?dateType='+ this.i +'&top=10';
    this.chartService.findAllByGeolocation(API3).pipe().subscribe((data) => {
      this.areaData = data;
      this.updateMap();
      this.cdref.detectChanges();
    });
    const API4 = this.collectionorCommunityId ? '/getCountries?top=10&dateType='+ this.i +'&collectionorcommunityid=' + this.collectionorCommunityId+ '&type='+this.type : '/getCountries?top=10&dateType='+ this.i;
    this.chartService.findAllByGeolocation(API4).pipe().subscribe((data) => {
      this.countryData = data;
      this.cdref.detectChanges();
    });
  }

  showData() {
    return this.tableData;
  }

  buttonClick(i) {
    this.i = i;
    this.selectedCountry = 'All Countries';
    this.loadData();
  }

  onSelect(event: string) {
    this.selectedCountry = event;
    if (this.selectedCountry === 'All Countries') {
      this.buttonClick(this.i);
    } else {
      const API1 = this.collectionorCommunityId ? '/getTopViewDownloadserchByCountry?dateType=' + this.i + '&top=10&country=' + this.selectedCountry + '&collectionorcommunityid=' + this.collectionorCommunityId+ '&type='+this.type : '/getTopViewDownloadserchByCountry?dateType=' + this.i + '&top=10&country=' + this.selectedCountry;
      this.chartService.findAllByGeolocation(API1).pipe().subscribe((data) => {
        if (data) {
          this.subtableData = data;
          // Find the row with the name "Total"
          const totalRow = this.subtableData.find((row) => row.contry === 'Total');

          if (totalRow) {
            // Do something with the total row, e.g., log it or store it in a variable
            this.totalView = totalRow.view;
            this.totalDownload = totalRow.download;
            this.totalSearches = totalRow.search;
          } else {
            this.totalView = 0;
            this.totalDownload = 0;
            this.totalSearches = 0;
          }
          this.cdref.detectChanges();
        }
      });
      this.isLoading = true;
      const API3 = this.collectionorCommunityId ? '/getTopViewDownloadserchMap?dateType=' + this.i + '&top=10&country=' + this.selectedCountry + '&collectionorcommunityid=' + this.collectionorCommunityId+ '&type='+this.type : '/getTopViewDownloadserchMap?dateType=' + this.i + '&top=10&country=' + this.selectedCountry;;
      this.chartService.findAllByGeolocation(API3).pipe().subscribe((data) => {
        this.isLoading = false;
        this.plotsData = data;
        this.updateMap();
        this.cdref.detectChanges();
      });
      const API4 = this.collectionorCommunityId ? '/getTopViewDownloadserchMapArea?dateType=' + this.i + '&top=10&country=' + this.selectedCountry + '&collectionorcommunityid=' + this.collectionorCommunityId+ '&type='+this.type : '/getTopViewDownloadserchMapArea?dateType=' + this.i + '&top=10&country=' + this.selectedCountry;;
      this.chartService.findAllByGeolocation(API4).pipe().subscribe((data) => {
        this.areaData = data;
        this.updateMap();
        this.cdref.detectChanges();
      });
    }
  }
  updateMap() {
    setTimeout(() => {
      $('#map').mapael({
        map: {
          name: 'world_countries',
          zoom: {
            enabled: true,
            maxLevel: 10
          },
          defaultArea: {
            attrs: {
              fill: "#ced8d0",
              stroke: "#ced8d0"
            }
          }
        },
        legend: {
          area: {
            mode: "horizontal",
            slices: [
              {
                label: "< 100 Views",
                max: 100,
                attrs: {
                  fill: "#F9BFA9"
                }
              },
              {
                label: "100 - 500 Views",
                min: 101,
                max: 500,
                attrs: {
                  fill: "#F69F7E"
                }
              },
              {
                label: "500 - 1000 Views",
                min: 501,
                max:1000,
                attrs: {
                  fill: "#F37F51"
                }
              },
              {
                label: "> 1000 Views",
                min: 1001,
                attrs: {
                  fill: "#003D6E"
                }
              }
            ]
          }
        },
        areas: this.areaData,
        plots: this.plotsData
      });
    }, 500); // Slight delay to ensure data is ready
  }
  
  downloadExcel() {
    const URL = this.collectionorCommunityId ? '/report/downloadTrandingMatricxGeolocation?dateType=' + this.i+`&collectionorcommunityid=${this.collectionorCommunityId}`+ '&type='+this.type : '/report/downloadTrandingMatricxGeolocation?dateType=' + this.i
    this.chartService.downloadZIP().pipe().subscribe((data: any) => {
      this.authService.getShortlivedToken().pipe(take(1), map((token) =>
        hasValue(token) ? new URLCombiner(data + URL, `&authentication-token=${token}`).toString() : data + URL)).subscribe((logs: string) => {
          window.open(logs);
        });
    },
      (error) => {
        console.error('Error downloading the ZIP file', error);
      })
  }

}
