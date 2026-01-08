import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import {
  DynamicFormControlModel,
  DynamicFormService,
  DynamicInputModel,
  DynamicSelectModel,
  DynamicTextAreaModel,
  DynamicCheckboxModel,
  DynamicCheckControlModel
} from '@ng-dynamic-forms/core';
import { Community } from '../../core/shared/community.model';
import { ComColFormComponent } from '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { RequestService } from '../../core/data/request.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { environment } from '../../../environments/environment';

/**
 * Form used for creating and editing communities
 */
@Component({
  selector: 'ds-community-form',
  styleUrls: ['../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.scss'],
  templateUrl: '../../shared/comcol/comcol-forms/comcol-form/comcol-form.component.html'
})
export class CommunityFormComponent extends ComColFormComponent<Community> implements OnChanges {
  /**
   * @type {Community} A new community when a community is being created, an existing Input community when a community is being edited
   */
  @Input() dso: Community = new Community();

  /**
   * @type {Community.type} This is a community-type form
   */

  type = Community.type;
  supportLevelOptions = [{ label: 'Health institutions', value: 'Health' },
    { label: 'Academic institutions', value: 'Academic' },
    { label:'Colleges/Schools of Medicine & Health Sciences/Public Health Institutes',value:'college'}
  ];
  RecentLevelOptions = [{ label: 'Show', value: 'true' },
  { label: 'Hide', value: 'false' },
 
  ];
  /**
   * The dynamic form fields used for creating/editing a community
   * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
   */
  formModel: DynamicFormControlModel[] = [
    new DynamicInputModel({
      id: 'title',
      name: 'dc.title',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'Please enter a name for this title'
      },
    }),
    new DynamicTextAreaModel({
      id: 'description',
      name: 'dc.description',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: 'abstract',
      name: 'dc.description.abstract',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: 'rights',
      name: 'dc.rights',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicTextAreaModel({
      id: 'tableofcontents',
      name: 'dc.description.tableofcontents',
      spellCheck: environment.form.spellCheck,
    }),
    new DynamicInputModel({
      id: 'email',
      name: 'dc.relation.uri',
      spellCheck: environment.form.spellCheck,
    }),
   
    // new DynamicSelectModel({
    //   id: 'education',
    //   name: 'dc.education',
    //   options: this.supportLevelOptions,
      

    // }), new DynamicSelectModel({
    //   id: 'showrecent',
    //   name: 'dc.showrecent',
    //   options: this.RecentLevelOptions,


    // }),
    
  ];

  public constructor(protected formService: DynamicFormService,
                     protected translate: TranslateService,
                     protected notificationsService: NotificationsService,
                     protected authService: AuthService,
                     protected dsoService: CommunityDataService,
                     protected requestService: RequestService,
                     protected objectCache: ObjectCacheService) {
    super(formService, translate, notificationsService, authService, requestService, objectCache);
  }

  ngOnChanges(changes: SimpleChanges) {
    const dsoChange: SimpleChange = changes.dso;
    if (this.dso && dsoChange && !dsoChange.isFirstChange()) {
       super.ngOnInit();
    }
  }
}
