import { Component, Injectable, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { Email } from 'src/app/types/email';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
/**
 * @author Rucha Wadekar
 * @date 20/10/2022
 * @description this file will perform validations for the email form and will send the data (emails) to the backend 
 */

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  providers: [MessageService]
})
@Injectable({
  providedIn: 'root',
})
export class EmailComponent implements OnInit {
  api: ApiService = inject(ApiService);
  readonly charValidate = /^[.a-zA-Z ]*$/;
  displayNo: boolean = false;
  name = 'Angular 6';
  htmlContent = '';
  emailForm!: FormGroup;
  submitted = false;
  isLoading = false;
  files: any;
  selectedFiles: FileList;
  showBulkEmailForm = false;
  showUploadButton = false;
  showDownloadCSVButton = false;
  showDownloadCSVButtonrucha = false;
  csvData: any;
  labelText = 'To :';
  buttonText = 'Multiple';
  baseUrl = environment.apiUrl;
  emailArray = []
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.api = new ApiService();
  }
  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit(): void {
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      bulk: ['', Validators.required],
      from: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      subject: ['', [Validators.required]],
      message: [''],
      uploadFile: [''],
      selectedFile: ['', Validators.required],
    })
  }

  /**
  * @author Rucha Wadekar
  //email data save in save button
  */
  save(isBulk: boolean): void {
    if (isBulk) {
      const csvToRowArray = this.csvData.split("\n");
      for (let index = 1; index < csvToRowArray.length - 1; index++) {
        const row = csvToRowArray[index].split(",");
        this.emailArray.push(row[2].trim());
      }
    }
    const email: Email = {
      to: isBulk ? this.emailArray : this.emailForm.controls['to'].value,
      from: this.emailForm.controls['from'].value,
      subject: this.emailForm.controls['subject'].value,
      message: this.htmlContent,
    };

    const emaiLAttachment: any = {
      to: isBulk ? this.emailArray : this.emailForm.controls['to'].value,
      from: this.emailForm.controls['from'].value,
      subject: this.emailForm.controls['subject'].value,
      message: this.htmlContent,
      file: this.emailForm.get('uploadFile')?.value
    }

    // Set a display flag to true.
    this.displayNo = true;
    const FormDataUpload = new FormData();
    FormDataUpload.append('data', JSON.stringify(emaiLAttachment))
    FormDataUpload.append('file', this.emailForm.get('selectedFile')?.value)

    // Create another FormData object.
    const formData = new FormData();
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      formData.append('data', JSON.stringify(email));
      formData.append('to', email.to)
      formData.append('from', email.from)
      formData.append('subject', email.subject)
      formData.append('message', email.message)
      formData.append('dest', 'mail');
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('file', this.selectedFiles[i]);
      }
    }
    if (!this.emailForm.get('selectedFile')?.value) {
      if (
        (isBulk || this.emailForm.controls['to'].value) &&
        this.emailForm.controls['from'].value &&
        this.emailForm.controls['subject'].value &&
        this.htmlContent
      ) {

        if (isBulk) {
          //send an bulk emails
          this.api.postApi('/email/bulkEmail', emaiLAttachment).subscribe(
            (data) => {
              if (data && data['status'] === 200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bulk email sent successfully' });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data received' });
              }
            },
            (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send bulk email' });
              console.error('error', error);
            }
          );
        } else {
          // Send an SNS email
          this.api.postApi('/email/SNS', email).subscribe(
            (data) => {
              if (data && data['status'] === 200) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'SNS Email sent successfully' });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No SNS data received' });
              }
            },
            (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send SNS email' });
              console.error('error===>>>', error);
            }
          );
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fill all the details for SNS' });
      }
    }
    else {
      // Send an email with an attachment in bulk
      if (isBulk) {
        this.api.postApi('/email/bulkAttachment', formData).subscribe(
          (data) => {
            if (data && data['status'] === 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Attachment sent successfully' });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data received' });
            }
          },
        )
      } else {
        //send attachment in single
        this.api.postApi('/email/Attachment', formData).subscribe(
          (data) => {
            if (data && data['status'] === 200) {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Attachment sent successfully' });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No data received' });
            }
          },
        );
      }
    }
  }


  // Handle file upload
  fileUpload(event: any): void {
    this.selectedFiles = event.target.files;

    // Handle multiple file upload and set the selected files in the form control.
    if (event.target.files) {
      this.files = event.target.files;
      this.emailForm.controls['selectedFile']?.setValue(event.target.files)
    }
  }
  handleCsvUpload(evt) {
    // this.isLoading = true;
    const files = evt.target.files;
    const file = files[0];
    console.log(file)
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      const csv = event.target.result; // Content of CSV file
      console.log(csv);
      this.csvData = csv;

    }

  }
}