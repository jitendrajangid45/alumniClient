import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../../utils/util.service'
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { batches, batchDetails, courses, getBatches, getColleges, ResponseType, Users } from 'src/app/types/auth.type';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,ToastModule],
  providers:[MessageService],
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.scss']
})
export class BatchListComponent implements OnInit {
  showNewBatch: boolean | string = false;
  utilService: UtilService = inject(UtilService);
  api: ApiService = inject(ApiService)
  years = this.utilService.getYears();
  batchForm: FormGroup;
  colleges: getColleges[];
  batchDetails: batchDetails[];
  courses:courses[]
  batches: getBatches[]
  showBatches:boolean=false;
  showColleges:boolean=true
  college:string;
  filterText: any;
  collegeCode:string;
  showStudents:boolean=false;
  studentDetails: any;
  router:Router=inject(Router);
  batchId:number;
  searchText:any;
  constructor(private formBuilder: FormBuilder,private messageService:MessageService,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.api.getApi('/college/getColleges').subscribe((data: ResponseType<getColleges[]>) => {
      this.colleges = data.data
      
    })
    //const endPointName = `/batch/getCollegeByName?collegeCode=${this.college_code}`
   
 
    // this.api.getApi(endPointName).subscribe((data: ResponseType<getBatches[]>) => {
    //   this.batchByColleges = data.data
    // })
    // this.api.getApi('')
    this.batchForm = this.formBuilder.group({
      batchId:['',],
      collegeCode: [, Validators.required],
      courseName: ['',Validators.required],
      batchYear: [0, Validators.required]
    })
  }

  
  getCollegeCourses(e){
    this.api.getApi(`/college/getCollegeCourses?collegeCode=${e.target.value}`).subscribe((data:ResponseType<courses[]>)=>{
      this.courses=data.data
  })   
   
  }
    getBatchValues(id) {
    }
  saveBatch() {
    if(this.batchForm.valid){
    this.api.postApi('/batch/addBatch', this.batchForm.value).subscribe((response: ResponseType<batchDetails[]>) => {
      if(response.status==201){
        this.ngOnInit();
      this.messageService.add({severity: 'success',summary: 'Success',detail: 'Batch Added SuccessFully!'});
      }else if(response.status==200){
        this.messageService.add({severity: 'error',summary: 'info' ,detail: 'Batch Already exist'});
      }else{
        this.messageService.add({severity: 'error',summary: 'Error',detail: 'Error while adding batch'});
      }
    })
  }
  }

  filterData(){
    this.ViewBatches(this.collegeCode,this.college,this.filterText)
  }
  ViewBatches(collegeCode,collegeName,search){
    this.collegeCode=collegeCode
    this.college=collegeName;
    this.api.getApi(`/batch/getBatches?collegeCode=${collegeCode}`).subscribe((data:ResponseType<batchDetails[]>) => {
      this.batchDetails = data.data
    })
   }
 
  addNewBatch() {
    this.showNewBatch = !this.showNewBatch;
    
  }
  showBatch(){
    this.showBatches=!this.showBatches
    this.showStudents=false
    this.showColleges=false
  }
  
  backToCollege(){
    this.showBatches=false;
    this.showStudents=false
    this.showColleges=true;
    this.showNewBatch=false;
    
  }
  backToBatches(){
    this.showBatches=true;
    this.showStudents=false
  }
  showStudent(){
    this.showBatches=false;
    this.showNewBatch=false;
    this.showStudents=!this.showStudents
    this.showColleges=false;
  }
  searchData(){
    this.batchStudents(this.batchId,this.searchText)
  }
  batchStudents(batchId,searchText){
    this.batchId=batchId
    this.api.getApi(`/batch/getBatchStudents?batchId=${batchId}&searchText=${searchText}`).subscribe((data:ResponseType<Users>)=>{
      const studentDetails=data.data[0].user;
      this.studentDetails = studentDetails.map((el,i)=> {
        el.profilePic = el.profilePic ? this.sanitizer.bypassSecurityTrustResourceUrl(
          environment.profileUrl+`${el.profilePic}`
          ) : '../../../assets/profile.png'
        return {
          ...el
        }
        
      }) 
    })
  }
  viewOtherProfile(userId){
    const queryParams={
      query:userId,
    }
   
      this.router.navigate(['pages','viewProfile'],{queryParams})

  }

}

