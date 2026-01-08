import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AskusComponent } from './askus.component';

const routes: Routes = [{ path: '', component: AskusComponent, data: { title: 'Askus', showBreadcrumbs: true } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AskusRoutingModule { }
