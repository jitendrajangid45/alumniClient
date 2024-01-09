import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewDocumentComponent } from 'src/app/viewDocument/view-document.component';;
import { batchDetails, courses, getColleges,ResponseType } from 'src/app/types/auth.type';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-college-list',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,ToastModule,DialogModule,ConfirmDialogModule],
  templateUrl: './college-list.component.html',
  providers:[MessageService,DialogService,DialogService,ConfirmationService],
  styleUrls: ['./college-list.component.scss']
})
export class CollegeListComponent implements OnInit{
  api: ApiService = inject(ApiService)
  colleges:any;
  collegeLogoPath:string;
  collegeId:string
  showCollegeForm:boolean|string=false;
  showColleges:boolean=true;
  file:File;
  profilePic:string
  photoURL:SafeResourceUrl
  ref: DynamicDialogRef | undefined;
  courses:courses[];
  showNewCourse:boolean=false;
  showCourse:boolean=false;
  hideIcon:boolean=true;
  collegeCode:number;
  college:string;
  constructor(private messageService:MessageService,public dialogService: DialogService,private confirmationService: ConfirmationService,private sanitizer: DomSanitizer){}
  collegeForm: FormGroup = new FormGroup({
    collegeId:new FormControl(),
    collegeName: new FormControl('', [Validators.required]),
    collegeCode:new FormControl('',[Validators.required]),
    collegeLogoPath:new FormControl('',[Validators.required])
  })
  courseForm:FormGroup=new FormGroup({
    courseId:new FormControl(),
    collegeCode:new FormControl(),
    courseName:new FormControl('',[Validators.required])
  })
  ngOnInit(): void {
    this.getColleges()

  }
  getColleges(){
    this.api.getApi(`/college/getColleges`).subscribe((data:ResponseType<getColleges[]>) => {
      const colleges= data.data;
      this.colleges = colleges.map((el,i)=> {
        el.collegeLogoPath = el.collegeLogoPath ? this.sanitizer.bypassSecurityTrustResourceUrl(
          environment.collegeLogoUrl+`${el.collegeLogoPath}`):el.collegeLogoPath;
        return {
          ...el
        }
      }) 
    })
    
    
  }
  editCollege(details){
    this.collegeLogoPath=details.collegeLogoPath;
    this.collegeId=details.collegeId;
    this.showCollegeForm=!this.showCollegeForm;
    this.collegeForm.patchValue({
      collegeCode:details.collegeCode,
      collegeId:details.collegeId,
      collegeName:details.collegeName,
    })
  }
  backToCollege(type:string){

    if(type === 'add' && this.showCollegeForm === false) this.hideIcon=false;

    if(this.showCollegeForm) this.hideIcon=true;

    this.collegeForm.reset();
    this.collegeLogoPath='undefined';
    this.showCollegeForm=!this.showCollegeForm;   
    
  }
  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
    }
  }
  saveCollege(){
    const formData = new FormData();
      formData.append('dest', 'collegeImage');
      formData.append('file', this.file);
      formData.append('data', JSON.stringify(this.collegeForm.value));
    this.api.postApi(`/college/addCollege`,formData).subscribe((response:ResponseType<batchDetails>)=>{  
      if(response.status==201){
        this.getColleges()
      this.backToCollege('')
      this.messageService.add({severity: 'success',summary: 'Success',detail: 'College Added SuccessFully!'});
      }else if(response.status==200){
        this.collegeForm.reset();
        this.getColleges()
        this.backToCollege('')
        this.messageService.add({severity: 'info',summary: 'info' ,detail: 'College updated Successfully'});
      } else{
      this.ngOnInit();
        this.messageService.add({severity: 'error',summary: 'Error',detail: 'An error occcured while saving'})
        }
    })
   
  }
  viewCollegeLogo(filePath: string ) {
    const filename=filePath['changingThisBreaksApplicationSecurity']
    const file=filename.split('/').pop()
    this.ref = this.dialogService.open(ViewDocumentComponent, {
      data: {
        type:'collegeLogo',
        filePath: file,
        
      },
      header: 'College Logo',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  saveCourse(){
        this.api.postApi(`/college/addCourse`,this.courseForm.value).subscribe((response:ResponseType<courses[]>)=>{
          if(response.status==201){
            this.backToCourse();
            this.getCoursesData(this.collegeCode)
            this.messageService.add({severity: 'success',summary: 'Success',detail: 'Course Added SuccessFully!'});
            }else if(response.status==200){
              this.backToCourse();
              this.getCoursesData(this.collegeCode)
              this.messageService.add({severity: 'info',summary: 'info' ,detail: 'Course updated Successfully'});
            }else if(response.status==422){
          this.messageService.add({severity: 'error',summary: 'Error',detail: 'Course already exists'});
        } 
            else{
              this.backToCourse();
              this.messageService.add({severity: 'error',summary: 'Error',detail: 'An error occcured'});
            }
        })
      
    
    
  }

  ViewCourses(college){
    this.collegeCode=college.collegeCode;
    this.college=college.collegeName
    this.getCoursesData(college.collegeCode);
}

getCoursesData(collegeCode){
  this.api.getApi(`/college/getCollegeCourses?collegeCode=${collegeCode}`).subscribe((data:ResponseType<courses[]>)=>{
    this.courses=data.data
})
}

editCourse(details){
  this.showNewCourse=!this.showNewCourse;
  this.courseForm.patchValue({
    courseName:details.courseName,
    courseId:details.courseId
  })
}
  deleteCollegeLogo(collegeId){
      this.confirmationService.confirm({
      message: 'Do you want to delete this College Logo?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-cross',
      accept: () => {
        this.api
          .deleteApi(`/college/deleteCollegeLogo?collegeId=${collegeId}`)
          .subscribe((response: ResponseType<string>) => {
            if (response.status == 200) {
              this.ngOnInit();
              this.backToCollege('')
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'College Logo deleted SuccessFully!',
              });
            }
          });
      },
    });
  }
  deleteCourse(course){
     const courseId=course.courseId
      this.confirmationService.confirm({
      message: 'Do you want to delete this Course Record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-cross',
      accept: () => {
        this.api
          .deleteApi(`/college/deleteCourse?courseId=${courseId}`)
          .subscribe((response: ResponseType<string>) => {
            if (response.status == 200) {
              this.getCoursesData(this.collegeCode)
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Course deleted SuccessFully!',
              });
            }
          });
      },
    });
  }
  showCollege(){
    this.showColleges=!this.showColleges
  }

  backToCourse(){
    this.courseForm.reset();
    this.courseForm.patchValue({
      collegeCode:this.collegeCode
    })
    this.showNewCourse=!this.showNewCourse;
  }
  showCourses(){
    this.showColleges=!this.showColleges
    this.showCourse=!this.showCourse
  }
  goBack(){
    this.showColleges=true;
    this.courseForm.reset;
    this.showCourse=false;
    this.showNewCourse=false;
  }
}
