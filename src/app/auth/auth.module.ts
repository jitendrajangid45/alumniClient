import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { OtpComponent } from './otp/otp.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UnauthorizedComponent,
    OtpComponent,
    SetPasswordComponent,
    NotFoundComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    SignUpComponent,
    ReactiveFormsModule,
    AuthRoutingModule,
    
  ],
  providers: [],
  exports: [],
})
export class AuthModule {}
