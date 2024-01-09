import { Component, OnInit, inject } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ResponseType, porterType } from 'src/app/types/auth.type';
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit{
  //inject services into component
  activatedRoute:ActivatedRoute=inject(ActivatedRoute);
  authService:AuthService=inject(AuthService);
  router:Router=inject(Router);

  //definitions of properties
  urlTokenType:string;

  // Define a reactive form for setting password
  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6), // Validates minimum length.
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
    ]),
  },{
    validators: this.password.bind(this) // Attach the custom validator to the FormGroup.
  });
  
  // called ones when component called
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.urlTokenType=params.get('token')
      if(this.urlTokenType != 'checkEmail' && this.urlTokenType != 'invalidLink' && this.urlTokenType != 'expiredLink'){
        localStorage.setItem('token',params.get('token'));
      }
      if(this.urlTokenType !== 'checkEmail'){
        // Check if the token associated with the user's token is valid
        const endPointName='/auth/isTokenValid';
        this.authService.authGetApi(endPointName).subscribe((resp:ResponseType<string>)=>{
          if(resp.status==401 || resp.status==403){
            localStorage.removeItem('token')
            this.router.navigate(['auth','set-password','expiredLink'])
          }else if(resp.status==404){
            localStorage.removeItem('token')
            this.router.navigate(['auth','set-password','invalidLink'])
          }
        })
      }
    })
  }

  // //marching password
  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmPassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  //sending new reset password link to user on email
  newResetPasswordLink(){
    const email =localStorage.getItem('verify');
    if(email){
      const bodyData: porterType = {
        email: email,
        userRole: 'alumni'
      }
      // Request a password reset for the provided email
      const endPointName='/auth/forgetPassword';
      this.authService.authPostApi(endPointName,bodyData).subscribe((resp:ResponseType<string>)=>{
        // this.authService.forgetPassword({email}).subscribe((resp:any)=>{
        if(resp.status === 200){
          this.router.navigate(['auth','set-password','checkEmail'])
        }else if(resp.status === 404){
          alert('User not found');
        }else{
          alert('something went wrong');
        }
      })
    }else{
      alert('Something went wrong');
    }
    
  }

  //set password in database
  onSubmit() {
    if(this.resetPasswordForm.invalid){
      alert('Please enter a password');
    }else{
      const {password}=this.resetPasswordForm.value;
      // Set a new password using the provided password data
      const endPointName = '/auth/setPassword'
      this.authService.authPostApi(endPointName,{password}).subscribe((resp:ResponseType<string>)=>{
        if(resp.status === 200){
          alert(resp.data)
          localStorage.removeItem('verify')
          localStorage.removeItem('token')
          this.router.navigate(['auth','login'])
        }else if(resp.status ===403 || resp.status ===401){
          this.router.navigate(['auth','set-password','expiredLink'])
        }else if(resp.status==404){
          this.router.navigate(['auth','set-password','invalidLink'])
        }else{
          alert('Something went wrong')
        }
      })   
    }
  }
}
