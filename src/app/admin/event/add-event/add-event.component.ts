import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventTypeOption, EventViewOption } from 'src/app/types/event.type';
import { ResponseType, getColleges } from 'src/app/types/auth.type';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/utils/util.service';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';


interface Batch {
  batchName: string;
}
@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [
    CommonModule,
    EditorModule,
    ReactiveFormsModule,
    ToastModule,
    DropdownModule,
  ],
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  providers: [MessageService],
})
export class AddEventComponent implements OnInit {
  getTimes = this.utilService.populateTimeOptions();
  file: File;
  times: string[] = [];
  cities: string[] = [];
  selectedCity: string = '';
  isRegister: boolean = false;
  isWebinar: boolean = false;
  submitted: boolean = false;
  eventType: string = 'event';
  collegeData: getColleges[];
  batchData: Batch[];
  isSelected: boolean = true;
  isCollege: boolean = false;

  constructor(
    private utilService: UtilService,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.addEvent.get('eventType').valueChanges.subscribe((value) => {
      this.getEventType(value);
    });
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
  changeCollegeName(event: getColleges) {
    const college = event?.collegeName;
    this.addEvent.get('collegeOrUniversity').setValue(college);
  }

  addEvent: FormGroup = new FormGroup({
    eventTitle: new FormControl('', [Validators.required]),
    eventType: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    eventVenue: new FormControl('', [Validators.required]),
    eventAddress: new FormControl('', [Validators.required]),
    webinarLink: new FormControl(''),
    eventRegistrationFee: new FormControl(''),
    isRegistration: new FormControl('', [Validators.required]),
    eventRegistrationCloseDate: new FormControl(''),
    eventDescription: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required]),
    collegeOrUniversity: new FormControl('', [Validators.required]),
    visibleTo: new FormControl('', [Validators.required]),
    isSelectOption: new FormControl('', [Validators.required]),
  });

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

  // Handle file input change
  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
    }
  }

  createEvent() {
    this.submitted = true;
    const type = 'event';
    if (this.addEvent.valid) {
      const formValue = { ...this.addEvent.value };
      delete formValue.file; // Remove the "file" property from the formValue
      delete formValue.isSelectOption;
      formValue.isVerified = 1;

      //Appending the Data in formData
      const formData = new FormData();
      formData.append('dest', type);
      formData.append('file', this.file);
      formData.append('data', JSON.stringify(formValue));

      // Use ApiService to post the job/internship
      this.apiService
        .postApi('/event/createEvent', formData)
        .subscribe((response: ResponseType<string>) => {
          // Handle the response
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${this.eventType} Created SuccessFully!`,
            });
            this.submitted = false;
            this.addEvent.reset();
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

  isRegistration(data: string) {
    if (data === 'yes') {
      this.isRegister = true;
      this.addEvent
        .get('eventRegistrationFee')
        ?.setValidators([Validators.required]);
      this.addEvent
        .get('eventRegistrationCloseDate')
        ?.setValidators([Validators.required]);
    } else {
      this.isRegister = false;
      this.addEvent.get('eventRegistrationFee')?.clearValidators();
      this.addEvent.get('eventRegistrationCloseDate')?.clearValidators();
      this.addEvent.get('eventRegistrationFee')?.setValue('');
      this.addEvent.get('eventRegistrationCloseDate')?.setValue('');
    }

    // Update the form controls' validity
    this.addEvent.get('eventRegistrationFee')?.updateValueAndValidity();
    this.addEvent.get('eventRegistrationCloseDate')?.updateValueAndValidity();
  }

  getEventType(value: string) {
    this.eventType = value;
    if (value === 'Webinar') {
      this.isWebinar = true;
      this.addEvent.get('endDate')?.clearValidators();
      this.addEvent.get('eventAddress')?.clearValidators();
      this.addEvent.get('eventVenue')?.clearValidators();
      this.addEvent.get('webinarLink')?.setValidators([Validators.required]);
      this.addEvent.get('endDate')?.setValue(null);
    } else {
      this.addEvent.get('endDate')?.setValidators([Validators.required]);
      this.addEvent.get('eventAddress')?.setValidators([Validators.required]);
      this.addEvent.get('eventVenue')?.setValidators([Validators.required]);
      this.addEvent.get('webinarLink')?.clearValidators();
      this.isWebinar = false;
    }
    this.addEvent.get('eventAddress')?.updateValueAndValidity();
    this.addEvent.get('endDate')?.updateValueAndValidity();
    this.addEvent.get('eventVenue')?.updateValueAndValidity();
    this.addEvent.get('webinarLink')?.updateValueAndValidity();
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  }

  changeCollegeNameVisible(event: getColleges) {
    const college = event?.collegeName;
    this.addEvent.get('visibleTo').setValue(college);
  }

  changeBatchNameVisible(event: Batch) {
    const college = event?.batchName;
    this.addEvent.get('visibleTo').setValue(college);
  }

  selectViewedOption(event: EventViewOption) {
    if (event.value === 'All') {
      this.addEvent.get('visibleTo').setValue('All');
      this.isSelected = true;
      this.isCollege = false;
    } else if (event.value === 'Batch') {
      this.addEvent.get('visibleTo').setValue('');
      this.isSelected = false;
      this.isCollege = false;
    } else {
      this.addEvent.get('visibleTo').setValue('');
      this.isSelected = false;
      this.isCollege = true;
    }
  }
}
