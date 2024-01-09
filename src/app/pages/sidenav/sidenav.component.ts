import { trigger, style, transition, animate, keyframes } from '@angular/animations';
import { Component, EventEmitter, HostListener, OnInit, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarData, fadeInOut } from 'src/app/pages/sidenav/help';
import { navBarData } from './sidenavData';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType } from 'src/app/types/auth.type';
import { UtilService } from 'src/app/utils/util.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed:boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  upcomingBirthdays: any[] = [];
  birthdayData:any;
  @HostListener('window: resize', ['$event'])

  // injecting service in component
  utilService: UtilService = inject(UtilService);

  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }
  constructor(private router: Router, private http: HttpClient,private apiService: ApiService,) {}
  
  ngOnInit() {
    this.screenWidth = window.innerWidth;
     this.fetchUpcomingBirthdays();
  }
  fetchUpcomingBirthdays(): void {
   
    this.apiService
      .getApi('/user/getUpcomingBirthdays')
      .subscribe((response:ResponseType<any>) => {
        // Handle the response
        if (response) {
         this.birthdayData = response;
         this.upcomingBirthdays=response.data;
        }
      });
  
  }

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navBarData;
  multiple = false;

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav() {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  // logout to web side
  logout(){
    this.utilService.logout();
  }

  
  handleClick(item: NavbarData): void {
    if (!this.multiple) {
      for (const modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }

  getActiveClass(data: NavbarData): string {
    return this.router.url.includes(data.routerLink) ? 'active' : '';
  }
  viewAllBirthdays(){
    console.log("allBirthdays");
  }

  shrinkItems(item: NavbarData): void {
    if (!this.multiple) {
      for (const modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
  viewProfile(){
    this.router.navigate(['pages','view']);
  }
}