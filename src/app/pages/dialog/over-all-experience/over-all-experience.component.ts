import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType } from 'src/app/types/auth.type';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-over-all-experience',
  templateUrl: './over-all-experience.component.html',
  styleUrls: ['./over-all-experience.component.scss']
})
export class OverAllExperienceComponent implements OnInit{
  overAllForm: FormGroup;
  api:ApiService=inject(ApiService)
  @Input() data!: any;
  constructor(private formBuilder: FormBuilder,public config:DynamicDialogConfig,private messageService:MessageService,public ref: DynamicDialogRef,) {
    this.data=config.data
      this.overAllForm=new FormGroup({
        profId:new FormControl(''),
        overallWorkExperience:new FormControl('',[Validators.pattern(/^[0-9]+(\.[0-9]+)?$/),]),
        roles:new FormControl('',[Validators.required]),
        industriesWorkIn:new FormControl('',[Validators.required]),
        professionalSkills:new FormControl('',[Validators.required]) 
      })
  }
  ngOnInit(): void {
    this.overAllForm.patchValue({
      profId:this.data.profileData?.profId,
      overallWorkExperience:this.data.profileData?.overallWorkExperience,
      professionalSkills:this.data.profileData?.professionalSkills,
      industriesWorkIn:this.data.profileData?.industriesWorkIn,
      roles:this.data.profileData?.roles
    })
  }
 
    
 
  
  onSubmit() {
    if (this.overAllForm.valid) {
      
      this.api.postApi('/user/updateOverAllExperience',this.overAllForm.value).subscribe((response:ResponseType<string>)=>{
        if(response.status==200){
          this.ref.close()
          this.messageService.add({severity: 'success',summary: 'Success',detail: 'OverAll  Experience updated SuccessFully!'});
        }else{
          this.messageService.add({severity: 'error',summary: 'Error',detail: 'Error while updating'});
        }
      });
      }
    
  }
  onReset() {
    this.overAllForm.reset();
  }

}
