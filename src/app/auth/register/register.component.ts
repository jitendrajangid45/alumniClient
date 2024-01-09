// Import necessary modules and services
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ResponseType, courses, getColleges } from 'src/app/types/auth.type';
import { UtilService } from 'src/app/utils/util.service';

// Define an interface for key-value pairs
  //object key value pairs type
  interface IObject{
    value:string,
    name:string
  }
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

// Declare the Angular component for user registration
export class RegisterComponent implements OnInit {
  // Inject required services into the component
  api: AuthService = inject(AuthService);
  util: UtilService = inject(UtilService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  // Initialize data arrays and form-related properties
  country: IObject[] = [
    { value: '', name: 'Select Country' },
    { value: 'India', name: 'India' },
    { value: 'Bharat', name: 'Bharat' },
  ];

  genders: IObject[] = [
    { value: '', name: 'Select Gender' },
    { value: 'male', name: 'Male' },
    { value: 'female', name: 'Female' },
    { value: 'other', name: 'Other' },
  ];

  // Create form groups and manage form state
  registerForm: FormGroup;
  registerFaculty: FormGroup;
  registerAlumni: FormGroup;
  alumniWorkDetails: FormGroup;

  //boolean properties
  submitted: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;

  //register form redirecting;
  register: boolean = true;
  registerAsUserType: boolean = false;
  workDetails: boolean = false;

  //string properties
  userType: string = 'alumni';

  //getting year and month of list
  getYears: number[] = this.util.getYears();

  // Initialize year and month lists using utility functions
  getMonths: string[] = this.util.getMonths;

  loginType: string;


  // injecting services in component
  apiService:ApiService = inject(ApiService);

  collages:getColleges[];
  courses:courses[];

  streams:{name:string}[]=this.util.academicStreams;
  
  // Constructor for setting up the form groups
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        firstName: [
          '',
          [Validators.required, Validators.pattern('^[A-Za-z]+$')],
        ],
        lastName: [
          '',
          [Validators.required, Validators.pattern('^[A-Za-z]+$')],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required]],
      },
      {
        validator: this.MustMatch('password', 'confirmPassword'),
      }
    );

    // Constructor for setting up the form groups
    this.registerAlumni = new FormGroup({
      collageName: new FormControl('', [Validators.required]),
      programDegree: new FormControl('', [Validators.required]),
      stream: new FormControl('', [Validators.required]),
      endYear: new FormControl('', [Validators.required]),
    });

    this.registerFaculty = new FormGroup({
      jobTitle: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      startYear: new FormControl('', [Validators.required]),
      startMonth: new FormControl('', [Validators.required]),
      endYear: new FormControl('', [Validators.required]),
      endMonth: new FormControl('', [Validators.required]),
      employeeId: new FormControl('', [Validators.required]),
    });

    this.alumniWorkDetails = new FormGroup({
      companyName: new FormControl(''),
      position: new FormControl(''),
      joiningDate: new FormControl(''),
      leavingDate: new FormControl(''),
      overallWorkExperience: new FormControl(null),
      isWorking: new FormControl(false),
      professionalSkills: new FormControl(''),
      industriesWorkIn: new FormControl(''),
      roles: new FormControl(''),
    });
  }

  // Perform actions when the component is initialized
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const loginType = params[')n{N,9K3c6ziba}1w&9U'];
      this.loginType = loginType === 'htjk36V$h5f' ? 'linkedin' : 'normal';
    });

    this.apiService.getApi('/user/getColleges').subscribe((resp:ResponseType<getColleges[]>)=>{
      if(resp.data){
        this.collages=resp.data;
      }
    })
  }

  get f() {
    return this.registerForm.controls;
  }

  //get Courses using collageCode
  onSelectCollage(e:Event){
    const endPointName=`/user/getCollegeCourses?collegeCode=${(e.target as HTMLSelectElement).value}}`
    this.apiService.getApi(endPointName).subscribe((resp:ResponseType<courses[]>)=>{
      if(resp.data){
        this.courses=resp.data;
      }
    })
  }

  // Custom validation function to ensure password matching
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl?.errors && !matchingControl?.errors['mustMatch']) {
        return;
      }

      if (!control?.value || control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ mustMatch: true });
      } else {
        matchingControl?.setErrors(null);
      }
    };
  }

  //redirect from with condition personalDetails registerAsAlumni or faculty and register from.
  redirectToRegistrationForm(register, registerAsUserType, workDetails) {
    this.register = register;
    this.registerAsUserType = registerAsUserType;
    this.workDetails = workDetails;
  }

  // submitting personal information
  submitPersonalDetails() {    
    if (this.registerForm.valid) {
      // redirecting register as alumni or faculty page.
      this.redirectToRegistrationForm(false, true, false);
    } else {
      alert('Please fill all required fields');
    }
  }

  // submitting alumni educational information
  registerAsAlumni() {
    if (this.registerAlumni.valid) {
      // redirecting professional Details page.
      this.redirectToRegistrationForm(false, false, true);
    } else {
      alert('Please fill all required fields');
    }
  }

  // submitting faculty professional information
  registerAsFaculty() {
    if (this.registerFaculty.valid) {
      // redirecting professional Details page.
      this.redirectToRegistrationForm(false, false, true);
    } else {
      alert('Please fill all required fields');
    }
  }

  // submitting faculty professional information
  submitRegistrationForm() {

    // taking alumniOrFacultyInfo as per userType
    let alumniOrFacultyInfo;
    this.userType == 'faculty'
      ? (alumniOrFacultyInfo = this.registerFaculty.value)
      : (alumniOrFacultyInfo = this.registerAlumni.value);

    //setting role in registerForm object
    const registerForm = this.registerForm.value;
    registerForm.email = localStorage.getItem('verify');
    registerForm.role = this.userType;
    registerForm.loginType = this.loginType;

    //a alumniWorkDetails value
    const workDetailOfAlumni = this.alumniWorkDetails.value;
    workDetailOfAlumni.overallWorkExperience = null;

    // using all data making a object
    const register = {
      registerForm,
      alumniOrFacultyInfo,
      alumniWorkDetails: workDetailOfAlumni,
    };

    // register user in data base
    this.api.register(register).subscribe((result: ResponseType<string>) => {
      if (result.status == 201) {
        this.registerForm.reset();
        if (result.data) {
          localStorage.setItem('token', result.data);
          localStorage.removeItem('verify');
          this.router.navigate(['pages','dashboard']);
          alert('register successfully');
        }else{
          localStorage.removeItem('verify');
          this.router.navigate(['auth', 'login']);
          alert('register successfully');
        }
      }else if (result.status == 409){
        alert('User Already Exists');
      } else {
        alert('something went wrong');
      }
    });
  }

  // selecting user type role
  selectRole(role: string) {
    this.userType = role;
  }

  // back to previous register form
  backToThePreviousForm(formType: string) {
    if (formType == 'personal') {
      // redirecting personal Details page.
      this.redirectToRegistrationForm(true, false, false);
    } else if (formType == 'educational') {
      // redirecting educational Details page.
      this.redirectToRegistrationForm(false, true, false);
    }
  }

  // can Deactivate auth guard it is for check if form fields is valid then before redirect of another route ask to user
  canExit() {
    if (this.registerForm.get('firstName').value) {
      return confirm('Are you sure you want to exit');
    } else {
      return true;
    }
  }
}