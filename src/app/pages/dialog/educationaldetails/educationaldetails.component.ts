import { Component, Input, OnInit, inject } from '@angular/core';
import { ResponseType} from 'src/app/types/auth.type';
import {
  FormBuilder,
  Validators, 
  FormControl,
  FormGroup,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/utils/util.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-educationaldetails',
  templateUrl: './educationaldetails.component.html',
  styleUrls: ['./educationaldetails.component.scss'],
})
export class EducationaldetailsComponent implements OnInit {
  @Input() data!: any;
  eduForm: FormGroup;
  api:ApiService=inject(ApiService)
  utilService: UtilService = inject(UtilService);
  years = this.utilService.getYears();
  month=this.utilService.getMonths;
  isChecked:boolean=false
  constructor(private formBuilder: FormBuilder,public config:DynamicDialogConfig,private messageService:MessageService,public ref: DynamicDialogRef,) {
    this.data=config.data
    this.eduForm = new FormGroup({
      eduId:new FormControl(''),
      universityInstitute:new FormControl(''),
      stream:new FormControl(''),
      programDegree:new FormControl('',[Validators.required]),
      startYear:new FormControl('',[ Validators.required]),
      endYear:new FormControl('',),
      isPursuing:new FormControl(),
      collageName:new FormControl('',[Validators.required])
    });
  }
  ngOnInit(): void {

    this.patchValue(this.data) 
    
    
  }
  patchValue(data){
    
    if(data.profileData !== ''){
      if(data.profileData?.isPursuing==1){
        this.isChecked=true;
      }else{
        this.isChecked=false;
      }
      
      
    }
    this.eduForm.patchValue({
      eduId:data.profileData?.eduId ,
      universityInstitute: data.profileData?.universityInstitute,
      stream:data.profileData?.stream,
      programDegree: data.profileData?.programDegree,
      startYear: data.profileData?.startYear,
      endYear: data.profileData?.endYear,
      collageName:data.profileData?.collageName,
      isPursuing:this.isChecked
    });
  }
  onSubmit() {
    if (this.eduForm.valid) {
      this.api.postApi('/user/saveEducationalDetails',this.eduForm.value).subscribe((response:ResponseType<string>)=>{
        if(response.status==200){
          this.messageService.add({severity: 'success',summary: 'Success',detail: 'Education Details saved SuccessFully!'});
            this.ref.close();
        }else if(response.status==201){
          this.messageService.add({severity: 'info',summary: 'update',detail: 'Educational Details updated Successfully'});
          this.ref.close();
        }
        else{
          this.messageService.add({severity: 'error',summary: 'Error',detail: 'Error while saving'});
        }
      })
      }
    
   
  }
  onCheckboxChange(event: any) {
    this.isChecked = event.target.checked
    this.eduForm.get('endYear').setValue('');
 }
  onReset() {
    this.eduForm.reset();
  }
  
}
