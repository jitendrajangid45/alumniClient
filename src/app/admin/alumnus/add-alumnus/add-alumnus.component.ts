import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType, batches, getColleges } from 'src/app/types/auth.type';

// Define an interface for key-value pairs
  //object key value pairs type
  interface IObject{
    value:string,
    name:string
  }
@Component({
  selector: 'app-add-alumnus',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './add-alumnus.component.html',
  styleUrls: ['./add-alumnus.component.scss']
})
export class AddAlumnusComponent implements OnInit {
  
  genders: IObject[] = [
    { value: '', name: 'Select Date Of Birth' },
    { value: 'male', name: 'Male' },
    { value: 'female', name: 'Female' },
    { value: 'other', name: 'Other' },
  ];

  // injecting services in component
  apiService:ApiService = inject(ApiService);

  userTypes = ['alumni','faculty_alumni']; 
  selectedCollage:string='';
  selectedBatch:string='';
  collages:getColleges[];
  batches:batches[];
  // Declare a variable to hold the selected file
  selectedFile: File | null = null;
  addAlumni: FormGroup = new FormGroup({
    firstName:new FormControl('',[Validators.required, Validators.pattern('^[A-Za-z]+$')],),
    lastName:new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]+$')],),
    email: new FormControl('', [
      Validators.required,
      Validators.email, // Validates email format.
    ]),
    gender: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('',  [Validators.required]),
    role: new FormControl('',  [Validators.required]),
  });


  ngOnInit() {    
    this.apiService.getApi('/user/getColleges').subscribe((resp:ResponseType<getColleges[]>)=>{
      this.collages=resp.data;
    })

    this.apiService.getApi('/batch/getAllBatches').subscribe((resp:ResponseType<batches[]>)=>{
      this.batches=resp.data;
    })
  }

  // download excel file with formate to add alumni
  downloadExcelForAddAlumni(){
    this.apiService.downloadFile('/alumnus/downloadExcelForAddAlumni').subscribe((resp:Blob)=>{      
      this.downloadFile(resp,'addAlumni');
    })
  }

  // download excel file
  downloadFile(data:Blob,fileName:string){
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =  `${fileName}.xlsx` //'addAlumni.xlsx'; // Set the desired file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // add bulk alumni by uploading excel file
  onFileChange(event){    
    if(!this.selectedCollage || !this.selectedCollage){
      alert('Please Select Collage and Batch')
    }else{
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const alumniDetails = {collage:this.selectedCollage, batch:this.selectedBatch}
        const formData: FormData = new FormData();
        formData.append('file', file as Blob);
        formData.append('alumniDetails', JSON.stringify(alumniDetails));
        this.apiService.downloadFile('/alumnus/uploadExcelForAddAlumni',formData).subscribe((resp)=>{
          this.downloadFile(resp,'updatedStatus');
          alert('Download successful! Here is the status of the uploaded Excel sheet.')
        });
      }
    }
    // Clear the selected file after successful upload
    this.selectedFile = null;
  }

  // save alumni in database with reactive form data
  saveAlumni(){
    if(!this.selectedCollage || !this.selectedCollage){
      alert('Please Select Collage and Batch')
    }else if(!this.addAlumni.valid){
      alert('Please fill all required fields')
    }else{
      const alumniData = this.addAlumni.value
      alumniData.collage = this.selectedCollage;
      alumniData.batch = this.selectedBatch;
      this.apiService.postApi('/alumnus/addAlumni',alumniData).subscribe((resp:ResponseType<string>)=>{
        if(resp.status === 201){
          alert('Alumni added successfully')
        }else if(resp.status === 409) {
          alert('Alumni already exists')
        }else{
          alert('something went wrong')
        }
      })
    }
  }
}
