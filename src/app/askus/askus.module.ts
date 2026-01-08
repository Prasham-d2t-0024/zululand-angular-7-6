import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AskusRoutingModule } from './askus-routing.module';
import { AskusComponent } from './askus.component';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { MissingTranslationHelper } from '../shared/translate/missing-translation.helper';


@NgModule({
  declarations: [
    AskusComponent
  ],
  imports: [
    CommonModule,
    AskusRoutingModule,
    TranslateModule.forChild({
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
            useDefaultLang: true
          })
  ]
})
export class AskusModule { }
