import { Injectable } from '@angular/core';
import { hasValue, isNotEmptyOperator } from '../../shared/empty.util';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { CONTACT } from '../shared/contacts.resource-type';
import { Contact } from '../shared/contact.model';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Observable } from 'rxjs';
import { find, map, skipWhile, take } from 'rxjs/operators';
import { RequestParam } from '../cache/models/request-param.model';
import { FindListOptions } from './find-list-options.model';
import { SearchData, SearchDataImpl } from './base/search-data';
import { PutData, PutDataImpl } from './base/put-data';
import { CreateData, CreateDataImpl } from './base/create-data';
import { NoContent } from '../shared/NoContent.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DeleteData, DeleteDataImpl } from './base/delete-data';
import { IdentifiableDataService } from './base/identifiable-data.service';
import { dataService } from './base/data-service.decorator';
import { FindAllData, FindAllDataImpl } from '../data/base/find-all-data';
import { GetRequest, MultipartPostRequest, PostRequest } from './request.models';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { HttpHeaders } from '@angular/common/http';
import { getFirstCompletedRemoteData } from '../shared/operators';
/**
 * A service responsible for fetching/sending data from/to the REST API on the Contacts endpoint
 */
@Injectable()
@dataService(CONTACT)
export class ContactDataService extends IdentifiableDataService<Contact> implements FindAllData<Contact>, CreateData<Contact>, PutData<Contact>, DeleteData<Contact>, SearchData<Contact> {
    private createData: CreateData<Contact>;
    private searchData: SearchData<Contact>;
    private putData: PutData<Contact>;
    private deleteData: DeleteData<Contact>;
    private findAllData: FindAllDataImpl<Contact>;
    protected searchContactLinkPath = 'getContactsByItemId';
    protected searchRatingLinkPath = 'ratingbyitem';
    protected path = 'addContact';

