import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { MissingTranslationHelper } from '../shared/translate/missing-translation.helper';


@NgModule({
  declarations: [
    FaqComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    TranslateModule.forChild({
        missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
        useDefaultLang: true
      })
  ]
})
export class FaqModule { }
