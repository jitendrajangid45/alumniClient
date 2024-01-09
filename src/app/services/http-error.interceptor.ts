import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Check the origin of the request
    if (request.url.startsWith('http://localhost:3000')) {
      // Retrieve the token or add other headers as needed
      const authToken = localStorage.getItem('token');
      
      let authReq = request;
      if (authToken) {          
        authReq = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
      // Clone the request and add the headers you need
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          const customResponse = new HttpResponse({
            status: error.status,
            body: { status: error.status, error: error.error.error,data:null },
          });
          // Return the custom response globally for all errors
          return of(customResponse);
        })
      );
    } else {
      // This request is not going to "localhost:3000," proceed with the original request
      return next.handle(request);
    }
  }
}
