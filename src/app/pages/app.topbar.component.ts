import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "../services/app.layout.service";
import { UtilService } from '../utils/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  providers: [ConfirmationService, MessageService],
})
export class AppTopBarComponent implements OnInit {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    public utilService: UtilService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  isUserOnDesktop: boolean = false;
  ngOnInit() {
    // Initial call to check desktop status
    this.checkDesktopStatus();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    // Call the function when the window is resized
    this.checkDesktopStatus();
  }

  private checkDesktopStatus(): void {
    this.isUserOnDesktop = window.innerWidth > 1408;
  }


  //viewProfile function to navigate to user Profile page
  viewProfile() {
    console.log('View profile');
    this.router.navigate(['pages', 'view']);
  }


  //signOut function to logout and navigate to login page
  signOut() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to Sign out?',
      header: 'SignOut Confirmation',
      icon: 'pi pi-info-cross',
      accept: () => {
        this.utilService.logout();
      },
    });
  }
}
