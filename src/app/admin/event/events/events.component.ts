import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ApiService } from 'src/app/services/api.service';
import { eventDataOthers, eventDataSelf, eventDetails, userData, userEventDetails } from 'src/app/types/event.type';
import { ResponseType } from 'src/app/types/auth.type';
import { DividerModule } from 'primeng/divider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { AccordionModule } from 'primeng/accordion';
import { PaginationModule } from 'src/app/pagination/pagination.module';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface MyData {
  id: string;
}
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    TagModule,
    DividerModule,
    FormsModule,
    AccordionModule,
    PaginationModule,
    ToastModule
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers:[MessageService]
})
export class EventsComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {}

  eventDescSelf: eventDataSelf;
  eventDetailsSelf: eventDetails[];
  eventDescOthers: eventDataOthers;
  eventDetailsOthers: eventDetails[];
  viewSelfEvent: boolean = false;
  viewSelfEventData: eventDetails;
  photoURL: SafeResourceUrl;
  filterTextSelf: string;
  filterTextOthers: string;
  eventUserData: userEventDetails;
  goingUser: userData[];
  mayBeUser: userData[];
  declineUser: userData[];
  imgGoing: userData[];
  imgMayBe: userData[];
  imgDecline: userData[];
  viewOthersEvent: boolean = false;
  currentPage: number = 1;
  limit = 6;
  totalItems: number;
  totalItemsOthers: number;
  tabIndex: number = 0;

  ngOnInit(): void {
    this.getEventSelf('', 1);
    this.getEventOthers('', 1, 0);
  }
  viewDescription(data: eventDetails) {
    this.viewSelfEvent = true;
    this.viewSelfEventData = data;

    this.photoURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${environment.eventUrl}${this.viewSelfEventData.eventFilePath}`
    );

    const going = this.viewSelfEventData.join;
    const mayBe = this.viewSelfEventData.mayBe;
    const decline = this.viewSelfEventData.decline;

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

  onTabChange(event: Event) {
    this.currentPage = 1;
    if (event['index'] === 0) {
      this.getEventSelf('', 1);
    } else {
      this.getEventOthers('', 1, 0);
    }
  }

  // Calculate the total number of pages for pagination
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.limit);
  }
  // Calculate the total number of pages for pagination
  get totalPagesOthers(): number {
    return Math.ceil(this.totalItemsOthers / this.limit);
  }

  getEventSelf(searchText: string, page: number) {
    this.apiService
      .getApi(`/event/getSelfEvent?searchText=${searchText}&page=${page}`)
      .subscribe((response: ResponseType<eventDataSelf>) => {
        if (response) {
          this.eventDescSelf = response.data;
          this.eventDetailsSelf = this.eventDescSelf.eventDetails;
          this.totalItems = this.eventDescSelf.total;
        }
      });
  }

  getEventOthers(searchText: string, page: number, isVerified: number) {
    this.apiService
      .getApi(
        `/event/getOthersEvent?searchText=${searchText}&page=${page}&isVerified=${isVerified}`
      )
      .subscribe((response: ResponseType<eventDataOthers>) => {
        if (response) {
          this.eventDescOthers = response.data;
          this.eventDetailsOthers = this.eventDescOthers.eventDetails;
          this.totalItemsOthers = this.eventDescOthers.total;
        }
      });
  }

  backToEvent() {
    this.viewSelfEvent = false;
    this.imgDecline = [];
    this.imgGoing = [];
    this.imgMayBe = [];
  }

  filterData() {
    this.getEventSelf(this.filterTextSelf, this.currentPage);
  }

  filterDataOthers() {
    this.getEventOthers(this.filterTextOthers, this.currentPage, this.tabIndex);
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
          this.goingUser = this.eventUserData?.getGoingUserData;
          this.declineUser = this.eventUserData?.getDeclineUserData;
          this.mayBeUser = this.eventUserData?.getMaybeUserData;

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

  // Function to handle page change event
  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    if (this.filterTextSelf === undefined) {
      this.filterTextSelf = '';
    }
    this.getEventSelf(this.filterTextSelf, this.currentPage);
  }

  // Function to handle page change event
  onPageChangedOthers(newPage: number) {
    this.currentPage = newPage;
    if (this.filterTextSelf === undefined) {
      this.filterTextSelf = '';
    }
    this.getEventOthers(this.filterTextSelf, this.currentPage, this.tabIndex);
  }

  verifiedUnverified(event: Event) {
    this.currentPage = 1;
    this.tabIndex = event['index'];
    if (event['index'] === 0) {
      this.getEventOthers('', this.currentPage, 0);
    } else {
      this.getEventOthers('', this.currentPage, 1);
    }
  }

  verifyEvent(eventId: number) {

    this.apiService
      .postApi(`/event/verifyEvent`, { eventId })
      .subscribe((response: ResponseType<string>) => {
        if (response.status === 200) {
          if (this.filterTextOthers === undefined) {
            this.filterTextOthers = '';
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${response.data}`,
          });
          this.getEventOthers(this.filterTextOthers, this.currentPage, 0);
        }
      });
  }
}
