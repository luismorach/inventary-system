import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavTopComponent } from './nav-top/nav-top.component';
import { ContentComponent } from './content.component';


@NgModule({
  declarations: [
    ContentComponent,
    DashboardComponent,
    NavTopComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule
  ],
  exports:[ContentComponent]
})
export class ContentModule { }
