import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemComponent } from '../shared/item.component';
import { FindListOptions } from 'src/app/core/data/find-list-options.model';
import { of, switchMap } from 'rxjs';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent implements AfterViewInit {
  @Input() isBlank: Boolean = true;
  lineChartdata:any;
  type:string;
  isLoading: false;
  colorScheme = {
    domain:['#003D6E','#0061AF']
  };
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
  timeline: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legend: boolean = true;
  authorListByRelationship = [];
  options = new FindListOptions();
  authors:any[] = [];

  ngAfterViewInit() {
    this.authors = this.object.allMetadataValues('dc.contributor.author');
    this.cdRef.detectChanges();
    this.getauthor();
  }
  getauthor() {
    this.relationshipService.getRelatedItemsByLabel(this.object, 'isAuthorOfPublication', Object.assign(this.options, {
      elementsPerPage: 500, currentPage: 1
    })).subscribe((rd) => {
      this.authorListByRelationship = [];
      this.authors = [];
      for (let case1 of rd.payload.page) {
        this.authorListByRelationship.push(case1);
      }
      let tempAuthors = this.object.allMetadataValues('dc.contributor.author');
      let authorNamesList: string[] = [];
      this.authorListByRelationship.forEach((author)=>{
        let fullName = `${author.firstMetadataValue('person.familyName')},${author.firstMetadataValue('person.givenName')}`;
        // if(fullName.trim() != author.replace(/,\s+/g, ",").trim() && this.authors.includes(author)){
          authorNamesList.push(fullName.replace(/,\s+/g, ",").trim());
        // }
      })

      tempAuthors.forEach(author => {
        if(!authorNamesList.includes(author.replace(/,\s+/g, ",").trim()) && !this.authors.includes(author)){
          this.authors.push(author);
        }
      });
      console.log("authorNamesList, Authors:", authorNamesList, this.authors);
      this.cdRef.detectChanges();
    }
)};

  getAdvisorValue(metadataValue:any){
    if(metadataValue){
      return metadataValue;
    }
  }

   getAdvisorlink(link: string) {
    let extractedLink = link;  
    if (link.includes("[")) {
      extractedLink = link.split("[")[1].split("]")[0];
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(extractedLink);
  }

}
