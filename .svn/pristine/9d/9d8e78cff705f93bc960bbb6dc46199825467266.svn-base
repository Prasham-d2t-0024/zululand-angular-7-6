import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ContactDataService } from '../core/data/contact-data.service';
import { CommunityDataService } from '../core/data/community-data.service';
import { DSONameService } from '../core/breadcrumbs/dso-name.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { PaginatedList } from '../core/data/paginated-list.model';
import { Community } from '../core/shared/community.model';
import { FollowLinkConfig } from '../shared/utils/follow-link-config.model';
import { PageInfo } from '../core/shared/page-info.model';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';

import {  combineLatest as observableCombineLatest } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
@Component({
  selector: 'ds-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  contactFormGroup: FormGroup;
  upfile: any;
  loder = false;
  communitiesRD$: BehaviorSubject<PaginatedList<Community>> = new BehaviorSubject<PaginatedList<Community>>({} as any);
  linksToFollow: FollowLinkConfig<Community>[] = [];

  pageInfoState$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(undefined);

  /**
   * The pagination configuration
   */
  config: PaginationComponentOptions;

  /**
   * The pagination id
   */
  pageId = 'tl';

  /**
   * The sorting configuration
   */
  sortConfig: SortOptions;

  /**
   * The subscription to the observable for the current page.
   */
  currentPageSubscription: Subscription;
  @ViewChild('recivermail') recivermail: ElementRef;

  /**
   * The error if authentication fails.
   * @type {Observable<string>}
   */
  public error: Observable<string>;
  public captchauuid = "";
  public base64captcha ;
  /**
   * Has authentication error.
   * @type {boolean}
   */
  public hasError = false;

  /**
   * The authentication info message.
   * @type {Observable<string>}
   */
  public message: Observable<string>;

  /**
   * Has authentication message.
   * @type {boolean}
   */
  public hasMessage = false;

  constructor(
    public contactservice:ContactDataService,
    public sanitizer: DomSanitizer,
     private fb: FormBuilder,
    public notificationsService: NotificationsService,
   private cdRef: ChangeDetectorRef,
   protected modalService: NgbModal,
    private router: Router,
    private cds: CommunityDataService,
    public dsoNameService: DSONameService,
    private paginationService: PaginationService,
    private authService: AuthService
  ) {
    this.config = new PaginationComponentOptions();
    this.config.id = this.pageId;
    this.config.pageSize = 300;
    this.config.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
   }
  ngOnInit(): void
  { 
    this.initPage();
    this.contactFormGroup = this.fb.group({
      question: ['', [Validators.required]],
      description: ['', [Validators.required]],
      email:['', [Validators.required, Validators.email]],
      firstname: '',
      lastname: '',
      organizations: '',
      institute:'',
      captcha:'',
      captchuuid:''
      
    })
  }
  /**
   * Update the list of top communities
   */
  initPage() {
    const pagination$ = this.paginationService.getCurrentPagination(this.config.id, this.config);
    const sort$ = this.paginationService.getCurrentSort(this.config.id, this.sortConfig);

    this.currentPageSubscription = observableCombineLatest([pagination$, sort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
        return this.cds.findAll({
          currentPage: currentPagination.currentPage,
          elementsPerPage: currentPagination.pageSize,
          sort: { field: currentSort.field, direction: currentSort.direction }
        });
      })
    ).subscribe((results) => {
      console.log(results.payload)
      this.communitiesRD$.next(results.payload);
      this.cdRef.detectChanges();
      // this.pageInfoState$.next(results.payload.pageInfo);
    });
    this.authService.getcaptcha().pipe().subscribe((captcha: any) => {
      this.captchauuid = captcha.uuid;
      this.base64captcha = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + captcha.base64captch);
      this.cdRef.detectChanges();
    })
  }
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.upfile = event.target.files[0];
    }

  }
  get f() { return this.contactFormGroup.controls; }
  savecontact() {
    if (!this.contactFormGroup.invalid) {
      this.loder = true;
      console.log(this.recivermail.nativeElement.value)
      let doc = {
        "instituteemail": this.recivermail.nativeElement.value,
        "question": this.contactFormGroup.value.question,
        "description": this.contactFormGroup.value.description,
        "email": this.contactFormGroup.value.email,
        "firstname": this.contactFormGroup.value.firstname,
        "lastname": this.contactFormGroup.value.lastname,
        "institute": this.contactFormGroup.value.institute,
        "organizations": this.contactFormGroup.value.organizations,
        "captch":this.contactFormGroup.value.captcha,
        "captchuuid":this.captchauuid
      }
      var formData: any = new FormData();
      formData.append('file', this.upfile);
      formData.append('contactStr', JSON.stringify(doc));
      this.contactservice.saveAttachment(formData).pipe().subscribe((data) => {
        this.loder = false;
        if (data.statusCode === 200) {
          this.contactFormGroup.get('question').patchValue('');
          this.contactFormGroup.get('description').patchValue('');
          this.contactFormGroup.get('email').patchValue('');
          this.contactFormGroup.get('firstname').patchValue('');
          this.contactFormGroup.get('lastname').patchValue('');
          this.contactFormGroup.get('institute').patchValue('');
          this.contactFormGroup.get('organizations').patchValue('');
          this.notificationsService.success("We appreciate you contacting us. One of our colleagues will get back in touch with you soon!", { name: "" });
        } else {
          this.notificationsService.error(data.errorMessage, { name: "" });
        }
      })
    } 
   
  }
}
