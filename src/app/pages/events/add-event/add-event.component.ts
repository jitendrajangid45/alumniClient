
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { getColleges,ResponseType } from 'src/app/types/auth.type';
import { EventViewOption } from 'src/app/types/event.type';

interface Batch {
  batchName: string;
}
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  providers: [MessageService],
})
export class AddEventComponent implements OnInit {
  eventType: string;
  isRegister: boolean = false;
  collegeData: getColleges[];
  batchData: Batch[];
  timeValue: string;
  file: File;
  isSelected: boolean = true;
  isCollege: boolean = false;

  addEvents: FormGroup = new FormGroup({
    eventTitle: new FormControl('', [Validators.required]),
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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Consider checking if 'query' exists in params to avoid errors
      const postType = params['query'];
      this.eventType = postType;
    });
    this.getAllCollege();
    this.getAllBatches();
    this.updateValidators();
  }

  eventViewedOptions: EventViewOption[] = [
    { value: 'All', label: 'View to All Alumni' },
    { value: 'Batch', label: 'View to Particular Batch Alumni' },
    { value: 'College', label: 'View to Particular College Alumni' },
  ];

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

  updateValidators() {
    if (this.eventType === 'Webinar') {
      this.addEvents.get('endDate')?.clearValidators();
      this.addEvents.get('eventAddress')?.clearValidators();
      this.addEvents.get('eventVenue')?.clearValidators();
      this.addEvents.get('webinarLink')?.setValidators([Validators.required]);
      this.addEvents.get('endDate')?.setValue(null);
    }
    // Update the form controls' validity
    this.addEvents.get('eventAddress')?.updateValueAndValidity();
    this.addEvents.get('endDate')?.updateValueAndValidity();
    this.addEvents.get('eventVenue')?.updateValueAndValidity();
    this.addEvents.get('webinarLink')?.updateValueAndValidity();
  }

  isRegistration(data: string) {
    if (data === 'yes') {
      this.isRegister = true;
      this.addEvents
        .get('eventRegistrationFee')
        ?.setValidators([Validators.required]);
      this.addEvents
        .get('eventRegistrationCloseDate')
        ?.setValidators([Validators.required]);
    } else {
      this.isRegister = false;
      this.addEvents.get('eventRegistrationFee')?.clearValidators();
      this.addEvents.get('eventRegistrationCloseDate')?.clearValidators();
      this.addEvents.get('eventRegistrationFee')?.setValue('');
      this.addEvents.get('eventRegistrationCloseDate')?.setValue('');
    }

    // Update the form controls' validity
    this.addEvents.get('eventRegistrationFee')?.updateValueAndValidity();
    this.addEvents.get('eventRegistrationCloseDate')?.updateValueAndValidity();
  }

  backToEventBoard() {
    this.router.navigate(['pages', 'events']);
  }

  // Handle file input change
  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
    }
  }

  createEvent() {
    if (this.addEvents.valid) {
      const type = 'event';
      const formValue = { ...this.addEvents.value };
      delete formValue.file;
      delete formValue.isSelectOption;
      formValue.eventType = this.eventType;
      formValue.isVerified = 0;

      const formData = new FormData();
      formData.append('dest', type);
      formData.append('file', this.file);
      formData.append('data', JSON.stringify(formValue));

      this.apiService
        .postApi(`/event/createEvent`, formData)
        .subscribe((response: ResponseType<string>) => {
          if (response) {
            if (response.status === 200) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `${this.eventType} Created SuccessFully!`,
              });
              this.addEvents.reset();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Error Occurred While Creating ${this.eventType}`,
              });
            }
          }
        });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Please fill in all required fields`,
      });
    }
  }

  changeCollegeName(event: getColleges) {
    const college = event?.collegeName;
    this.addEvents.get('collegeOrUniversity').setValue(college);
  }

  changeCollegeNameVisible(event: getColleges) {
    const college = event?.collegeName;
    this.addEvents.get('visibleTo').setValue(college);
  }

  changeBatchNameVisible(event: Batch) {
    const college = event?.batchName;
    this.addEvents.get('visibleTo').setValue(college);
  }

  selectViewedOption(event: EventViewOption) {
    if (event.value === 'All') {
      this.addEvents.get('visibleTo').setValue('All');
      this.isSelected = true;
      this.isCollege = false;
    } else if (event.value === 'Batch') {
      this.addEvents.get('visibleTo').setValue('');
      this.isSelected = false;
      this.isCollege = false;
    } else {
      this.addEvents.get('visibleTo').setValue('');
      this.isSelected = false;
      this.isCollege = true;
    }
  }

  onSelect($event, type: string) {
    // Create a Date object from the event
    const selectedDate = new Date($event);

    // Use DatePipe to format the time in 12-hour format with AM/PM
    const hours = selectedDate.getHours();
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const minutes = selectedDate.getMinutes();
    const formattedMinutes = minutes.toString().padStart(2, '0');

    this.timeValue = `${formattedHours}:${formattedMinutes} ${
      hours >= 12 ? 'PM' : 'AM'
    }`;
    if (type === 'startTime')
      this.addEvents.get('startTime').setValue(this.timeValue);
    if (type === 'endTime')
      this.addEvents.get('endTime').setValue(this.timeValue);
  }
}
