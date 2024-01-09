import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss'],
})
export class ViewDocumentComponent implements OnInit {
  data: string;
  imgType: string;
  imgName: string;
  photoURL: SafeResourceUrl;
  type:string;
  constructor(
    public config: DynamicDialogConfig,
    private sanitizer: DomSanitizer
  ) {
    this.data = config.data;
  }
  ngOnInit() {
    this.imgName = this.data['filePath'];
    this.type=this.data['type']
    if(this.type=='collegeLogo'){
      this.type='collegeImage/'
      this.imgName = this.data['filePath']
    }else if(this.type=='newsImage'){
      this.type='newsImage/'
      this.imgName = this.data['filePath']
    }
    else{
      this.type='resume/'
    }
    const parts = this.imgName.split('.');
    const extension = parts[parts.length - 1];
    this.imgType = extension;
    this.photoURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${environment.viewDocUrl}${this.type}`+this.imgName
    );
  }
}
