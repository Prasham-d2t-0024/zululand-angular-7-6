import { Component, Inject, Input, OnInit } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { Observable } from 'rxjs';
import { Params, Router } from '@angular/router';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { map } from 'rxjs/operators';
import { currentPath } from '../../utils/route.utils';
import { SearchService } from 'src/app/core/shared/search/search.service';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent implements OnInit {
  /**
   * Emits the currently active filters
   */
  appliedFilters: Observable<Params>;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  searchLink: string;

  clearParams;

  /**
   * Initialize the instance variable
   */
  constructor(
    protected router: Router,
    protected service: SearchService,
    @Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService) {
   
  }
  ngOnInit(): void {

    this.appliedFilters = this.searchConfigService.getCurrentFrontendFilters().pipe(
      map((params) => {
        const labels = {};
        Object.keys(params)
          .forEach((key) => {
            labels[key] = [...params[key].map((value) => value)];
          });
          console.log(labels);
        return labels;
      })
    );
    

    this.clearParams = this.searchConfigService.getCurrentFrontendFilters().pipe(map((filters) => {
      Object.keys(filters).forEach((f) => filters[f] = null);
      return filters;
    }));
    this.searchLink = this.getSearchLink();
  }

    /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
    private getSearchLink(): string {
      if (this.inPlaceSearch) {
        return currentPath(this.router);
      }
      return this.service.getSearchLink();
    }
}
