import { SafeResourceUrl } from "@angular/platform-browser";

// Interface representing the login request
export interface login{
    email:string;
    password:string;
}

// Interface representing a news item
export interface getNews{
    newsId: number;
    newsContent: string;
    filePath: string;
    createdAt: number;
    user_id: number;
    heading: string;
}

export interface getNewsComment{
    newsId: number,
    user_id: number,
    firstName: string,
    lastName: string,
    profilePic: string,
    newsComment: string,
    newsCommentDate: Date
}

// Interface representing an object with an 'email' property
export interface EmailType{
    email: string;
}

export interface porterType {
    email: string;
    userRole: string;
}
// Interface representing an object with a 'password' property
export interface PasswordType{
    password: string;
}

// Interface representing an object with 'email' and 'otp' properties
export interface VerifyOTPType{
    email: string;
    otp: string;
}

// A union type representing different types for API request bodies
export type PostApiBodyType = EmailType | PasswordType | VerifyOTPType;

// Generic interface for API response
export interface ResponseType<T> {
    status: number;
    data: T | null; // Use a specific type (T) for the data property
    error: string | null | unknown; // Use a specific type (E) for the error property
}

export interface getColleges{
  
    collegeCode:number,
    collegeLogoPath:string|SafeResourceUrl,
    collegeName:string,
    createdAt:number,
    deletedAt:number,
    updatedAt:number,

}

export interface IAlumnus {
    id: number,
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // You might want to use a Date type if applicable
    gender: string;
    profilePic: null | string; // Depending on your needs, profilePic could be a string or null
    isVerified: number;
    accountStatus:string,
    prefix:string,
    password:string,
    resetPasswordToken:string,
    role:string,
    lastLoginDate:Date,
    loginType:string,
    middleName:string,
    registrationDate:Date,
    collage:getColleges,
    batch:BatchData
  }
  
export interface getBatches{
   
batchId:number,
batchName:string,
batchYear:number,
collegeId:number,
courseName:string,
createdAt:Date,
deletedAt:Date,
updatedAt:Date,
colleges:getColleges[]
}

export interface batchDetails{
    collegeId: number,
    collegeName: string,
    collegeCode: number,
    collegeLogoPath:string,
    deletedAt: Date,
    createdAt: Date,
    updatedAt: Date,
    batchId:number,
    batchName:string,
    batchYear:Date,
    userId:number,
    courseName:string;
    batches:BatchData[]
}

interface BatchData {
    batchId: number;
    collegeId: number;
    batchName: string;
    courseName: string;
    batchYear: number;
    // Add other properties if available
  }

export interface courses{
    id:number,
    collegeCode:string,
    courseName:string,
    courseType:string,
    duration:number,
    courseLogoPath:string,
    createdAt:Date,
    updatedAt:Date,
    deletedAt:Date,

}

export interface batches{
    batchId: number,
    collegeId: number,
    batchName: string,
    stream: string,
    batchYear: Date,
    deletedAt: Date,
    createdAt: Date,
    updatedAt:Date,
}

export interface getEducationalDetails{
    eduId:number,
    universityInstitute:string,
    startDate:Date,
    endDate:Date,
    location:string,
    stream:string,
    user_id:number,
    collageName:string,
    programDegree:string
}

export interface getProfessionalDetails{
    workId:number,
    position:string,
    companyName:string,
    isWorking:boolean,
    joiningMonth:string,
    joiningYear:string,
    leavingMonth:string,
    leavingYear:string
}

export interface getOverAllExperience{
      proFId:number,
      overallWorkExperience:number,
      professionalSkills:string,
      industriesWorkIn:string,
      roles:string
}

export interface userDetails{
    detailsId:number,
    homeTown:string,
    address:string,
    location:string,
    postalCode:number,
    mobileNo:number,
    countryCode:number,
    currentCity:string,
    homePhone:number,
    workPhone:number,
    bloodGroup:string,  
    alternateEmail:number,
    websitePortFolioBlog:string,
    facebookProfile:string,
    linkedinProfile:string,
    youtubeChannel:string,
    instagramProfile:string,
    twitterProfile:string,
    relationshipStatus:string,
    aboutMe:string
    
}
export interface user{
        id:number,
        email:string,
        passord:string,
        firstName:string,
        lastName:string,
        middleName:string,
        dateOfBirth:string,
        gender:string,
        isVerified:boolean,
        registrationDate:Date,
        lastLoginDate:Date,
        accountStatus:string,
        batchYear:string,
        role:string,
        prefix:string,
        loginType:string,
        isOnline:boolean,
        resetPasswordToken:string,
        profilePic:string | SafeResourceUrl,
        userDetails:userDetails[]
}
export interface Users{
    id:number,
    email:string,
    passord:string,
    firstName:string,
    lastName:string,
    middleName:string,
    dateOfBirth:string,
    gender:string,
    isVerified:boolean,
    registrationDate:Date,
    lastLoginDate:Date,
    accountStatus:string,
    batchYear:string,
    role:string,
    prefix:string,
    loginType:string,
    isOnline:boolean,
    resetPasswordToken:string,
    profilePic:string | SafeResourceUrl,
}


export interface profileData {
  batch: {
    batchName: string;
  };
  firstName: string;
  lastName: string;
  middleName: string | null;
  profilePic: string;
  workingDetails: {
    position: string;
  };
}
