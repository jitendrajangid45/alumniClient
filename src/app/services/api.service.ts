
import { Injectable, inject } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from "environments/environment";
import { data } from "../types/job.type";
import { Observable } from "rxjs";
export interface ServerResponse {
  success: boolean;
  msg: string;
}

type postApiBodyType = FormData | data |unknown ;

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private baseUrl = environment.apiUrl;
  private erpUrl=environment.erpOnBoarding_url
  private headers = new HttpHeaders().set('Content-Type', 'application/json');

  private httpClient: HttpClient = inject(HttpClient);

  // Make a GET request to the specified API endpoint using the baseUrl and endpoint name
  getApi(endPointName: string) {
    return this.httpClient.get(`${this.baseUrl}${endPointName}`);
  }
  getColleges(){
    return this.httpClient.get(`${this.erpUrl}/v1/college/get-college`)
  }

  // Make a DELETE request to the specified API endpoint using the baseUrl and endpoint name
  deleteApi(endPointName: string) {
    return this.httpClient.delete(`${this.baseUrl}${endPointName}`);
  }

  // Make a POST request to the specified API endpoint using the baseUrl and endpoint name and bodyData
  postApi(endPointName: string, bodyData: postApiBodyType) {
    return this.httpClient.post(`${this.baseUrl}${endPointName}`, bodyData);
  }

  // Make a PUT request to the specified API endpoint using the baseUrl and endpoint name and bodyData
  putApi(endPointName: string, bodyData: postApiBodyType) {
    return this.httpClient.put(`${this.baseUrl}${endPointName}`, bodyData);
  }

  // download file
  downloadFile(endPointName: string, bodyData?: postApiBodyType): Observable<Blob> {    
    if(!bodyData){
      return this.httpClient.get(`${this.baseUrl}${endPointName}`, { responseType: 'blob' });
    }
    return this.httpClient.post(`${this.baseUrl}${endPointName}`,bodyData ,{ responseType: 'blob' });
  }

}