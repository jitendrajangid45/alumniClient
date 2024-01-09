import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from 'src/app/utils/util.service';
import { EditorModule } from 'primeng/editor';
import { ChipsModule } from 'primeng/chips';
import { FormControl, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType, getColleges } from 'src/app/types/auth.type';
import { MessageService } from 'primeng/api';
import { PaginationModule } from 'src/app/pagination/pagination.module';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { EventTypeOption, EventViewOption } from 'src/app/types/event.type';

interface Batch {
  batchName: string;
}
@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [
    CommonModule,
    EditorModule,
    ChipsModule,
    ReactiveFormsModule,
    PaginationModule,
    DropdownModule,
    ToastModule,
  ],
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss'],
  providers: [MessageService],
})
export class AddJobComponent implements OnInit {
  constructor(
    private utilService: UtilService,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  // Create the form group for adding jobs
  addJob: FormGroup = new FormGroup({
    jobTitle: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    companyWebsite: new FormControl('', [Validators.required]),
    experienceFrom: new FormControl('', [Validators.required]),
    experienceTo: new FormControl('', [Validators.required]),
    jobLocation: new FormControl('', [Validators.required]),
    contactEmail: new FormControl('', [Validators.required, Validators.email]),
    skills: new FormControl('', [Validators.required]),
    salaryPackage: new FormControl('', [Validators.required]),
    salaryStipend: new FormControl('', [Validators.required]),
    applicationDeadline: new FormControl('', [Validators.required]),
    education: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    industryType: new FormControl('', [Validators.required]),
    employmentType: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    jobsDescription: new FormControl('', [Validators.required]),
    file: new FormControl(''),
    visibleTo: new FormControl('', [Validators.required]),
    isSelectOption: new FormControl('', [Validators.required]),
  });
  selectedOption: string;
  file: File;
  submitted: boolean = false;
  collegeData: getColleges[];
  batchData: Batch[];
  isSelected: boolean = true;
  isCollege: boolean = false;

  ngOnInit(): void {
    this.selectOption('job');
    this.getAllCollege();
    this.getAllBatches();
  }

  getAllCollege() {
    this.apiService
      .getApi(`/college/getColleges`)
      .subscribe((response: ResponseType<getColleges[]>) => {
        // Handle the response
        if (response) {
          this.collegeData = response.data;
        }
      });
  }

  eventTypeOptions: EventTypeOption[] = [
    { value: 'Event', label: 'Event' },
    { value: 'Reunion', label: 'Reunion' },
    { value: 'Webinar', label: 'Webinar' },
  ];

  eventViewedOptions: EventViewOption[] = [
    { value: 'All', label: 'View to All Alumni' },
    { value: 'Batch', label: 'View to Particular Batch Alumni' },
    { value: 'College', label: 'View to Particular College Alumni' },
  ];

  getAllBatches() {
    this.apiService
      .getApi(`/batch/getBatchesDropdown`)
      .subscribe((response: ResponseType<Batch[]>) => {
        // Handle the response
        if (response) {
          this.batchData = response.data;
        }
      });
  }

  getExperienceYear = this.utilService.getExperience();

  //seletOption Function to select job or internship type.
  selectOption(option: string) {
    this.selectedOption = option;
    this.addJob.reset();
    this.updateFormValidators(this.selectedOption);
  }

  // A separate function to update form validators based on postType
  private updateFormValidators(type: string) {
    if (type === 'job') {
      this.addJob.get('salaryPackage')?.setValidators([Validators.required]);
      this.addJob.get('salaryStipend')?.clearValidators();
    } else {
      this.addJob.get('salaryStipend')?.setValidators([Validators.required]);
      this.addJob.get('salaryPackage')?.clearValidators();
    }
    // Update the form controls' validity
    this.addJob.get('salaryPackage')?.updateValueAndValidity();
    this.addJob.get('salaryStipend')?.updateValueAndValidity();
  }

  // Handle file input change
  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
    }
  }

  //Post Job and Internship Function
  postJobIntern() {
    this.submitted = true;
    const type = this.selectedOption;

    if (this.addJob.valid) {
      const formValue = { ...this.addJob.value };
      delete formValue.file; // Remove the "file" property from the formValue
      delete formValue.isSelectOption;
      formValue.experienceTo = this.addJob.value.experienceTo.value;
      formValue.experienceFrom = this.addJob.value.experienceFrom.value;
      formValue.isVerified = 1;

      //Appending the Data in formData
      const formData = new FormData();
      formData.append('dest', type);
      formData.append('file', this.file);
      formData.append('data', JSON.stringify(formValue));

      // Use ApiService to post the job/internship
      this.apiService
        .postApi('/jobs/postJob', formData)
        .subscribe((response: ResponseType<string>) => {
          // Handle the response
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Job Posted SuccessFully!',
            });
            this.addJob.reset();
            this.submitted = false;
          }
        });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill Required Fields',
      });
    }
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  }

  changeCollegeNameVisible(event: getColleges) {
    const college = event?.collegeName;
    this.addJob.get('visibleTo').setValue(college);
  }

  changeBatchNameVisible(event: Batch) {
    const college = event?.batchName;
    this.addJob.get('visibleTo').setValue(college);
  }

  selectViewedOption(event: EventViewOption) {
    if (event.value === 'All') {
      this.addJob.get('visibleTo').setValue('All');
      this.isSelected = true;
      this.isCollege = false;
    } else if (event.value === 'Batch') {
      this.addJob.get('visibleTo').setValue('');
      this.isSelected = false;
      this.isCollege = false;
    } else {
      this.addJob.get('visibleTo').setValue('');
      this.isSelected = false;
      this.isCollege = true;
    }
  }
}
