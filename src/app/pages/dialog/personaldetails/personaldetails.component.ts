import { Component,Input,OnInit, inject } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType } from 'src/app/types/auth.type';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-personaldetails',
  templateUrl: './personaldetails.component.html',
  styleUrls: ['./personaldetails.component.scss']
})
export class PersonaldetailsComponent implements OnInit{
  perForm: FormGroup;
  @Input() data!: any;
  api:ApiService=inject(ApiService)
  bloodGroup = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+','O-'];
  relationshipStatus:any=['single','in_relationship','married','divorced','widowed'];
  gender:any=['male','female','other'];
  constructor(private fb:FormBuilder,public config:DynamicDialogConfig,private messageService:MessageService,public ref: DynamicDialogRef,){
    this.data=config.data
    this.perForm=new FormGroup({
      detailsId:new FormControl(''),
      firstName: new  FormControl('',[Validators.required, Validators.pattern('^[A-Za-z]+$')],),
      middleName:new FormControl('',[Validators.pattern('^[A-Za-z]+$')]),
      lastName:new FormControl('',[Validators.required,Validators.pattern('^[A-Za-z]+$')]),
      email:new FormControl('',[Validators.required,Validators.email]),
      gender:new FormControl('',[Validators.required]),
      dateOfBirth:new FormControl('',[Validators.required]),
      bloodGroup:new FormControl('',[]),
      address:new FormControl('',),
      countryCode:new FormControl('',[]),
      mobileNo:new FormControl('',[Validators.minLength(10),Validators.maxLength(10),Validators.required]),
      homeTown:new FormControl('',[]),
      location:new FormControl('',[]),
      postalCode:new FormControl('',[]),
      homePhone:new FormControl('',[Validators.minLength(10),Validators.maxLength(10),Validators.pattern('^[0-9]*$')]),
      workPhone:new FormControl('',[Validators.pattern('^[0-9]*$')]),
      currentCity:new FormControl('',[Validators.pattern('^[A-Za-z]+$')]),
      alternateEmail:new FormControl('',[Validators.email]),
      relationshipStatus:new FormControl('',[]),
      linkedinProfile:new FormControl('',[]),
      facebookProfile:new FormControl('',[]),
      twitterProfile:new FormControl('',[]),
      websitePortfolioBlog:new FormControl('',[]),
      youtubeChannel:new FormControl('',[]),
      instagramProfile:new FormControl('',[]),
      aboutMe:new FormControl('',[]),
      profilePic:new FormControl()
 })

  }

  ngOnInit(): void {
this.patchValue(this.data);


    
  }

  patchValue(data){
    this.perForm.patchValue({
      detailsId:data.profileData.userDetails[0]?.detailsId,
      firstName: data.profileData?.firstName,
      middleName:data.profileData?.middleName,
      lastName:data.profileData?.lastName,
      email:data.profileData?.email,
      gender:data.profileData?.gender,
      dateOfBirth:data.profileData?.dateOfBirth.slice(0,10),
      bloodGroup:data.profileData?.userDetails[0]?.bloodGroup,
      address:data.profileData.userDetails[0]?.address,
      countryCode:data.profileData.userDetails[0]?.countryCode,
      mobileNo:data.profileData.userDetails[0]?.mobileNo,
      homeTown:data.profileData.userDetails[0]?.homeTown,
      location:data.profileData.userDetails[0]?.location,
      postalCode:data.profileData.userDetails[0]?.postalCode,
      homePhone:data.profileData.userDetails[0]?.homePhone,
      workPhone:data.profileData.userDetails[0]?.workPhone,
      currentCity:data.profileData.userDetails[0]?.currentCity,
      alternateEmail:data.profileData.userDetails[0]?.alternateEmail,
      relationshipStatus:data.profileData?.userDetails[0]?.relationshipStatus,
      linkedinProfile:data.profileData?.userDetails[0]?.linkedinProfile,
      facebookProfile:data.profileData?.userDetails[0]?.facebookProfile,
      twitterProfile:data.profileData?.userDetails[0]?.twitterProfile,
      websitePortfolioBlog:data.profileData?.userDetails[0]?.websitePortfolioBlog,
      youtubeChannel:data.profileData?.userDetails[0]?.youtubeChannel,
      instagramProfile:data.profileData?.userDetails[0]?.instagramProfile,
      aboutMe:data.profileData?.userDetails[0]?.aboutMe,
      profilePic:data.profileData?.userDetails[0]?.profilePic
    })
  }
  onSubmit(){

    if(this.perForm.valid){
      this.api.postApi(`/user/saveUserDetails`, this.perForm.value).subscribe((response:ResponseType<string>)=>{
        if(response.status==200){
          this.ref.close();
          this.messageService.add({severity: 'success',summary: 'Success',detail: 'User Details updated SuccessFully!'});
        }else{
          this.messageService.add({severity: 'error',summary: 'Error',detail: 'Error while updating'});
        }
        
              })
    }
  }
  onReset(){
    this.perForm.reset();

    
  }

  openDialog() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.classList.add('show');

    }
  }
  closeDialog() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

}
