import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/services/api.service';
import { eventDataAll, eventDetails, userData, userEventDetails } from 'src/app/types/event.type';
import { ResponseType } from 'src/app/types/auth.type';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';


interface MyData {
  id: string;
}
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [MessageService],
})
export class EventsComponent implements OnInit {
  items: MenuItem[] | undefined;
  showDetails: boolean = false;
  eventData: eventDataAll;
  eventDetails: eventDetails[];
  viewMoreDetails: eventDetails;
  public sanitizedHtml: SafeHtml;
  photoURL: SafeResourceUrl;
  goingProfileURL: SafeResourceUrl;
  mayBeProfileURL: SafeResourceUrl;
  declineProfileURL: SafeResourceUrl;
  isUserOnMobile: boolean = false;
  filterText: string;
  tabName: string;
  eventUserData: userEventDetails;
  goingUser: userData[];
  mayBeUser: userData[];
  declineUser: userData[];
  imgGoing: userData[];
  imgMayBe: userData[];
  imgDecline: userData[];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Event',
        icon: 'pi pi-fw pi-briefcase',
        command: () => this.addEvents('Event'),
      },
      {
        label: 'Reunion',
        icon: 'pi pi-fw pi-book',
        command: () => this.addEvents('Reunion'),
      },
      {
        label: 'Webinar',
        icon: 'pi pi-fw pi-book',
        command: () => this.addEvents('Webinar'),
      },
    ];

    this.getAllEvents('', 'Event,Reunion,Webinar');
    this.checkDesktopStatus();
    this.tabName = 'Event,Reunion,Webinar';
  }

  constructor(
    private router: Router,
    private apiService: ApiService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  onTabChange(event: Event) {
    this.tabName =
      event['index'] === 0
        ? 'Event,Reunion,Webinar'
        : event['index'] === 1
        ? 'Reunion'
        : 'Webinar';
    this.getAllEvents('', this.tabName);
  }

  getAllEvents(searchTerm: string, type: string) {
    this.apiService.getApi(`/event/getAllEvents?globalSearch=${searchTerm}&type=${type}`).subscribe((response: ResponseType<eventDataAll>) => {
        // Handle the response
        if (response) {
          this.eventData = response.data;
          this.eventDetails = this.eventData.eventDetails;
        }
      });
  }

  addEvents(type: string) {
    const queryParams = {
      query: type,
    };
    this.router.navigate(['pages', 'events', 'add-event'], { queryParams });
  }

  viewDetails(data: eventDetails) {
    this.showDetails = true;
    this.viewMoreDetails = data;
    const unsafeHtml = this.viewMoreDetails.eventDescription;
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(unsafeHtml);
    this.photoURL = this.sanitizer.bypassSecurityTrustResourceUrl(
     `${environment.eventUrl}${this.viewMoreDetails.eventFilePath}`
    );

    const going = this.viewMoreDetails.join;
    const mayBe = this.viewMoreDetails.mayBe;
    const decline = this.viewMoreDetails.decline;

    const goingUser: MyData[] = (
      Array.isArray(going) ? going : [going]
    ) as MyData[];
    const goingId = goingUser?.map((item: MyData) => item?.id);

    const mayBeUser: MyData[] = (
      Array.isArray(mayBe) ? mayBe : [mayBe]
    ) as MyData[];
    const mayBeId = mayBeUser?.map((item: MyData) => item?.id);

    const declineUser: MyData[] = (
      Array.isArray(decline) ? decline : [decline]
    ) as MyData[];
    const declineId = declineUser?.map((item: MyData) => item?.id);

    this.getUserProfile(goingId, mayBeId, declineId);
  }

  getUserProfile(going, mayBe, decline) {
    this.apiService
      .getApi(
        `/event/getAttendingProfile?going=${going}&mayBe=${mayBe}&decline=${decline}`
      )
      .subscribe((response: ResponseType<userEventDetails>) => {
        // Handle the response
        if (response) {
          this.eventUserData = response.data;
          this.goingUser = this.eventUserData.getGoingUserData;
          this.declineUser = this.eventUserData.getDeclineUserData;
          this.mayBeUser = this.eventUserData.getMaybeUserData;

          if (this.goingUser !== null)
            this.imgGoing = this.goingUser.map((el) => {
              el.profilePic = el.profilePic
                ? this.sanitizer.bypassSecurityTrustResourceUrl(
                    environment.profileUrl + `${el.profilePic}`
                  )
                : '../../../assets/profile.png';
              return {
                ...el,
              };
            });

          if (this.mayBeUser !== null)
            this.imgMayBe = this.mayBeUser.map((el) => {
              el.profilePic = el.profilePic
                ? this.sanitizer.bypassSecurityTrustResourceUrl(
                    environment.profileUrl + `${el.profilePic}`
                  )
                : '../../../assets/profile.png';
              return {
                ...el,
              };
            });

          if (this.declineUser !== null)
            this.imgDecline = this.declineUser.map((el) => {
              el.profilePic = el.profilePic
                ? this.sanitizer.bypassSecurityTrustResourceUrl(
                    environment.profileUrl + `${el.profilePic}`
                  )
                : '../../../assets/profile.png';
              return {
                ...el,
              };
            });
        }
      });
  }

  backTOEvent() {
    this.showDetails = false;
    this.imgGoing = [];
    this.imgMayBe = [];
    this.imgDecline = [];
  }

  updateStatus(type: string, eventId: number) {
    const data = {
      type: type,
      eventId: eventId,
    };

    this.apiService
      .postApi(`/event/updateStatus`, data)
      .subscribe((response: ResponseType<string>) => {
        // Handle the response
        if (response?.status === 200) {
          this.messageService.add({
            severity: `${
              type == 'join' ? 'success' : type == 'mayBe' ? 'warning' : 'error'
            }`,
            summary: `${
              type == 'join' ? 'Success' : type == 'mayBe' ? 'Warning' : 'Error'
            }`,
            detail: ` ${type}`,
          });
              if (this.filterText === undefined) {
                this.filterText = '';
              }
          this.getAllEvents(this.filterText, this.tabName);
        }
      });
  }
  filterData() {
    if (this.tabName === undefined) this.tabName = 'Event,Reunion,Webinar';
    this.getAllEvents(this.filterText, this.tabName);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    // Call the function when the window is resized
    this.checkDesktopStatus();
  }

  private checkDesktopStatus(): void {
    this.isUserOnMobile = window.innerWidth < 520;
  }
}
