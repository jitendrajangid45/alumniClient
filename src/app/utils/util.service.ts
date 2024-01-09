import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { SocketService } from '../socket/socket.service';

type UserTokenType = {
  exp: number;
  iat: number;
  id: {
    accountStatus: string;
    batchYear: string;
    dateOfBirth: null | string; // Can be null or a string
    email: string;
    firstName: string;
    gender: string;
    lastLoginDate: string;
    isVerified:number | boolean;
    lastName: string;
    middleName: string;
    password: string;
    prefix: string;
    profilePic: string;
    registrationDate: string;
    role: string;
  };
  
};
@Injectable({
  providedIn: 'root',
})
export class UtilService {
  router: Router = inject(Router);
  //array of months
  getMonths: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Define the academic streams as an array of objects
  academicStreams: { name: string }[] = [
    {
      name: 'Science',
    },
    {
      name: 'Commerce',
    },
    {
      name: 'Arts',
    },
  ];

  constructor(private socketService: SocketService){}

  //array of years
  getYears(): number[] {
    const startYear = 1990;
    const endYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = startYear; year <= endYear; year++) {
      yearsArray.push(year);
    }
    return yearsArray;
  }
  getExperience() {
    const experienceYear: { label: string; value: number }[] = [];
    for (let i = 0; i <= 50; i++) {
      experienceYear.push({ label: i.toString(), value: i });
    }
    return experienceYear;
  }

  decodeJwtToken(jwt: string) {
    const decoded: UserTokenType = jwt_decode(jwt);
    return decoded.id;
  }

  logout() {
    localStorage.removeItem('token');
    this.socketService.sendlogoutStatus();
    this.router.navigate(['auth', 'login']);
  }

  isLoggedIn() {
    return localStorage.getItem('token');
  }

  populateTimeOptions() {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
    const minutes = [0, 15, 30, 45];
    const times = [];

    // Add AM options first
    for (const hour of hours) {
      for (const minute of minutes) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeOptionAM = `${formattedHour}:${formattedMinute} AM`;
        times.push(timeOptionAM);
      }
    }

    // Add PM options
    for (const hour of hours) {
      for (const minute of minutes) {
        const formattedHour = (hour === 12 ? 12 : hour + 12)
          .toString()
          .padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const timeOptionPM = `${formattedHour}:${formattedMinute} PM`;
        times.push(timeOptionPM);
      }
    }
    return times;
  }
}
