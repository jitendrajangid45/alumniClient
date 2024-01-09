import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

 
// import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component'; 
import { PagesRoutingModule } from './pages-routing.module';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { ProfessionaldetailsComponent } from './dialog/professionaldetails/professionaldetails.component';
import { PersonaldetailsComponent } from './dialog/personaldetails/personaldetails.component';
import { EducationaldetailsComponent } from './dialog/educationaldetails/educationaldetails.component';
import { ViewComponent } from './view/view.component';
import { NewsRoomComponent } from './news-room/news-room.component';
import { ViewNewsComponent } from './news-room/view-news/view-news.component';
import { EventsComponent } from './events/events.component'; 
import { MyGroupComponent } from './my-group/my-group.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { AddJobComponent } from './job-board/add-job/add-job.component';
import { SubmitResumeComponent } from './job-board/submit-resume/submit-resume.component';
import { JobApplicantsComponent } from './job-board/job-applicants/job-applicants.component';
import { EditorModule } from 'primeng/editor';
import { ChipsModule } from 'primeng/chips';   
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { ChatsComponent } from './chats/chats.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginationModule } from '../pagination/pagination.module';
import { MembersComponent } from './members/members.component';
import { OverAllExperienceComponent } from './dialog/over-all-experience/over-all-experience.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
// import { AppLayoutModule } from './layout/app.layout.module';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
// import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
// import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
// import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from './app.sidebar.component';
import { AppBirthdayComponent } from './app.birthday.component';
import { AppRightBarComponent } from './app.rightbar.component';
  import { ScrollTopModule } from 'primeng/scrolltop';
  import { TieredMenuModule } from 'primeng/tieredmenu';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview'; 
import { TimelineModule } from 'primeng/timeline'; 
import { ViewOtherProfileModule } from '../view-other-profile/view-other-profile.module';
import { TagModule } from 'primeng/tag';
import { AddEventComponent } from './events/add-event/add-event.component';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';

import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    PagesComponent,
    ProfessionaldetailsComponent,
    PersonaldetailsComponent,
    EducationaldetailsComponent,
    ViewComponent,
    NewsRoomComponent,
    ViewNewsComponent,
    EventsComponent,
    MyGroupComponent,
    JobBoardComponent,
    AddJobComponent,
    SubmitResumeComponent,
    JobApplicantsComponent,
    ChatsComponent,
    MembersComponent,
    OverAllExperienceComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppRightBarComponent,
    AppBirthdayComponent,
    AppSidebarComponent,
    AppMenuComponent,
    AddEventComponent,
  ],
  imports: [
    // HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    EditorModule,
    ChipsModule,
    ToastModule,
    DialogModule,
    PickerModule,
    // AppLayoutModule,
    ConfirmDialogModule,
    PaginationModule,
    ButtonModule,
    CardModule,
    InputSwitchModule,
    RadioButtonModule,
    BadgeModule,
    SidebarModule,
    InputTextModule,
    CommonModule,
    ScrollTopModule,
    TieredMenuModule,
    ChartModule,
    DividerModule,
    AutoCompleteModule,
    CalendarModule,
    TabViewModule,
    TimelineModule,
    ViewOtherProfileModule,
    TagModule,
    DropdownModule,
    SkeletonModule,
    AccordionModule,
    TooltipModule,
  ],
})
export class PagesModule {}
