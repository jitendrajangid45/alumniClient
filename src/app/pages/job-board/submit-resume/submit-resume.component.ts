import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType } from 'src/app/types/auth.type';
import {
  resumeData,
  resumeDataByFriend,
  resumeDataByUser,
} from 'src/app/types/job.type';

@Component({
  selector: 'app-submit-resume',
  templateUrl: './submit-resume.component.html',
  styleUrls: ['./submit-resume.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class SubmitResumeComponent implements OnInit {
  resumeType: string = 'user'; // Initialize the default resume type
  file: File;
  formResume: FormGroup; // Create a FormGroup for the resume submission form
  resumeData: resumeData;
  resumeDataUser: resumeDataByUser;
  resumeDataFriend: resumeDataByFriend;
  fileNameUser: string;
  fileNameFriend: string;

  // Inject Router using constructor
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    // Initialize the form controls with their default values and validators
    this.formResume = this.fb.group({
      applicantFullName: ['', [Validators.required]],
      applicantEmail: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required]],
      applicantRelevantSkills: ['', [Validators.required]],
      file: ['', [Validators.required]],
      noteForRecruiter: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getResumeData('user');
  }

  getResumeData(type: string) {
    this.apiService
      .getApi('/jobs/getResume')
      .subscribe((response: ResponseType<resumeData>) => {
        // Handle the response
        if (response.status === 200) {
          this.resumeData = response.data;
          this.resumeDataUser = this.resumeData.resumeData;
          this.resumeDataFriend = this.resumeData.resumeDataFriend;
          if (type === 'user') {
            this.patchValueOfUser(this.resumeDataUser);
          } else {
            this.patchValueOfFriend(this.resumeDataFriend);
          }
          this.fileNameUser = this.resumeDataUser?.applicantResumePath;
          if (!this.fileNameUser) this.fileNameUser = undefined;
          this.fileNameFriend = this.resumeDataFriend?.applicantResumePath;
          if (!this.fileNameFriend) this.fileNameFriend = undefined;
        }
      });
  }

  //patch the value of user Resume
  patchValueOfUser(data: resumeDataByUser) {
    this.formResume.patchValue({
      applicantEmail: data?.applicantEmail,
      applicantFullName: data?.applicantFullName,
      mobileNumber: data?.mobileNumber,
      applicantRelevantSkills: data?.applicantRelevantSkills,
      noteForRecruiter: data?.noteForRecruiter
    });
  }

  //patch the value of userFriend Resume
  patchValueOfFriend(data: resumeDataByFriend) {
    this.formResume.patchValue({
      applicantEmail: data?.applicantEmail,
      applicantFullName: data?.applicantFullName,
      mobileNumber: data?.mobileNumber,
      applicantRelevantSkills: data?.applicantRelevantSkills,
      noteForRecruiter: data?.noteForRecruiter,
    });
  }

  // Function to switch between different resume types
  switchResume(resume: string) {
    if (resume) {
      this.resumeType = resume;
      if (this.resumeType === 'user') {
        this.formResume.reset();
        this.patchValueOfUser(this.resumeDataUser);
        this.fileNameUser = this.resumeDataUser?.applicantResumePath;
        if (!this.fileNameUser) this.fileNameUser = undefined;
        this.formResume.get('file')?.setValidators([Validators.required]);
        this.formResume.get('file')?.updateValueAndValidity();
      } else {
        this.formResume.reset();
        this.patchValueOfFriend(this.resumeDataFriend);
        this.fileNameFriend = this.resumeDataFriend?.applicantResumePath;
        if (!this.fileNameFriend) this.fileNameFriend = undefined;
        this.formResume.get('file')?.setValidators([Validators.required]);
        this.formResume.get('file')?.updateValueAndValidity();
      }
    }
  }

  // Handle file input change
  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
    }
  }

  // Function to submit the resume
  submitResume(resume: string) {
    if ((this.file || this.fileNameUser !== undefined) && resume === 'user') {  
      this.formResume.get('file')?.clearValidators();
      this.formResume.get('file')?.updateValueAndValidity();
    } else if ((this.file || this.fileNameFriend !== undefined) &&  resume === 'friend' ) { 
      this.formResume.get('file')?.clearValidators();
      this.formResume.get('file')?.updateValueAndValidity();
    }

    if (this.formResume.valid) {
      // The form is valid, so you can proceed with submission
      const formValue = { ...this.formResume.value };
      delete formValue.file;
      formValue.reference = resume;

      const formData = new FormData();
      formData.append('dest', 'resume');
      formData.append('file', this.file);
      formData.append('data', JSON.stringify(formValue));

      this.apiService
        .postApi('/jobs/postResume', formData)
        .subscribe((response: ResponseType<string>) => {
          // Handle the response
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Resume saved Successfully!',
            });
            this.getResumeData(resume);
          } else {
            this.messageService.add({
              severity: 'danger',
              summary: 'Danger',
              detail: 'Error occurred while saving resume try again later!',
            });
          }
        });
    } else {
      // The form is invalid
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill All the Details',
      });
    }
  }

  // Function to cancel the submission and navigate to another page
  cancelSubmission() {
    this.router.navigate(['pages', 'job-board']);
  }

  //delete the resume by reference type
  deleteResume(referenceType: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Resume?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-cross',
      accept: () => {
        this.apiService
          .deleteApi(`/jobs/deleteResumeFile?reference=${referenceType}`)
          .subscribe((response: ResponseType<string>) => {
            if (response.status == 200) {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Resume Deleted SuccessFully!',
              });
              this.ngOnInit();
            }
          });
      },
    });
  }
}
