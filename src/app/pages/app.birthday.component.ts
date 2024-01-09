import { ElementRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../services/app.layout.service';
import { ApiService } from '../services/api.service';
import { profileData,ResponseType } from '../types/auth.type';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-birthday',
  templateUrl: './app.birthday.component.html',
})
export class AppBirthdayComponent implements OnInit {

  profileData:profileData;
  profilePic:string | SafeResourceUrl;
  photoURL: SafeResourceUrl;
  upcomingBirthdays: any;
  birthdayData:any;
  constructor(
    public layoutService: LayoutService,
    public el: ElementRef,
    private apiService: ApiService,
    private sanitizer: DomSanitizer  
  ) {}

  ngOnInit(): void {
  
    this.getProfileData();
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

  getProfileData() {
    this.apiService.getApi(`/user/getProfileData`).subscribe((response:ResponseType<profileData>) => {

      
      // Handle the response
      if (response) {
        this.profileData=response.data;
        this.profilePic = this.profileData.profilePic; 
        this.birthdayData = response;
        this.upcomingBirthdays = response.data;
        
        if(this.profilePic === null){

        }else{ 

        }

        this.photoURL = this.sanitizer.bypassSecurityTrustResourceUrl(
          environment.profileUrl + this.profilePic
        );
      }
    });
  }
}