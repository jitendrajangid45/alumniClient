import { SafeResourceUrl } from "@angular/platform-browser";

export interface EventTypeOption {
  value: string;
  label: string;
}

export type EventViewOption ={
  value: string,
  label: string,
};

export type eventDataSelf = {
  eventDetails: eventDetails[];
  total: number;
};
export interface eventDetails {
    eventId:number
    eventTitle: string ,
    eventType: string ,
    startDate:Date  ,
    endDate: Date ,
    startTime: string ,
    endTime: string ,
    eventVenue:  string,
    eventAddress: string ,
    webinarLink: string,
    eventRegistrationFee:number ,
    isRegistration:  string,
    eventRegistrationCloseDate:Date ,
    eventDescription: string ,
    eventFilePath:  string,
    createdAt:Date,
    updatedAt:Date,
    join:JSON | null,
    mayBe:JSON | null,
    decline:JSON | null,
    collegeOrUniversity:string,
    firstName:string,
    lastName:string
}

export interface eventDataOthers {
  eventDetails: eventDetails[];
  total: number;
}

export type eventDataAll = {
  eventDetails: eventDetails[];
  total: number;
};

export type statisticData = {
  totalJob:number;
  totalJobSeeker:number;
  totalJobApplied:number;
};


export type userEventDetails = {
  getDeclineUserData: userData[];
  getGoingUserData: userData[];
  getMaybeUserData: userData[];
};

export type userData = {
  firstName:string;
  batchName:string;
  profilePic:string | SafeResourceUrl;
};