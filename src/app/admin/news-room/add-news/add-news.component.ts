import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType } from 'src/app/types/auth.type';
import { getAllNews, newsType } from 'src/app/types/news.type';
import { ViewDocumentComponent } from 'src/app/viewDocument/view-document.component';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  providers: [MessageService,DialogService,ConfirmationService],
  styleUrls: ['./add-news.component.scss'],
})
export class AddNewsComponent implements OnInit {
  newsForm: FormGroup;
  data: any;
  newData: any;
  newsDetails: Object;
  newsContent: any;
  newsId: any;
  submitted: boolean = false;
  file: File | null = null;
  newsImage:string;
  ref: DynamicDialogRef | undefined;
  newsTypes: newsType[] = [
    { value: 'news', label: 'News' },
    { value: 'circular', label: 'Circular' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
  ) {
    this.newsForm = this.formBuilder.group({
      heading: ['', Validators.required],
      newsType: ['', Validators.required], // Assuming 'newsType' is your form control name
      newsId: [null],
      newsImage: [''],
      newsContent: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const newsId = params['query'];
      this.newsId = newsId;
      if (this.newsId) {
        this.getNewsById(this.newsId);
      }
    });
    this.patchValue(this.data);
  }

  getNewsById(newsId: number) {
    this.apiService
      .getApi(`/news/getNews?newsId=${newsId}`)
      .subscribe(
        (data: any) => {
          this.newsContent = data.news;
          this.patchValue(this.newsContent);
        },
        (error) => {
          console.error('Error fetching news:', error);
        }
      );
  }

  patchValue(data) {
    this.newsImage=data.newsImage
    this.newsId=data.newsId;
    this.newsForm.patchValue({
      heading: data.heading,
      newsType: data.newsType,
      newsContent: data.newsContent,
      newsId: data.newsId,
    });
    this.file = null;
  }
  
  ViewNewsImage(newsImage){
    const filename=newsImage
    const file=filename.split('/').pop()
    this.ref = this.dialogService.open(ViewDocumentComponent, {
      data: {
        type:'newsImage',
        filePath: file, 
      },
      header: 'News Images',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.newsForm.get('newsImage').setValue(this.file?.name);
    }
  }

  onSubmit(): void { 
    this.submitted = true;
    if (this.newsForm.valid) {
      const formData = new FormData();
      formData.append('dest', 'newsImage');
      formData.append('file', this.file || '');
      formData.append('data', JSON.stringify(this.newsForm.value));

      this.apiService.postApi('/news/createNews', formData).subscribe(
        (response: ResponseType<getAllNews>) => {
          if (response.status === 201) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'News Added Successfully!',
            });
            this.submitted = false;
            this.router.navigate(['admin', 'add-news']);
          } else if (response.status === 200) {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'News Edited Successfully!',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while adding news',
            });
          }
        }
      );
    }
  }
  
  deleteFile(newsId:number){
     this.confirmationService.confirm({
     message: 'Do you want to delete this Course Record?',
     header: 'Delete Confirmation',
     icon: 'pi pi-info-cross',
     accept: () => {
       this.apiService
         .deleteApi(`/news/deleteNewsImage?newsId=${newsId}`)
         .subscribe((response: ResponseType<string>) => {
           if (response.status == 200) {
             this.messageService.add({
               severity: 'info',
               summary: 'Confirmed',
               detail: 'News Image deleted SuccessFully!',
             });
             this.ngOnInit();
           }
         });
     },
   });
 }
}
