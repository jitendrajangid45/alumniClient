import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseType } from 'src/app/types/auth.type';
import {
  appliedDataByUser,
  jobApplicantData,
  jobAppliedApplicant,
  jobData,
  jobDescription,
  jobDetails,
} from 'src/app/types/job.type';
import { ApiService } from 'src/app/services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewDocumentComponent } from 'src/app/viewDocument/view-document.component'; 
import { PaginationModule } from 'src/app/pagination/pagination.module';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TabViewModule,
    ConfirmDialogModule,
    DialogModule,
    PaginationModule,
    AccordionModule,
    ToastModule,
  ],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class JobsComponent implements OnInit {
  public sanitizedHtml: SafeHtml;
  jobDetails: jobDetails[];
  jobDetailsOthers: jobDetails[];
  jobData: jobData;
  totalItems: number;
  totalItemsOthers: number;
  jobDesc: jobApplicantData;
  totalJobCount: number;
  currentPage: number = 1;
  limit = 6;
  filterText: string;
  filterTextOthers: string;
  viewJobDetails: boolean = false;
  viewOtherJobDetails: boolean = false;
  viewJobDesc: jobDescription;
  viewOtherJobDesc: jobDescription;
  applicantDetails: jobAppliedApplicant;
  applicantData: appliedDataByUser[];
  totalAppliedJobCount: number;
  ref: DynamicDialogRef | undefined;
  filterAppliedTextSelf: string;
  filterAppliedTextOthers: string;
  tabIndex:number = 0;

  constructor(
    private apiService: ApiService,
    public dialogService: DialogService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPostJobDetails('', 1);
    this.getJobDetails('', 1,0);
  }

  //function to get Job Details of others posted
  getJobDetails(searchTerm: string, page: number,isVerified:number) {
    this.apiService
      .getApi(`/jobs/getAllJob?globalSearch=${searchTerm}&page=${page}&isVerified=${isVerified}`)
      .subscribe((response: ResponseType<jobData>) => {
        // Handle the response
        if (response) {
          this.jobData = response.data;
          this.jobDetailsOthers = this.jobData.postedJobDetails;
          this.totalJobCount = this.jobData.total;
        }
      });
  }
  // Calculate the total number of pages for pagination
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.limit);
  }

  get totalPagesOthers(): number {
    return Math.ceil(this.totalJobCount / this.limit);
  }

  onTabChange(event: Event) {
    this.currentPage = 1;
    if (event['index'] === 0) {
      this.getPostJobDetails('', 1);
    } else {
      this.getJobDetails('', 1,0);
    }
  }

  //function to get job Details of self posted Job
  getPostJobDetails(searchText: string, page: number) {
    this.apiService
      .getApi(`/jobs/getUserJob?searchText=${searchText}&page=${page}`)
      .subscribe((response: ResponseType<jobApplicantData>) => {
        if (response) {
          this.jobDesc = response.data;
          this.jobDetails = this.jobDesc.postedJobDetails;
          this.totalItems = this.jobDesc.totalCount;
        }
      });
  }

  //filterData function to get filter text to search particular Data
  filterData() {
    this.getPostJobDetails(this.filterText, 1);
  }

  //filterDataOthers function to get filter text to search particular Data of other job Posted
  filterDataOthers() {
    if(this.tabIndex === 0){
    this.getJobDetails(this.filterTextOthers, 1, 0);
    }else{
    this.getJobDetails(this.filterTextOthers, 1, 1);
    }
  }

  // viewDescription function to get full details of job.
  viewDescription(jobDetails: jobDescription) {
    this.viewJobDetails = true;
    this.viewJobDesc = jobDetails;
    const unsafeHtml = this.viewJobDesc.jobsDescription;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
    this.getJobAppliedData(this.viewJobDesc.jobId, '', 1);
  }

  // getJobAppliedData function to get data of applied alumni on particular job
  getJobAppliedData(jobId: number, searchText: string, page: number) {
    const job_id = jobId;
    this.apiService
      .getApi(
        `/jobs/getAppliedJobData?searchText=${searchText}&page=${page}&job_id=${job_id}`
      )
      .subscribe((response: ResponseType<jobAppliedApplicant>) => {
        if (response) {
          this.applicantDetails = response.data;
          this.applicantData = this.applicantDetails.jobAppliedData;

          this.totalAppliedJobCount = this.applicantDetails.total;
        }
      });
  }

  // viewOtherDescription function to get full details of job posted by Others.
  viewOtherJobDescription(jobDetails: jobDescription) {
    this.viewOtherJobDetails = true;
    this.viewOtherJobDesc = jobDetails;
    const unsafeHtml = this.viewOtherJobDesc.jobsDescription;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
    this.getJobAppliedData(this.viewOtherJobDesc.jobId, '', 1);
  }

  //backToJob function to get back to job Board page.
  backToJob() {
    this.viewJobDetails = false;
    this.viewOtherJobDetails = false;
    this.filterAppliedTextOthers = '';
    this.filterAppliedTextSelf = '';
  }

  //jobDelete function to delete job
  jobDelete(jobId: number) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this Job Record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-cross',
      accept: () => {
        this.apiService
          .deleteApi(`/jobs/deleteJob?jobId=${jobId}`)
          .subscribe((response: ResponseType<string>) => {
            if (response.status == 200) {
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmed',
                detail: 'Job deleted SuccessFully!',
              });
              this.ngOnInit();
              this.viewJobDetails = false;
              this.viewOtherJobDetails = false;
            }
          });
      },
    });
  }

  //view uploaded resume document
  viewResumeDocument(filePath: string) {
    this.ref = this.dialogService.open(ViewDocumentComponent, {
      data: {
        filePath: filePath,
      },
      header: 'Resume Document',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  //filterAppliedDataSelf function to search from applied alumni on particular job.
  filterAppliedDataSelf() {
    this.getJobAppliedData(
      this.viewJobDesc.jobId,
      this.filterAppliedTextSelf,
      1
    );
  }

  //filterAppliedDataOthers function to search from applied alumni on particular job posted by others.
  filterAppliedDataOthers() {
    this.getJobAppliedData(
      this.viewOtherJobDesc.jobId,
      this.filterAppliedTextOthers,
      1
    );
  }

  // Function to handle page change event
  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
    this.getPostJobDetails(this.filterText, this.currentPage);
  }

  onPageChangedOthers(newPage: number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
    if(this.tabIndex === 0){
    this.getJobDetails(this.filterText, this.currentPage, 0);
    }else{
    this.getJobDetails(this.filterText, this.currentPage,1);
    }
  }

  verifyJob(jobId: number) {
    this.apiService
      .postApi(`/jobs/verifyJob`, { jobId })
      .subscribe((response:ResponseType<string>) => {
        if (response.status === 200) {
          if (this.filterText === undefined) {
            this.filterText = '';
          }
           this.messageService.add({severity: 'success',summary: 'Success', detail: `${response.data}`});
          this.getJobDetails(this.filterText, this.currentPage,0);
        }
      });
  }

  verifiedUnverifiedTab(event:Event){
        this.currentPage = 1;
        this.tabIndex=event['index'];
        if (event['index'] === 0) {
          this.getJobDetails('', 1,0);
        } else {
          this.getJobDetails('', 1,1);
        }
  }
}
