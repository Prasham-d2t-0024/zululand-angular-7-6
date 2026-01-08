import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeNewsComponent } from './home-news/home-news.component';
import { HomePageRoutingModule } from './home-page-routing.module';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HomePageComponent } from './home-page.component';
import { TopLevelCommunityListComponent } from './top-level-community-list/top-level-community-list.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { ThemedHomePageComponent } from './themed-home-page.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
import { JournalEntitiesModule } from '../entity-groups/journal-entities/journal-entities.module';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';
import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';
import { SearchModule } from '../shared/search/search.module';
import { SearchFilterConfig } from '../shared/search/models/search-filter-config.model';
import { FILTER_CONFIG, IN_PLACE_SEARCH, REFRESH_FILTER } from '../core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HomeBarChartComponent } from './home-bar-chart/home-bar-chart.component';
import { HomeLineChartComponent } from './home-line-chart/home-line-chart.component';
import { HomeCardComponent } from './home-card/home-card.component';
import { HomeTredingGeolocationComponent } from './home-treding-geolocation/home-treding-geolocation.component';
import { HomeTredingSearchesComponent } from './home-treding-searches/home-treding-searches.component';
import { HomeTredingTypesComponent } from './home-treding-types/home-treding-types.component';
import { HomeTredingCommunitiesComponent } from './home-treding-communities/home-treding-communities.component';
import { HomeTrendingItemComponent } from './home-trending-item/home-trending-item.component';
import { HomeTrendingCollecctionComponent } from './home-trending-collecction/home-trending-collecction.component';
import { HomeItemAnalyticsComponent } from './home-item-analytics/home-item-analytics.component';
const DECLARATIONS = [
  HomePageComponent,
  ThemedHomePageComponent,
  TopLevelCommunityListComponent,
  ThemedTopLevelCommunityListComponent,
  ThemedHomeNewsComponent,
  HomeNewsComponent,
  RecentItemListComponent,
  HomeBarChartComponent,
  HomeLineChartComponent,
  HomeCardComponent,
  HomeTredingGeolocationComponent,
  HomeTredingSearchesComponent,
  HomeTredingTypesComponent,
  HomeTredingCommunitiesComponent,
  HomeTrendingItemComponent,
  HomeTrendingCollecctionComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule.withEntryComponents(),
    SearchModule,
    NgbModule,
    JournalEntitiesModule.withEntryComponents(),
    ResearchEntitiesModule.withEntryComponents(),
    HomePageRoutingModule,
    StatisticsModule.forRoot(),
    NgxChartsModule
  ],
  declarations: [
    ...DECLARATIONS,
    HomeTrendingItemComponent,
    HomeTrendingCollecctionComponent,
    HomeItemAnalyticsComponent,
  ],
  exports: [
    ...DECLARATIONS,RecentItemListComponent
  ],
  providers: [
    {
      provide: FILTER_CONFIG,
      useValue: SearchFilterConfig
    },
    {
      provide: IN_PLACE_SEARCH,
      useValue: SearchFilterConfig
    },
    {
      provide: REFRESH_FILTER,
      useValue: SearchFilterConfig
    },
    {
      provide:SEARCH_CONFIG_SERVICE,
      useValue:SearchConfigurationService
    }
  ]
})
export class HomePageModule {

}
