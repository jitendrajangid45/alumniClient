import { Component, inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { getOverAllExperience, getProfessionalDetails, user,ResponseType, getEducationalDetails } from '../types/auth.type';
import { environment } from 'environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-view-other-profile',
  templateUrl: './view-other-profile.component.html',
  styleUrls: ['./view-other-profile.component.scss']
})
export class ViewOtherProfileComponent {
  api:ApiService=inject(ApiService)
  route:ActivatedRoute=inject(ActivatedRoute);
  userDetails: user;
  profilePic:string |SafeResourceUrl;
  userId:number;
  eduDetails: getEducationalDetails[];
  getEducationalDetails:getEducationalDetails[]
  file: File;
  profDetails: getProfessionalDetails[];
  overAllDetails: getOverAllExperience[];
  overData: any;
  imgName: string;
  photoURL: SafeResourceUrl;
  data: string[];
  skills:string;
  skillsArr:string[];
  type:string;
  constructor(private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {  
    this.route.queryParams.subscribe((params) => {
      this.userId = params['query'];
      this.type=params['type']
        this.getUserDetails(this.userId ,'other');
        this.getEducationDetails(this.userId ,'other');
        this.getWorkingDetails(this.userId ,'other');
        this.getOverAllExperience(this.userId ,'other')
    });
  
    
  }

  goBack() {
  history.back();
}
getUserDetails(userId,type){
    this.api.getApi(`/user/getUserDetails?user_id=${userId}&type=${type}`).subscribe((details:ResponseType<user>)=>{
      this.userDetails=details.data 
      this.profilePic=this.userDetails?.profilePic
       
       this.photoURL = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.profileUrl+ this.profilePic
       );
    })
}
getEducationDetails(userId,type){
  this.api.getApi(`/user/educationalDetails?user_id=${userId}&type=${type}`).subscribe((details:ResponseType<getEducationalDetails[]>)=>{
    this.eduDetails=details.data
    
  })
}
getWorkingDetails(userId,type){
  this.api.getApi(`/user/getProfessionalDetails?user_id=${userId}&type=${type}`).subscribe((details:ResponseType<getProfessionalDetails[]>)=>{
    this.profDetails=details.data 
  })
}

getOverAllExperience(userId,type){
  this.api.getApi(`/user/getOverAllExperience?user_id=${userId}&type=${type}`).subscribe((details:ResponseType<getOverAllExperience[]>)=>{
    this.overAllDetails=details?.data
      this.skills=details?.data[0]?.professionalSkills;
      this.skillsArr=this.skills?.split(",");
  })
}

back(){
  history.back();
}
}

