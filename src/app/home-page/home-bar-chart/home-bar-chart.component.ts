import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getAllSucceededRemoteData } from 'src/app/core/shared/operators';
import { take } from 'rxjs/operators';
import { ChartService } from 'src/app/core/shared/trending-charts/chart.service';
import { th } from 'date-fns/locale';


@Component({
  selector: 'ds-home-bar-chart',
  templateUrl: './home-bar-chart.component.html',
  styleUrls: ['./home-bar-chart.component.scss']
})
export class HomeBarChartComponent implements OnInit {
  @Input() collectionorCommunityId: string;
  @Input() dateType;
  @Input() type;
  view: any[] = [550, 415];
  chartOptions: any = [];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showLegendLabel: boolean = true;
  legendPosition: string = 'below';
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Country';
  xAxisLabel: string = 'Counts';
  showYAxisLabel: boolean = false;
  data: any = [];
  init: boolean = false;
  isLoading:boolean = false;
  @Input() barChartOptions: string;

  colorScheme = {
    domain: ['#003D6E','#0061AF']
  };
  schemeType: string = 'ordinal';

  constructor(public chartService: ChartService,
    public cdref:ChangeDetectorRef
  ) {
  }
  ngOnInit(): void {
    // this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const colstring = this.collectionorCommunityId  ?  '/getMostViewBarchart?dateType=' + this.dateType +
      '&top=10&collectionorcommunityid=' + this.collectionorCommunityId+ '&type='+this.type :
      '/getMostViewBarchart?dateType=' +
      this.dateType + '&top=10'
    this.chartService.findAllByGeolocation(colstring).pipe().subscribe((data) => {
      this.isLoading = false;
      this.cdref.detectChanges();
      if(data) {
        this.chartOptions = data;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }

}
