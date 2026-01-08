import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtPayload } from 'jwt-decode';
import { filter, find, map, Observable, switchMap } from 'rxjs';
import { hasValue, isNotEmpty } from 'src/app/shared/empty.util';
import { RequestService } from '../../data/request.service';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../hal-endpoint.service';
import { Chart } from './chart.model';
import { RemoteData } from '../../data/remote-data';


@Injectable({
  providedIn: 'root'
})
export class ChartService {
  protected path1 = 'items';
  protected path2 = 'collections';
  protected path3 = 'communities';
  protected path4 = "workflowitems";
  protected path5 = "vocabularies";
  protected path6 = "workspaceitems";
  protected searchByMetadataPath = '/filterbyInwardAndOutWard';
  url: string;
  constructor(protected requestService: RequestService,
    private httpClient: HttpClient,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService,) {

  }
  getRelationshipEndpoint(url1, i?: string) {
    return this.halService.getEndpoint(url1).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}${i}`));
  }

  getRelationshipEndpoint3(url: string) {
    return this.halService.getEndpoint(url).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}`));
  }

  public findAllByGeolocation(i: string): Observable<RemoteData<Chart>> {
    const href$ = this.getRelationshipEndpoint(this.path1, i).pipe(
      find((href: string) => hasValue(href)),
    );
    href$.subscribe((data) => {
      this.url = data;
    });
    return this.getData(this.url);
  }

  public findhierachiesBycommunity(i: string) {
    const href$ = this.getRelationshipEndpoint(this.path2, '/' + i).pipe(
      find((href: string) => hasValue(href)),
    );
    href$.subscribe((data) => {
      this.url = data;
    });
    return this.getData(this.url + '/parentCommunity?embed=parentCommunity');
  }

  public findhierachiesByParentcommunity(i: string) {
    const href$ = this.getRelationshipEndpoint(this.path3, '/' + i).pipe(
      find((href: string) => hasValue(href)),
    );
    href$.subscribe((data) => {
      this.url = data;
    });
    return this.getData(this.url + '/parentCommunity');
  }

  public findCollectionName(i: string) {
    const href$ = this.getRelationshipEndpoint(this.path4, '/' + i).pipe(
      find((href: string) => hasValue(href)),
    );
    href$.subscribe((data) => {
      this.url = data;
    });
    debugger;
    return this.getData(this.url + '?embed=item');
  }

  public searchASFAsubject(i: string,pageNo:number) {
    const href$ = this.getRelationshipEndpoint3(this.path5).pipe(
      find((href: string) => hasValue(href)),
    );
    href$.subscribe((data) => {
      this.url = data;
    });
    return this.getData(this.url + '/asfa/entries?filter=' + i + '&exact=false&page='+pageNo+'&size=20'
    );
  }

  removeASFAFromDynamicForm(id: string): Observable<any> {
    const requestBody = [
        {
            "op": "remove",
            "path": "/sections/traditionalpagetwo/dc.subject.asfa"
        }
    ];

    // Observable that constructs the URL
    const href$ = this.getRelationshipEndpoint3(this.path6).pipe(
        find((href: string) => !!href), // Check if the href has a value
        switchMap((data: string) => {
            // Construct the new URL by removing 'workflowprocesses' and appending the download path
            const finalUrl = `${data}/${id}`;

            // Return an HTTP request Observable with the constructed URL and request body
            return this.httpClient.patch(finalUrl, requestBody);
        })
    );

    // Return the combined Observable for subscription in the component
    return href$;
}

  private getData(url: string): Observable<RemoteData<Chart>> {
    return this.httpClient.get<RemoteData<Chart>>(url)
  }

  downloadZIP() {
    return this.getRelationshipEndpoint2(this.path1)
  }

  getRelationshipEndpoint2(url1, i?: string) {
    return this.halService.getEndpoint(url1).pipe(
      filter((href: string) => isNotEmpty(href)),
      map((href: string) => `${href}`));
  }

}


