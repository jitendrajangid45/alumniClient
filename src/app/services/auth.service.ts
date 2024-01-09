import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { login, PostApiBodyType } from '../types/auth.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  private httpClient: HttpClient = inject(HttpClient);

  // Post a login request to the server.
  login(data: login) {
    return this.httpClient.post(this.baseUrl + '/auth/login', data);
  }

  // Post a registration request to the server.
  register(data: unknown) {
    return this.httpClient.post(this.baseUrl + '/auth/register', data);
  }

  // Make a GET request to the specified API endpoint using the baseUrl and endpoint name
  authGetApi(endPointName: string){
    return this.httpClient.get(`${this.baseUrl}${endPointName}`);
  }

  // Make a POST request to the specified API endpoint using the baseUrl and endpoint name and bodyData
  authPostApi(endPointName: string, bodyData: PostApiBodyType){
    return this.httpClient.post(`${this.baseUrl}${endPointName}`,bodyData);
  }
}
