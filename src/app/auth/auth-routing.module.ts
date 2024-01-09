import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { OtpComponent } from './otp/otp.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { BatchListComponent } from '../admin/college-management/batch-list/batch-list.component';
import { verifiedEmail } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent, canActivate:[verifiedEmail], canDeactivate:[(com:RegisterComponent)=>{return com.canExit()}] },
      { path: 'otp', component: OtpComponent ,canActivate:[verifiedEmail]},
      { path: 'sign-up/:type', component: SignUpComponent },
      { path: 'set-password/:token', component: SetPasswordComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: 'batch-list', component: BatchListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
