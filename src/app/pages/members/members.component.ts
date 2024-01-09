import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { user,ResponseType } from 'src/app/types/auth.type';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit{
  router:Router=inject(Router)  
  api:ApiService=inject(ApiService)
  data: any;
  memberDetails: any;
  userId:number;
  userInput:string=''
  filterText: any;

  constructor(private sanitizer: DomSanitizer){}
  ngOnInit(): void {
    this.getMemberDetails('')
  
  }
  filterData(){
    this.getMemberDetails(this.filterText)
  }
  
  getMemberDetails(search){
    this.api.getApi(`/user/getAllUsers?inputValues=${search}`).subscribe((data:ResponseType<user[]>)=>{

      const memberDetails=data.data;
      this.memberDetails = memberDetails.map((el,i)=> {
        el.profilePic = el.profilePic ? this.sanitizer.bypassSecurityTrustResourceUrl(
          environment.profileUrl+`${el.profilePic}`
          ) : '../../../assets/profile.png'
        return {
          ...el
        }
        
      })  
    })
  }
  viewOtherProfile(userId,role){
    const queryParams={
      query:userId,
    }
    if(role=='alumni'){
      this.router.navigate(['pages','viewProfile'],{queryParams})
  }
else{
     this.router.navigate(['admin','viewProfile'],{queryParams})
}
  }

}
