import { Component, Optional } from '@angular/core';
import { hasValue } from '../shared/empty.util';
import { KlaroService } from '../shared/cookies/klaro.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ContactDataService } from '../core/data/contact-data.service';
import { getAllCompletedRemoteData } from '../core/shared/operators';
import { AppConfig } from '../app-config';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html'
})
export class FooterComponent {
  dateObj: number = Date.now();

  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter = false;
  showPrivacyPolicy = environment.info.enablePrivacyStatement;
  showEndUserAgreement = environment.info.enableEndUserAgreement;
  showSendFeedback$: Observable<boolean>;
  email:string;
  logoPath = AppConfig.logoPath;
  constructor(
    @Optional() private cookies: KlaroService,
    private authorizationService: AuthorizationDataService,
    private notificationsService : NotificationsService,
    private contactDataService :ContactDataService
  ) {
    this.showSendFeedback$ = this.authorizationService.isAuthorized(FeatureID.CanSendFeedback);
  }

  showCookieSettings() {
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
  }
 disable = true;
  validateEmail() {
    // Define the regular expression pattern for a valid email address
    const emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Use test method to check if the email matches the pattern
    if (emailPattern.test(this.email)) {
      this.disable = false;
      return true;
    } else {
      this.disable = true;
      return false;
    }
  }

  subscirbe() {
    debugger
    console.log(this.validateEmail());
    if(!!this.validateEmail()) {
      this.contactDataService.subscirbeEmail('/addSubscriberEmail?email=' + this.email).pipe(getAllCompletedRemoteData()).subscribe((rd: any) => {
      console.log(rd)
        if(rd.statusCode === 200) {
          this.email = '';
        this.notificationsService.success("Email subscribed successfully.", { name: "" });
      } else {
        this.notificationsService.error(rd.errorMessage, { name: "" });
      }
      });
      
    } else {
      this.notificationsService.error("Enter valid email to subscribe", { name: "" });
    }
  }
}
