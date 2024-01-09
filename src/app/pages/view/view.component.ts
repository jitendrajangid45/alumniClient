import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { getEducationalDetails, getOverAllExperience, getProfessionalDetails, ResponseType, user,} from 'src/app/types/auth.type';
import {DialogService, DynamicDialogConfig} from 'primeng/dynamicdialog';
import { ProfessionaldetailsComponent } from '../dialog/professionaldetails/professionaldetails.component';
import { PersonaldetailsComponent } from '../dialog/personaldetails/personaldetails.component';
import { EducationaldetailsComponent } from '../dialog/educationaldetails/educationaldetails.component';
import { OverAllExperienceComponent } from '../dialog/over-all-experience/over-all-experience.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfirmationService,MessageService } from 'primeng/api';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers:[DialogService,MessageService,ConfirmationService]
})
export class ViewComponent implements OnInit{
  educationaldetails:boolean=false;
  personaldetails: boolean=false;
  professionaldetails: boolean=false;
  overAllExperience:boolean=false;
  selectedImage: any;
  api:ApiService=inject(ApiService)
  eduDetails: getEducationalDetails[];
  getEducationalDetails:getEducationalDetails[]
  file: File;
  profDetails: getProfessionalDetails[];
  overAllDetails: getOverAllExperience[];
  overData: any;
  userDetails: user
  imgName: string;
  photoURL: SafeResourceUrl;
  profilePic:string | SafeResourceUrl;
  data: string[];
  skills:string;
  skillsArr:string[];
  constructor(private router:Router ,public dialogService: DialogService,private sanitizer: DomSanitizer, private confirmationService: ConfirmationService,private messageService: MessageService){}

  openFileInput() {
    const fileInput = document.getElementById('profile_picture');
    if (fileInput) {
      fileInput.click();
    }
  }

  // Handle file input change
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        this.file = inputElement.files[0];
        const type='profile';
        const formData = new FormData();
      formData.append('dest', type);
      formData.append('file', this.file);
      this.api.postApi('/user/uploadProfile',formData).subscribe((response:ResponseType<string>)=>{
        if(response.status==200){
          this.ngOnInit();
          this.messageService.add({severity: 'success',summary: 'Success',detail: 'Profile Pic saved SuccessFully!'});
        }else{
          this.messageService.add({severity: 'error',summary: 'Error',detail: 'Error while uploading'});
        }

      })
      }
  }
  ngOnInit(): void {
    this.api.getApi(`/user/getUserDetails`).subscribe((details:ResponseType<user>)=>{
      this.userDetails=details.data;
      this.profilePic=this.userDetails?.profilePic
       
       this.photoURL = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.profileUrl+ this.profilePic
       );
    })
    this.api.getApi(`/user/educationalDetails`).subscribe((details:ResponseType<getEducationalDetails[]>)=>{
      this.eduDetails=details.data
      
    })
    this.api.getApi(`/user/getProfessionalDetails`).subscribe((details:ResponseType<getProfessionalDetails[]>)=>{
      this.profDetails=details.data
    })

    this.api.getApi(`/user/getOverAllExperience`).subscribe((details:ResponseType<getOverAllExperience[]>)=>{
      this.overAllDetails=details?.data
        this.skills=details?.data[0]?.professionalSkills;
        this.skillsArr=this.skills.split(",");
    })

  }
  // Handle file input change
  handleFileInput(event: Event) {
    // this.file = event.target.files[0];
    const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        this.file = inputElement.files[0];
      }
  }


  
show(educationaldetails:boolean,personaldetails:boolean,professionaldetails:boolean,overAllExperience:boolean,details:any) {
  let data;
  
  if(educationaldetails){
data=EducationaldetailsComponent;
  }else if(personaldetails){
    data=PersonaldetailsComponent;
  }else if(professionaldetails){
    data=ProfessionaldetailsComponent
  }else{
    
    data=OverAllExperienceComponent
  }
  const ref = this.dialogService.open(data, {
     data:{
       profileData:details
     },
      header: 'Details',
      width:'40%'
  });
}


  
  eduData(eduDetails){
    this.eduDetails=eduDetails;
  }

  expData(overdetails){
    this.overData=overdetails;
  }

  deleteEducation(eduId:number){
    this.confirmationService.confirm({
      message: 'Do you want to delete this Education Record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-cross',
      accept: () => {
        this.api
          .deleteApi(`/user/deleteEducationalDetail?eduId=${eduId}`)
          .subscribe((response: ResponseType<string>) => {
            if (response.status == 200) {
              this.ngOnInit();
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Education Details deleted SuccessFully!',
              });
            }
          });
      },
    });
  }
  deleteWorkingDetail(workId:number){
    this.confirmationService.confirm({
      message: 'Do you want to delete this Working Record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-cross',
      accept: () => {
        this.api
          .deleteApi(`/user/deleteWorkingDetail?workId=${workId}`)
          .subscribe((response: ResponseType<string>) => {
            if (response.status == 200) {
              this.ngOnInit();
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Working Details deleted SuccessFully!',
              });
            }
          });
      },
    });
  }

 
   onSubmit(){}
   display: boolean = false;

   showDialog() {
       this.display = true;
   }

   

}
