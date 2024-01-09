import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BodyComponent } from './body/body.component';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { EmailComponent } from './email/email.component';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { JobsComponent } from './job/jobs/jobs.component'; 
import { PaginationModule } from '../pagination/pagination.module';
import { AddNewsComponent } from './news-room/add-news/add-news.component';
import { NewsComponent } from './news-room/news/news.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ViewOtherProfileModule } from '../view-other-profile/view-other-profile.module';
@NgModule({
  declarations: [
    AdminComponent,
    SidenavComponent,
    BodyComponent,
    SublevelMenuComponent,
    AdminHeaderComponent,
    EmailComponent,
    AddNewsComponent,
    NewsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    EditorModule,
    ToastModule,
    ReactiveFormsModule,
    JobsComponent,
    PaginationModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    ViewOtherProfileModule
  ],
})
export class AdminModule {}
