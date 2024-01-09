import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ResponseType } from 'src/app/types/auth.type';

@Component({
  selector: 'app-otp',
  // standalone: true,
  // imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {

  authService: AuthService=inject(AuthService);
  router: Router=inject(Router);


  // reactive from defining
  verifyOtp: FormGroup = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^\d+$/),
    ])
  });

  verifyOTP(){
    if(this.verifyOtp.invalid){
      alert('Enter valid OTP');
    }else{
      const verifyOtpData=this.verifyOtp.value      
      verifyOtpData.email= localStorage.getItem('verify');
      // Post an OTP verification request to the server.
      const endPointName = '/auth/verifyOtp';
      this.authService.authPostApi(endPointName,verifyOtpData).subscribe((resp:ResponseType<string>)=>{
        if(resp.status === 200){
          this.router.navigate(['auth','register'])
        }else if(resp.status === 419){
          alert('OTP has expired');
        }else if(resp.status === 400){
          alert('Invalid OTP');
        }
      })
    }
  }
}
