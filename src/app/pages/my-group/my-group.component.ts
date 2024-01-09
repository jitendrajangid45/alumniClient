import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { batchDetails, getColleges,ResponseType, Users} from 'src/app/types/auth.type';

@Component({
  selector: 'app-my-group',
  templateUrl: './my-group.component.html',
  styleUrls: ['./my-group.component.scss']
})
export class MyGroupComponent implements OnInit{
  constructor(private sanitizer: DomSanitizer){};
  colleges: getColleges[];
  yearBatches:any;
  batchesByYears:any;
  batchDetails:batchDetails[];
  showCollegeBatches:boolean=false;
  showColleges:boolean=true;
  showYearwiseBatches:boolean=true;
  showYearBatches:boolean=false;
  showStudents:boolean=false;
  collegeName:string;
  studentDetails: any;
  router:Router=inject(Router);
  search:any;
  api: ApiService = inject(ApiService)
  ngOnInit() {
    this.api.getApi('/college/getColleges').subscribe((data: ResponseType<getColleges[]>) => {
      this.colleges = data.data
      
    })
    this.api.getApi(`/batch/getAllBatches`).subscribe((data:ResponseType<batchDetails[]>)=>{
            this.batchesByYears=data.data

       
    })
   
  }
  yearBatch(batchYear){
    this.api.getApi(`/batch/getYearwiseBatches?batchYear=${batchYear}`).subscribe((data:ResponseType<batchDetails[]>)=>{
      this.yearBatches=data.data
    })
  }
  showCollegeBatch(){
    this.showColleges=false;
   this.showCollegeBatches=true;
   this.showYearwiseBatches=false;
   this.showYearBatches=false
  }
  showYearBatch(){
    this.showColleges=false;
    this.showYearwiseBatches=false;
    this.showYearBatches=true
  }
  showStudent(){
    this.showColleges=false;
    this.showCollegeBatches=false;
    this.showYearwiseBatches=false;
    this.showYearBatches=false;
    this.showStudents=true
  }
  backToYear(){
    this.showStudents=false
    this.showCollegeBatches=false;
    this.showYearBatches=true;
  }
  goBack(){
    this.showColleges=true;
    this.showCollegeBatches=false;
    this.showYearwiseBatches=true;
    this.showYearBatches=false;
    this.showStudents=false;
  }
  
  ViewBatches(collegeCode,collegeName,){
    this.collegeName=collegeName
    this.api.getApi(`/batch/getBatches?collegeCode=${collegeCode}`).subscribe((data: ResponseType<batchDetails[]>) => {
      this.batchDetails = data.data
    })
   }
   
   batchStudents(batchId){
    this.api.getApi(`/batch/getBatchStudents?batchId=${batchId}&searchText=${this.search}`).subscribe((data:ResponseType<Users>)=>{
      const studentDetails=data?.data[0]?.user;
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
