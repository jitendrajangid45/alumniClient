import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { ViewComponent } from './view/view.component';
import { HeaderComponent } from './header/header.component';
import { EventsComponent } from './events/events.component'; 
import { MyGroupComponent } from './my-group/my-group.component';
import { NewsRoomComponent } from './news-room/news-room.component';
import { ViewNewsComponent } from './news-room/view-news/view-news.component';
import { AddJobComponent } from './job-board/add-job/add-job.component';
import { SubmitResumeComponent } from './job-board/submit-resume/submit-resume.component';
import { JobApplicantsComponent } from './job-board/job-applicants/job-applicants.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { GalleryComponent } from './gallery/gallery.component';
import { SendQueryComponent } from './send-query/send-query.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ChatsComponent } from './chats/chats.component';
import { MembersComponent } from './members/members.component';
import { ViewOtherProfileComponent } from '../view-other-profile/view-other-profile.component';
import { AddEventComponent } from './events/add-event/add-event.component';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'view', component: ViewComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'events', component: EventsComponent },
      {path:'events',
       children:[{path:'add-event',component:AddEventComponent}]},
      { path: 'chat', component: ChatsComponent },
      { path: 'header', component: HeaderComponent },
      { path: 'mygroup', component: MyGroupComponent },
      { path: 'news-room', component: NewsRoomComponent },
      {
        path: 'news-room',
        children: [{ path: 'view-news', component: ViewNewsComponent }],
      },
      { path: 'job-board', component: JobBoardComponent },
      {
        path: 'job-board',
        children: [
          { path: 'add-job', component: AddJobComponent },
          { path: 'submit-resume', component: SubmitResumeComponent },
          { path: 'job-applicants', component: JobApplicantsComponent },
        ],
      },
      { path: 'gallery', component: GalleryComponent },
      { path: 'send-query', component: SendQueryComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'members', component: MembersComponent },
      { path: 'viewProfile', component: ViewOtherProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}