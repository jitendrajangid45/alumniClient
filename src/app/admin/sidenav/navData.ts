import { INavbarData } from "./helper";

export const navBarData: INavbarData[] = [
  {
    routerLink: 'dashboard',
    icon: 'fal fa-home',
    label: 'Dashboard',
  },
  {
    routerLink: 'alumnus',
    icon: 'fal fa-graduation-cap',
    label: 'Alumnus',
    items: [
      {
        routerLink: 'add-alumnus',
        label: 'Add Alumnus',
      },
      {
        routerLink: 'alumni',
        label: 'Alumni',
      },
    ],
  },
  {
    routerLink: 'college-management',
    icon: 'fal fa-building',
    label: 'College Management',
    items: [
      {
        routerLink: 'college-list',
        label: 'College List',
      },
      {
        routerLink: 'batch-list',
        label: 'Batch List',
      },
    ],
  },
  {
    routerLink: 'event',
    icon: 'fal fa-calendar-check',
    label: 'Event',
    items: [
      {
        routerLink: 'add-event',
        label: 'Add Event',
      },
      {
        routerLink: 'events',
        label: 'Events',
      },
    ],
  },
  {
    routerLink: 'job',
    icon: 'fal fa-briefcase',
    label: 'JOB',
    items: [
      {
        routerLink: 'add-job',
        label: 'Add Job',
      },
      {
        routerLink: 'jobs',
        label: 'Jobs',
      },
    ],
  },
  {
    routerLink: 'news',
    icon: 'fal fa-newspaper',
    label: 'News Room',
    items:[
      {
        routerLink:'news',
        label:'News'
      },
      {
        routerLink:'add-news',
        label:'Add News'
      }
    ]
  },
  {
    routerLink: 'email',
    icon: 'fal fa-envelope',
    label: 'Mail',
  },
];