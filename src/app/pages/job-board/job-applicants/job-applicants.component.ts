import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType } from 'src/app/types/auth.type';
import { JobApplicant, appliedDataByUser,jobAlumniApplied,jobApplicantData,jobAppliedApplicant,jobDescription,jobDetails,jobSeekerDetails, resumeDataByUser,} from 'src/app/types/job.type';

@Component({
  selector: 'app-job-applicants',
  templateUrl: './job-applicants.component.html',
  styleUrls: ['./job-applicants.component.scss'],
  providers: [MessageService],
})
export class JobApplicantsComponent implements OnInit {
  public sanitizedHtml: SafeHtml;
  jobDetails: jobDetails[];
  jobDesc: jobApplicantData;
  jobSeekerDetails: resumeDataByUser[];
  jobSeekerData: jobSeekerDetails;
  jobView: boolean = true;
  applicantView: boolean = false;
  applicantDetails: jobAppliedApplicant;
  applicantData: appliedDataByUser[];
  searchText: string;
  currentPage = 1;
  totalJobCount: number;
  totalJobSeekerCount: number;
  limit = 8;
  filterText: string;
  filterTextSeeker: string;
  filterTextAppliedJob: string;
  job_id: number;
  totalAppliedJobCount: number;
  jobDescription: jobDescription;
  alumniJob: jobAlumniApplied;
  alumniAppliedJobView: boolean = true;
  alumniAppliedDescription: boolean = false;
  appliedJobDescription: JobApplicant;
  totalAlumniJobApplied: number;
  alumniJobData: JobApplicant[];
  filterTextAlumniApplied: string;
  totalAlumniAppliedJobCount: number;
  applicantApplyData: appliedDataByUser;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getPostJobDetails('', 1);
    this.getJobSeekerDetails('', 1);
    this.getAlumniAppliedJob('', 1);
  }

  // Calculate the total number of pages for job details pagination
  get totalPages(): number {
    return Math.ceil(this.totalJobCount / this.limit);
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
    this.getPostJobDetails(this.filterText, this.currentPage);
  }

  // Calculate the total number of pages for job seeker details pagination
  get totalJobSeeker(): number {
    return Math.ceil(this.totalJobSeekerCount / this.limit);
  }

  onPageChangedJobSeeker(newPage: number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
    this.getJobSeekerDetails(this.filterText, this.currentPage);
  }

  // Calculate the total number of pages for applied job details pagination
  get totalAppliedJob(): number {
    return Math.ceil(this.totalAppliedJobCount / this.limit);
  }

  onPageChangedAppliedCandidates(newPage: number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
  }

  // Calculate the total number of pages for applied alumni job pagination
  get totalAlumniAppliedJob(): number {
    return Math.ceil(this.totalAlumniAppliedJobCount / this.limit);
  }

  onPageChangedAlumniApplied(newPage: number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
    this.getAlumniAppliedJob(this.filterText, this.currentPage);
  }

  // Function to get job details
  getPostJobDetails(searchText: string, page: number) {
    this.apiService
      .getApi(`/jobs/getUserJob?searchText=${searchText}&page=${page}`)
      .subscribe((response: ResponseType<jobApplicantData>) => {
        if (response) {
          this.jobDesc = response.data;
          this.jobDetails = this.jobDesc.postedJobDetails;
          this.totalJobCount = this.jobDesc.totalCount;     
        }
      });
  }

  //getting alumni applied job data
  getAlumniAppliedJob(searchText: string, page: number) {
    this.apiService
      .getApi(`/jobs/getAlumniAppliedJob?searchText=${searchText}&page=${page}`)
      .subscribe((response: ResponseType<jobAlumniApplied>) => {

        if (response) {
          this.alumniJob = response.data;
          this.alumniJobData = this.alumniJob.JobApplicant;
          this.totalAlumniAppliedJobCount = this.alumniJob.total; 
        }
      });
  }

  // Function to get job seeker details
  getJobSeekerDetails(searchText: string, page: number) {
    this.apiService
      .getApi(`/jobs/getJobSeeker?searchText=${searchText}&page=${page}`)
      .subscribe((response: ResponseType<jobSeekerDetails>) => {
        if (response) {
          this.jobSeekerData = response.data;
          this.jobSeekerDetails = this.jobSeekerData.jobSeekerData;
          this.totalJobSeekerCount = this.jobSeekerData.total;
        }
      });
  }

  // Function to get applied job details
  getAppliedJobDetails(searchText: string, page: number, job_id: number) {
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

  // Function to view applicants for a job
  viewApplicant(data: jobDescription) {
    this.job_id = data.jobId;
    this.getAppliedJobDetails('', 1, this.job_id);

    this.jobView = false;
    this.applicantView = true;
    this.jobDescription = data;
    const unsafeHtml = this.jobDescription.jobsDescription;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
  }

  // Function to view a resume
  viewResume(status: string, jobApplicantId: number) { 
    if (status === 'applicationSubmitted') {
      this.updateApplicationStatus('applicationViewed' as string, jobApplicantId as number);
    }
  }

  // Function to go back to the job view from applicant view
  backToApplicant() {
    this.jobView = true;
    this.applicantView = false;
    this.alumniAppliedJobView = true;
    this.alumniAppliedDescription = false;
    this.getPostJobDetails('',1);
  }

  // Function to filter job details
  filterData() {
    this.getPostJobDetails(this.filterText, 1);
  }

  // Function to filter job seeker details
  filterDataSeeker() {
    this.getJobSeekerDetails(this.filterTextSeeker, 1);
  }

  // Function to filter applied job details
  filterDataAppliedJob() {
    this.getAppliedJobDetails(this.filterTextAppliedJob, 1, this.job_id);
  }

    // Function to filter alumni applied job details
  filterDataAlumniApplied() {
    this.getAlumniAppliedJob(this.filterTextAlumniApplied, 1);
  }

  //navigate back to job Board
  backToJob() {
    this.router.navigate(['pages', 'job-board']);
  }

  //view applied job status
  viewAlumniJobStatus(data: JobApplicant) { 
    this.appliedJobDescription = data;
    this.alumniAppliedJobView = false;
    this.alumniAppliedDescription = true;
    const unsafeHtml = this.appliedJobDescription?.job?.jobsDescription;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
  }

  //navigate to job applicants
  backToAppliedApplicant() {
    this.jobView = true;
    this.applicantView = false;
    this.alumniAppliedJobView = true;
    this.alumniAppliedDescription = false;
    this.getAlumniAppliedJob('', 1);
  }

  //Updating the application status to shortlist or reject
  applicationStatus(status: string, jobApplicantId: number) { 
    this.updateApplicationStatus(status as string, jobApplicantId as number);
  }

  //updating the application status
  updateApplicationStatus(status: string, jobApplicantId: number) { 
    const data = {
      status: status,
      jobApplicantId: jobApplicantId,
    };
    this.apiService.postApi('/jobs/updateStatus', data).subscribe((response: ResponseType<appliedDataByUser>) => {
        if (response) {
          this.getAppliedJobDetails('', 1, this.job_id);   
        }
      });
  }
}
