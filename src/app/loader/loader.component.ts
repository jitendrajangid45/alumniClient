import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


interface LoginResponse {
  status: number;
  data:string;
  token:string;
  redirectUrl: string; 
}
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {

  api: AuthService = inject(AuthService);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        
        // You have received the code, now make a request to your backend.
        const endPointName = `/auth/linkedinLogin?code=${code}`     

        this.api.authGetApi(endPointName).subscribe((response:LoginResponse) => { 
          if (response.status === 200) {
            if(response.token){
              localStorage.setItem('token', response.token);
              this.router.navigate([response.redirectUrl]);
            }else{
              localStorage.setItem('verify',response.data);         
              this.router.navigate([response.redirectUrl],{queryParams:{')n{N,9K3c6ziba}1w&9U':'htjk36V$h5f'}});
            }
          } else if(response.status === 403){
            this.router.navigate(['auth', 'unauthorized']);
          }
        });
      }
    });
  }
}
