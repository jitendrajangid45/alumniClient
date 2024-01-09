import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ResponseType, porterType } from 'src/app/types/auth.type';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  //inject services into component
  authService: AuthService = inject(AuthService); // Assuming AuthService is Injectable.
  router: Router = inject(Router); //router is Injectable.
  activatedRoute:ActivatedRoute = inject(ActivatedRoute); //ActivatedRoute is Injectable.

  typeOfComponent:string='';

  // reactive from defining
  // Define a reactive form for email verification
  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email, // Validates email format.
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), // Additional pattern validation.
    ])
  });

  ngOnInit() {
    // Subscribe to route parameters to determine the component type
    this.activatedRoute.paramMap.subscribe((params) => {   
      this.typeOfComponent=params.get('type')
    })
  }

  //sending otp for register user and verify email.
  // sendOTP(){
  //   // for register user and verify email
  //   if(this.typeOfComponent == 'register'){
  //     if(this.verifyEmail.invalid){
  //       alert('enter email');
  //     }else{
  //       const bodyData: porterType = {
  //         email: this.verifyEmail.value.email,
  //         userRole: ''
  //       }
  //       // Post an OTP (One-Time Password) request to the server.
  //       const endPointName='/auth/sendOtp';
  //       this.authService.authPostApi(endPointName,bodyData).subscribe((resp:ResponseType<string>)=>{
  //         if(resp.status === 200){
  //           localStorage.setItem('verify',this.verifyEmail.value.email);
  //           this.router.navigate(['auth','otp']);
  //         }else if(resp.status === 409){
  //           alert(resp.error);
  //         }else if(resp.status === 404){
  //           alert('Bad Request');
  //         }
  //       })
  //     }       
  //   }
  //   //forgot password send reset password link
  //   else if(this.typeOfComponent == 'forgetPassword'){ 
  //     if(this.verifyEmail.invalid){
  //       alert('enter email');
  //     }else{
  //       // Request a password reset for the provided email
  //       const endPointName='/auth/forgetPassword';
  //       this.authService.authPostApi(endPointName,this.verifyEmail.value).subscribe((resp:ResponseType<string>)=>{
  //         if(resp.status === 200){
  //           localStorage.setItem('verify',this.verifyEmail.value.email);
  //           this.router.navigate(['auth','set-password','checkEmail'])
  //         }else if(resp.status === 404){
  //           alert('User not found');
  //         }else{
  //           alert('something went wrong');
  //         }
  //       })
  //     }   
  //   }
  // }

  //sending otp for register user and verify email.
  sendOTP(){
    if(this.verifyEmail.invalid){
      alert('email is Required');
    }else{
      const bodyData: porterType = {
        email: this.verifyEmail.value.email,
        userRole: 'alumni'
      }
      // for register user and verify email
      if(this.typeOfComponent == 'register'){
        // Post an OTP (One-Time Password) request to the server.
        const endPointName='/auth/sendOtp';
        this.authService.authPostApi(endPointName,bodyData).subscribe((resp:ResponseType<string>)=>{
          if(resp.status === 200){
            localStorage.setItem('verify',this.verifyEmail.value.email);
            this.router.navigate(['auth','otp']);
          }else if(resp.status === 409){
            alert(resp.error);
          }else if(resp.status === 404){
            alert('Bad Request');
          }else{
            alert('something went wrong');
          }
        })
      }       
      //forgot password send reset password link
      else if(this.typeOfComponent == 'forgetPassword'){ 
        // Request a password reset for the provided email
        const endPointName='/auth/forgetPassword';
        this.authService.authPostApi(endPointName,bodyData).subscribe((resp:ResponseType<string>)=>{
          if(resp.status === 200){
            localStorage.setItem('verify',this.verifyEmail.value.email);
            this.router.navigate(['auth','set-password','checkEmail'])
          }else if(resp.status === 404){
            alert('User not found');
          }else{
            alert('something went wrong');
          }
        }) 
      }
    }
  }
}