    constructor(
        protected requestService: RequestService,
        protected rdbService: RemoteDataBuildService,
        protected objectCache: ObjectCacheService,
        protected halService: HALEndpointService,
        protected notificationsService: NotificationsService,
    ) {
        super('contacts', requestService, rdbService, objectCache, halService);
        this.findAllData = new FindAllDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
        this.createData = new CreateDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive);
        this.searchData = new SearchDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
        this.putData = new PutDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, this.responseMsToLive);
        this.deleteData = new DeleteDataImpl(this.linkPath, requestService, rdbService, objectCache, halService, notificationsService, this.responseMsToLive, this.constructIdEndpoint);
    }

    /**
     * Find metadata fields belonging to a metadata schema
     * @param schema                      The metadata schema to list fields for
     * @param options                     The options info used to retrieve the fields
     * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
     *                                    no valid cached version. Defaults to true
     * @param reRequestOnStale            Whether or not the request should automatically be re-
     *                                    requested after the response becomes stale
     * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
     *                                    {@link HALLink}s should be automatically resolved
     */
    findContactByItem(itemid: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Contact>[]) {
        const optionsWithSchema = Object.assign(new FindListOptions(), options, {
            searchParams: [new RequestParam('itemid', itemid)],
        });
        return this.searchBy(this.searchContactLinkPath, optionsWithSchema, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    }
    findRatingByItem(itemid: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Contact>[]) {
        const optionsWithSchema = Object.assign(new FindListOptions(), options, {
            searchParams: [new RequestParam('itemid', itemid)],
        });
        return this.searchBy(this.searchRatingLinkPath, optionsWithSchema, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    }
    findAll(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Contact>[]): Observable<RemoteData<PaginatedList<Contact>>> {
        return this.findAllData.findAll(options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    }
    getRelationshipEndpoint(url: string) {
        return this.halService.getEndpoint(url);
    }
    saveAttachment(postData: any, captchaToken: string = null): any {
        const requestId = this.requestService.generateRequestId();
       
        const options: HttpOptions = Object.create({});
        let headers = new HttpHeaders();
        if (captchaToken) {
            headers = headers.append('x-recaptcha-token', captchaToken);
        }
        options.headers = headers;
        let href1 = "";
        const hrefObs = this.getEndpoint().pipe(
            isNotEmptyOperator(),
            take(1)
        );
        hrefObs.pipe(
            take(1)
        ).subscribe((href) => {

            href = href + "/" + this.path;
            href1 = href;
            const request = new MultipartPostRequest(requestId, href1, postData, options);
            this.requestService.send(request);

        });

       
        return this.rdbService.buildFromRequestUUID<Contact>(requestId).pipe(
            getFirstCompletedRemoteData()
        );
    }
    findMyratingByuserofItem(itemid: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Contact>[]): any {
        let href1 = "";
        const hrefObs = this.getEndpoint().pipe(
            isNotEmptyOperator(),
            take(1)
        );
        hrefObs.pipe(
            take(1)
        ).subscribe((href) => {

            href = href + "/search/getYourRaiting?itemid=" + itemid;
            href1 = href;
            const request = new GetRequest(this.requestService.generateRequestId(), href);
            this.requestService.send(request);

        });

        return this.rdbService.buildSingle<any>(href1);

    }
    findAvgratingByuserofItem(itemid: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Contact>[]): any {
        let href1 = "";
        const hrefObs = this.getEndpoint().pipe(
            isNotEmptyOperator(),
            take(1)
        );
        hrefObs.pipe(
            take(1)
        ).subscribe((href) => {

            href = href + "/search/getAvgRaiting?itemid=" + itemid;
            href1 = href;
            const request = new GetRequest(this.requestService.generateRequestId(), href);
            this.requestService.send(request);



        });
        return this.rdbService.buildSingle<any>(href1, ...linksToFollow).pipe(
            // This skip ensures that if a stale object is present in the cache when you do a
            // call it isn't immediately returned, but we wait until the remote data for the new request
            // is created. If useCachedVersionIfAvailable is false it also ensures you don't get a
            // cached completed object
            skipWhile((rd: RemoteData<any>) => false ? rd.isStale : rd.hasCompleted),
            this.reRequestStaleRemoteData(reRequestOnStale, () =>
                this.findByHref(href1, false, reRequestOnStale, ...linksToFollow)),
        );

    }
    findratingBarkingofItem(itemid: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Contact>[]): any {
        let href1 = "";
        const hrefObs = this.getEndpoint().pipe(
            isNotEmptyOperator(),
            take(1)
        );
        hrefObs.pipe(
            take(1)
        ).subscribe((href) => {

            href = href + "/search/getRaitingAvg?itemid=" + itemid;
            href1 = href;
            const request = new GetRequest(this.requestService.generateRequestId(), href);
            this.requestService.send(request);


        });
        return this.rdbService.buildSingle<any>(href1, ...linksToFollow).pipe(
            // This skip ensures that if a stale object is present in the cache when you do a
            // call it isn't immediately returned, but we wait until the remote data for the new request
            // is created. If useCachedVersionIfAvailable is false it also ensures you don't get a
            // cached completed object
            skipWhile((rd: RemoteData<any>) => false ? rd.isStale : rd.hasCompleted),
            this.reRequestStaleRemoteData(reRequestOnStale, () =>
                this.findByHref(href1, false, reRequestOnStale, ...linksToFollow)),
        );


    }

    /**
     * Find metadata fields with either the partial metadata field name (e.g. "dc.ti") as query or an exact match to
     * at least the schema, element or qualifier
     * @param schema    optional; an exact match of the prefix of the metadata schema (e.g. "dc", "dcterms", "eperson")
     * @param element   optional; an exact match of the field's element (e.g. "contributor", "title")
     * @param qualifier optional; an exact match of the field's qualifier (e.g. "author", "alternative")
     * @param query     optional (if any of schema, element or qualifier used) - part of the fully qualified field,
     * should start with the start of the schema, element or qualifier (e.g. “dc.ti”, “contributor”, “auth”, “contributor.ot”)
     * @param exactName optional; the exact fully qualified field, should use the syntax schema.element.qualifier or
     * schema.element if no qualifier exists (e.g. "dc.title", "dc.contributor.author"). It will only return one value
     * if there's an exact match
     * @param options   The options info used to retrieve the fields
     * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's no valid cached version. Defaults to true
     * @param reRequestOnStale  Whether or not the request should automatically be re-requested after the response becomes stale
     * @param linksToFollow List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
     */
    // searchByFieldNameParams(schema: string, element: string, qualifier: string, query: string, exactName: string, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<Contact>[]): Observable<RemoteData<PaginatedList<Contact>>> {
    //     const optionParams = Object.assign(new FindListOptions(), options, {
    //         searchParams: [
    //             new RequestParam('schema', hasValue(schema) ? schema : ''),
    //             new RequestParam('element', hasValue(element) ? element : ''),
    //             new RequestParam('qualifier', hasValue(qualifier) ? qualifier : ''),
    //             new RequestParam('query', hasValue(query) ? query : ''),
    //             new RequestParam('exactName', hasValue(exactName) ? exactName : ''),
    //         ],
    //     });
    //     return this.searchBy(this.searchByFieldNameLinkPath, optionParams, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    // }

    /**
     * Finds a specific metadata field by name.
     * @param exactFieldName  The exact fully qualified field, should use the syntax schema.element.qualifier or
     * schema.element if no qualifier exists (e.g. "dc.title", "dc.contributor.author"). It will only return one value
     * if there's an exact match, empty list if there is no exact match.
     */
    // findByExactFieldName(exactFieldName: string): Observable<RemoteData<PaginatedList<Contact>>> {
    //     return this.searchByFieldNameParams(null, null, null, null, exactFieldName, null);
    // }

    /**
     * Clear all metadata field requests
     * Used for refreshing lists after adding/updating/removing a metadata field from a metadata schema
     */
    clearRequests(): void {
        this.getBrowseEndpoint().pipe(take(1)).subscribe((href: string) => {
            this.requestService.setStaleByHrefSubstring(href);
        });

    }


    /**
     * Delete an existing object on the server
     * @param   objectId The id of the object to be removed
     * @param   copyVirtualMetadata (optional parameter) the identifiers of the relationship types for which the virtual
     *                            metadata should be saved as real metadata
     * @return  A RemoteData observable with an empty payload, but still representing the state of the request: statusCode,
     *          errorMessage, timeCompleted, etc
     */
    delete(objectId: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
        return this.deleteData.delete(objectId, copyVirtualMetadata);
    }

    /**
     * Delete an existing object on the server
     * @param   href The self link of the object to be removed
     * @param   copyVirtualMetadata (optional parameter) the identifiers of the relationship types for which the virtual
     *                            metadata should be saved as real metadata
     * @return  A RemoteData observable with an empty payload, but still representing the state of the request: statusCode,
     *          errorMessage, timeCompleted, etc
     *          Only emits once all request related to the DSO has been invalidated.
     */
    public deleteByHref(href: string, copyVirtualMetadata?: string[]): Observable<RemoteData<NoContent>> {
        return this.deleteData.deleteByHref(href, copyVirtualMetadata);
    }

    /**
     * Send a PUT request for the specified object
     *
     * @param object The object to send a put request for.
     */
    put(object: Contact): Observable<RemoteData<Contact>> {
        return this.putData.put(object);
    }

    /**
     * Create a new object on the server, and store the response in the object cache
     *
     * @param object    The object to create
     * @param params    Array with additional params to combine with query string
     */
    create(object: Contact, ...params: RequestParam[]): Observable<RemoteData<Contact>> {
        return this.createData.create(object, ...params);
    }

    /**
     * Make a new FindListRequest with given search method
     *
     * @param searchMethod                The search method for the object
     * @param options                     The [[FindListOptions]] object
     * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
     *                                    no valid cached version. Defaults to true
     * @param reRequestOnStale            Whether or not the request should automatically be re-
     *                                    requested after the response becomes stale
     * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
     *                                    {@link HALLink}s should be automatically resolved
     * @return {Observable<RemoteData<PaginatedList<T>>}
     *    Return an observable that emits response from the server
     */
    public searchBy(searchMethod: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Contact>[]): Observable<RemoteData<PaginatedList<Contact>>> {
        return this.searchData.searchBy(searchMethod, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
    }

    subscirbeEmail(url: string, options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Contact>[]): any {
        let href1 = "";
        const reqId= this.requestService.generateRequestId();
        const hrefObs = this.getEndpoint().pipe(
            isNotEmptyOperator(),
            take(1)
        );
        hrefObs.pipe(
            take(1)
        ).subscribe((href) => {
            const options: HttpOptions = Object.create({});
            let headers = new HttpHeaders();
            headers = headers.append('Content-Type', 'application/json');
            options.headers = headers;
            href = href + url;
            href1 = href;
            const request = new PostRequest(reqId, href, JSON.stringify({}), options);
            this.requestService.send(request);
        });
        return this.rdbService.buildFromRequestUUID<Contact>(reqId).pipe(
            getFirstCompletedRemoteData()
        );
    }
    public downloadEmail(options?: FindListOptions, useCachedVersionIfAvailable?: boolean, reRequestOnStale?: boolean, ...linksToFollow: FollowLinkConfig<Contact>[]):any {
        let href1 = "";
        const hrefObs = this.getEndpoint().pipe(
            isNotEmptyOperator(),
            take(1)
        );
        hrefObs.pipe(
            take(1)
        ).subscribe((href) => {
      
            href = href + "/downloadSubscriberEmailExcel";
            href1 = href;
            
           
        });
        
        return href1;
         
      }

}
