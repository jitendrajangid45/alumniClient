import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { ResponseType } from 'src/app/types/auth.type';
import { UtilService } from 'src/app/utils/util.service';

export interface UserInfo {
  info: {
    sub: string
    email: string,
    name: string,
    picture: string
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  api: AuthService = inject(AuthService);
  oAuthService: OAuthService = inject(OAuthService);
  utilService: UtilService = inject(UtilService);

  clientId = environment.clientId;
  redirectUrl = environment.redirectUrl;
  scope = environment.scope;
  linkedInUrl = environment.linkedInUrl;
  userProfile:UserInfo;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email, // Validates email format.
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), // Additional pattern validation.
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6), // Validates minimum length.
    ]),
  });
  constructor(private route: ActivatedRoute, private router: Router) {
    if(this.oAuthService.hasValidAccessToken()){
      setTimeout(() => {
        this.oAuthService.loadUserProfile().then((profile)=>{
          this.userProfile=profile as UserInfo;
          this.userProfile.info.email;
        })
      })
    }

    if(this.utilService.isLoggedIn()){
      // navigate to dashboard page based on user role
      this.navigateBasedOnRole(this.utilService.isLoggedIn());
    } 
  }

  // navigate to dashboard page based on user role
  navigateBasedOnRole(token:string){
    const decodedToken = this.utilService.decodeJwtToken(token)
    if(decodedToken.role === 'admin') {
      this.router.navigate(['admin','dashboard']);
    }else if(decodedToken.role === 'alumni') {
      this.router.navigate(['pages','dashboard']);
    }else{
      this.router.navigate(['auth','unauthorized']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginCredentials = this.loginForm.value
      loginCredentials.portalType = 'alumni';
        this.api.login(loginCredentials).subscribe((data:ResponseType<string>) => {
          if(data.status===200){
            const token=data.data;
            localStorage.setItem('token', token);
            // navigate to dashboard page based on user role
            this.navigateBasedOnRole(token);
          }else if(data.status===422){
            alert(data.error);
          }else{
            alert('soothing went wrong');
          }
        });
    } else {
      alert('Please enter email & password');
    }
  }
  
  signInWithLinkedIn() {
    window.location.href = `${this.linkedInUrl}?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUrl}&scope=${this.scope}`;
  }

  logout() {
    this.oAuthService.logOut();
  }

  getToken() {
    this.oAuthService.getIdToken();
  }

  loadProfile(){
    this.oAuthService.loadUserProfile().then((profile)=>{
      profile;
    })
  }

  signInWithGoogle() {
    this.oAuthService.initLoginFlow();
  }
}
