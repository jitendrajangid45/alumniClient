import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';  
import { FormsModule ,ReactiveFormsModule} from '@angular/forms'; 
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { LoaderComponent } from './loader/loader.component';
import { AuthConfig, OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { HttpErrorInterceptor } from './services/http-error.interceptor';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SocketService } from './socket/socket.service';
import { environment } from 'environments/environment';
const config: SocketIoConfig = { url: environment.socketUrl, options: {} };
import {ToastModule} from 'primeng/toast';
import { ViewDocumentComponent } from './viewDocument/view-document.component'; 
import { ViewOtherProfileModule } from './view-other-profile/view-other-profile.module';



const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://accounts.google.com',

  // strict discovery document disallows urls which not start with issuers url
  strictDiscoveryDocumentValidation: false,

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: '775640216907-8pe8jc1alnni9a9ic21cl0hmpof1ua98.apps.googleusercontent.com',

  // set the scope for the permissions the client should request https://www.googleapis.com/auth/gmail.readonly
  scope: 'openid profile email',

  showDebugInformation: true,
};

@NgModule({
  declarations: [AppComponent, LoaderComponent, ViewDocumentComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PagesModule,
    AuthModule,
    BrowserAnimationsModule,
    OAuthModule.forRoot(),
    SocketIoModule.forRoot(config),
    ToastModule,
    ViewOtherProfileModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },SocketService
  ],
  bootstrap: [AppComponent],
  exports: [ViewDocumentComponent],
})
export class AppModule {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
    // this.oauthService.logoutUrl = "https://www.google.com/accounts/Logout";
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.tryLoginImplicitFlow();
  }
}
