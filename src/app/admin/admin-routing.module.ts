import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { EmailComponent } from './email/email.component';
import { NewsComponent } from './news-room/news/news.component';
import { AddNewsComponent } from './news-room/add-news/add-news.component';
import { ViewOtherProfileComponent } from '../view-other-profile/view-other-profile.component';


const routes: Routes = [
  { path:'',component:AdminComponent, children:[
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component')
      .then(m=>m.DashboardComponent) },
      { path: 'add-alumnus', loadComponent: () => import('./alumnus/add-alumnus/add-alumnus.component')
      .then(m=>m.AddAlumnusComponent) },
      { path: 'alumni', loadComponent: () => import('./alumnus/alumni/alumni.component')
      .then(m=>m.AlumniComponent) },
      { path: 'email-to-alumni', loadComponent: () => import('./alumnus/email-to-alumni/email-to-alumni.component')
      .then(m=>m.EmailToAlumniComponent) },
      { path: 'add-event', loadComponent: () => import('./event/add-event/add-event.component')
      .then(m=>m.AddEventComponent) },
      { path: 'events', loadComponent: () => import('./event/events/events.component')
      .then(m=>m.EventsComponent) },
      { path: 'add-job', loadComponent: () => import('./job/add-job/add-job.component')
      .then(m=>m.AddJobComponent) },
      { path: 'jobs', loadComponent: () => import('./job/jobs/jobs.component')
      .then(m=>m.JobsComponent)},    
      { path: 'college-list', loadComponent: () => import('./college-management/college-list/college-list.component')
      .then(m=>m.CollegeListComponent) },
      { path: 'batch-list', loadComponent: () => import('./college-management/batch-list/batch-list.component')
      .then(m=>m.BatchListComponent) },
      { path: 'email', component:EmailComponent },
      {
        path:'news',
        component:NewsComponent
       },
       {
        path:'add-news',
        component:AddNewsComponent
       },
       {
        path:'viewProfile',
        component:ViewOtherProfileComponent
       }
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
