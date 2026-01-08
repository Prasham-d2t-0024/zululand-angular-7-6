import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcdsPartnersRoutingModule } from './ecds-partners-routing.module';
import { EcdsPartnersComponent } from './ecds-partners.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    EcdsPartnersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EcdsPartnersRoutingModule
  ]
})
export class EcdsPartnersModule { }
