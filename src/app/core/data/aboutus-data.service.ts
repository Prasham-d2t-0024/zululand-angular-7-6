import { Injectable } from '@angular/core';
import { AboutUs } from '../shared/aboutus.model';
import { Observable, find, map } from 'rxjs';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteData } from './remote-data';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { hasValue } from 'src/app/shared/empty.util';
import { PostRequest, PutRequest } from './request.models';
import { getAllCompletedRemoteData, getFirstCompletedRemoteData } from '../shared/operators';
import { PaginatedSearchOptions } from 'src/app/shared/search/models/paginated-search-options.model';

@Injectable({
  providedIn: 'root'
})
export class AboutusDataService {
  protected linkPath = 'abouts';
  constructor(protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected halService: HALEndpointService,
    private httpClient : HttpClient) { }

    /**
   * Retrieves the Registration endpoint
   */
  getRegistrationEndpoint(): Observable<string> {
    return this.halService.getEndpoint(this.linkPath);
  }

   /**
   * Register a new email address
   * @param data
   * @param captchaToken the value of x-recaptcha-token header
   */
   submit(about: string, captchaToken: string = null, type?: string): Observable<RemoteData<AboutUs>> {
    const registration ={
    texteditor : about,
    status : 1
    }

    const requestId = this.requestService.generateRequestId();

    const href$ = this.getRegistrationEndpoint();

    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    if (captchaToken) {
      headers = headers.append('x-recaptcha-token', captchaToken);
    }
    options.headers = headers;

    if (hasValue(type)) {
      options.params = type ?
        new HttpParams({ fromString: 'accountRequestType=' + type }) : new HttpParams();
    }

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PostRequest(requestId, href, registration, options);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID<AboutUs>(requestId).pipe(
      getAllCompletedRemoteData()
    );
  }

  getAboutus(searchstring?:string,searchOptions?: PaginatedSearchOptions): Observable<RemoteData<AboutUs>>  {
    const href$ = this.getRegistrationEndpoint().pipe(
      find((href: string) => hasValue(href)),
    );
    let url
    href$.subscribe((data) => {
      
      url = data;
    });
    return this.getData(url);
  }
  private getData(url: string): Observable<RemoteData<AboutUs>> {
    return this.httpClient.get<RemoteData<AboutUs>>(url);
  }

  updateAboutus(data: string, id: string, captchaToken: string = null, type?: string): Observable<RemoteData<AboutUs>> {
    const registration = {
      texteditor:data,
      status:1
    };

    const requestId = this.requestService.generateRequestId();

    const href$ = this.getRegistrationEndpoint();

    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    if (captchaToken) {
      headers = headers.append('x-recaptcha-token', captchaToken);
    }
    options.headers = headers;

    if (hasValue(type)) {
      options.params = type ?
        new HttpParams({ fromString: 'accountRequestType=' + type }) : new HttpParams();
    }

    href$.pipe(
      find((href: string) => hasValue(href)),
      map((href: string) => {
        const request = new PutRequest(requestId, href + '/' + id, registration, options);
        this.requestService.send(request);
      })
    ).subscribe();

    return this.rdbService.buildFromRequestUUID<AboutUs>(requestId).pipe(
      getFirstCompletedRemoteData()
    );
  }
}
