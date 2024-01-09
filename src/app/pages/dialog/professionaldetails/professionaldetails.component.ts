import { Component,Input,OnInit, inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/utils/util.service';
import { ResponseType } from 'src/app/types/auth.type';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-professionaldetails',
  templateUrl: './professionaldetails.component.html',
  styleUrls: ['./professionaldetails.component.scss']
})
export class ProfessionaldetailsComponent implements OnInit{
  profForm:FormGroup;

  @Input() data!: any;
  utilService: UtilService = inject(UtilService);
  years = this.utilService.getYears();
  month=this.utilService.getMonths;
  isChecked:boolean=false;
  api:ApiService=inject(ApiService)

  constructor(private fb:FormBuilder,public config:DynamicDialogConfig,private messageService:MessageService,public ref: DynamicDialogRef,){
    this.data=config.data
      this.profForm=new FormGroup({
        workId:new FormControl(''),
        position:new FormControl('',[Validators.required]),
        companyName:new FormControl('',[Validators.required]),
        isWorking:new FormControl('',),
        joiningMonth:new FormControl('',Validators.required),
        joiningYear:new FormControl('',Validators.required),
        leavingMonth:new FormControl(''),
        leavingYear:new FormControl('')
      })
  }
  ngOnInit(): void {
    this.patchWorkingDetails(this.data);
  }
  patchWorkingDetails(data){
    if(data.profileData !== ''){
      if(data.profileData?.isWorking==1){
        this.isChecked=true;
      }else{
        this.isChecked=false
      }
      
      
    }
    this.profForm.patchValue({
      workId:this.data?.profileData?.workId,
      position:this.data?.profileData?.position,
      companyName:this.data?.profileData?.companyName,
      isWorking:this.isChecked ,
      joiningMonth:this.data?.profileData?.joiningMonth,
      joiningYear:this.data?.profileData?.joiningYear,
      leavingMonth:this.data?.profileData?.leavingMonth,
      leavingYear:this.data?.profileData?.leavingYear
    })
    
  }

  onSubmit(){
    if(this.profForm.valid){  
      this.api.postApi('/user/addWorkingDetails',this.profForm.value).subscribe((response:ResponseType<string>)=>{
        if(response.status==200){
          this.messageService.add({severity: 'success',summary: 'Success',detail: 'Working Details saved SuccessFully!'});
            this.ref.close();
        }else if(response.status==201){
          this.messageService.add({severity: 'error',summary: 'Error',detail: 'Working Details updated Successfully'});
        }else{
          this.messageService.add({severity: 'error',summary: 'Error',detail: 'Error while saving'});
        }
      });
    }
  }
  
  onCheckboxChange(event: any) {
     this.isChecked = event.target.checked;
     this.profForm.get('leavingMonth').setValue('');
     this.profForm.get('leavingYear').setValue('');
  }
   
  onReset(){
    this.profForm.reset();
  }
  

  
 

}

