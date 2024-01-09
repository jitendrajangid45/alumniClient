import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType } from 'src/app/types/auth.type';
import { statisticData } from 'src/app/types/event.type';
import {appliedData,appliedDataByFriend,appliedDataByUser,jobData,jobDescription,jobDetails} from 'src/app/types/job.type';
@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.scss'],
  providers: [MessageService],
})
export class JobBoardComponent implements OnInit {
  public sanitizedHtml: SafeHtml;
  jobDetails: jobDetails[];
  jobData: jobData;
  jobView: boolean = true;
  descriptionView: boolean = false;
  jobDescription: jobDescription;
  filterText: string;
  currentPage = 1;
  appliedData: appliedData;
  appliedByUser: appliedDataByUser[];
  appliedByFriend: appliedDataByFriend[];
  totalItems: number;
  limit = 6;
  status: string;
  appliedUser: boolean = false;
  appliedFriend: boolean = false;
  statisticData:statisticData;

  items: MenuItem[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getJobDetails('', 1,1);
    this.getStatisticData();
    this.items = [
      {
        label: 'Job',
        icon: 'pi pi-fw pi-briefcase',
        command: () => this.addJobIntern('postJob'),
      },
      {
        label: 'Internship',
        icon: 'pi pi-fw pi-book',
        command: () => this.addJobIntern('postIntern'),
      },
    ];
  }

  getStatisticData() {
    this.apiService
      .getApi(`/jobs/getStatisticData`)
      .subscribe((response: ResponseType<statisticData>) => {
        // Handle the response
        if (response) {
          this.statisticData=response.data;
          const documentStyle = getComputedStyle(document.documentElement);
          const textColor = documentStyle.getPropertyValue('--text-color');

          this.data = {
            labels: ['Total Jobs', 'Job Seeker', 'Applied Jobs'],
            datasets: [
              {
                data: [this.statisticData.totalJob, this.statisticData.totalJobSeeker, this.statisticData.totalJobApplied],
                backgroundColor: ['#007EA7', '#003459', '#00A8E8'],
                hoverBackgroundColor: [
                  documentStyle.getPropertyValue('--blue-400'),
                  documentStyle.getPropertyValue('--yellow-400'),
                  documentStyle.getPropertyValue('--green-400'),
                ],
              },
            ],
          };

          this.options = {
            plugins: {
              legend: {
                labels: {
                  usePointStyle: true,
                  color: textColor,
                },
              },
            },
          };
        }
      });
  }
  // Calculate the total number of pages for pagination
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.limit);
  }

  // Function to navigate to the "add-job" page with a query parameter
  addJobIntern(data: string) {
    const queryParams = {
      query: data,
    };
    this.router.navigate(['pages', 'job-board', 'add-job'], { queryParams });
  }

  // Function to navigate to the "submit-resume" page
  submitResume() {
    this.router.navigate(['pages', 'job-board', 'submit-resume']);
  }

  // Function to navigate to the "job-applicants" page
  viewJobApplicants() {
    this.router.navigate(['pages', 'job-board', 'job-applicants']);
  }

  // Function to filter job data based on the filter text
  filterData() {
    this.getJobDetails(this.filterText, 1,1);
  }

  //function to get Job Details
  getJobDetails(searchTerm: string, page: number,isVerified:number) {
    this.apiService
      .getApi(`/jobs/getJob?globalSearch=${searchTerm}&page=${page}&isVerified=${isVerified}`)
      .subscribe((response: ResponseType<jobData>) => {
        // Handle the response
        if (response) {
          this.jobData = response.data;
          this.jobDetails = this.jobData.postedJobDetails;
          this.totalItems = this.jobData.total;
        }
      });
  }

  // Function to display job description and retrieve applied data
  click(data: jobDescription) {
    this.apiService
      .getApi(`/jobs/getUserAppliedJob?job_id=${data.jobId}`)
      .subscribe((response: ResponseType<appliedData>) => {
        // Handle the response
        if (response) {
          this.appliedData = response.data;
          this.appliedByUser = this.appliedData.getUserAppliedJobByUser;
          this.appliedByFriend = this.appliedData.getUserAppliedJobByFriend;
        }
      });
    this.jobDescription = data;
    const unsafeHtml = this.jobDescription.jobsDescription;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
    this.jobView = false;
    this.descriptionView = true;
  }

  // Function to go back to the job view from job description view
  backToJob() {
    this.jobView = true;
    this.descriptionView = false;
    this.appliedUser = false;
    this.appliedFriend = false;
  }

  // Function to apply for a job
  applyForJob(reference: string, job_id: number) {
    const data = {
      reference: reference,
      job_id: job_id,
    };
    this.apiService
      .postApi('/jobs/applyForJob', data)
      .subscribe((response: ResponseType<string>) => {
        this.status = response.data;
        if (this.status == 'user') {
          if (response.status === 200) {
            this.appliedUser = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully You Applied for this job',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${response.error}`,
            });
          }
        } else {
          if (response.status === 200) {
            this.appliedFriend = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully Applied this job for Your Friend',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `${response.error}`,
            });
          }
        }
      });
  }

  // Function to handle page change event
  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
    this.getJobDetails(this.filterText, this.currentPage,1);
  }
}
