import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ApiService } from 'src/app/services/api.service';
import { AlumniCount, CollegeDataCount, EventDataCount, EventNewsDataCount, JobBoardCount, PieChartData, PieChartOptions, PolarChartData, PolarChartOptions} from 'src/app/types/dashboard.type';
import { ResponseType } from 'src/app/types/auth.type';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pieData: PieChartData;
  pieOptions: PieChartOptions;
  pieEventData: PieChartData;
  pieEventOptions: PieChartOptions;
  alumniCountData: AlumniCount;
  jobBoardCount: JobBoardCount;
  EventDataCount: EventDataCount;
  collegeDataCount: CollegeDataCount;
  postNewsDataCount: EventNewsDataCount;
  polarData: PolarChartData;
  polarOptions: PolarChartOptions;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getAlumniCount();
    this.getJobBoardCount();
    this.getEventsCount();
    this.getCollegeBatchCount();
    this.getPostNewsCount();
  }

  getAlumniCount() {
    this.apiService
      .getApi(`/dashboard/getAlumniCount`)
      .subscribe((response: ResponseType<AlumniCount>) => {
        if (response) {
          this.alumniCountData = response.data;
        }
      });
  }

  getJobBoardCount() {
    this.apiService
      .getApi(`/dashboard/getJobBoardCount`)
      .subscribe((response: ResponseType<JobBoardCount>) => {
        if (response) {
          this.jobBoardCount = response.data;
          this.getJob();
        }
      });
  }

  getEventsCount() {
    this.apiService
      .getApi(`/dashboard/getEventsCount`)
      .subscribe((response: ResponseType<EventDataCount>) => {
        if (response) {
          this.EventDataCount = response.data;
          this.getEvent();
        }
      });
  }

  getCollegeBatchCount() {
    this.apiService
      .getApi(`/dashboard/getCollegeCount`)
      .subscribe((response: ResponseType<CollegeDataCount>) => {
        if (response) {
          this.collegeDataCount = response.data;
        }
      });
  }

  getPostNewsCount() {
    this.apiService
      .getApi(`/dashboard/getPostNewsCount`)
      .subscribe((response: ResponseType<EventNewsDataCount>) => {
        if (response) {
          this.postNewsDataCount = response.data;
          this.getNewsPost();
        }
      });
  }

  getJob() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.pieData = {
      labels: ['Total Jobs', 'Total Job Seeker', 'Job Posted By You'],
      datasets: [
        {
          data: [
            `${this.jobBoardCount?.totalJob}`,
            `${this.jobBoardCount?.totalJobSeeker}`,
            `${this.jobBoardCount?.totalJobPosted}`,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--teal-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--indigo-400'),
            documentStyle.getPropertyValue('--purple-400'),
            documentStyle.getPropertyValue('--teal-400'),
          ],
        },
      ],
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  getEvent() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.pieEventData = {
      labels: ['Total Event', 'Total Reunion', 'Total Webinar'],
      datasets: [
        {
          data: [
            `${this.EventDataCount?.totalEvents}`,
            `${this.EventDataCount?.totalReunion}`,
            `${this.EventDataCount?.totalWebinar}`,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--indigo-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--teal-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--indigo-400'),
            documentStyle.getPropertyValue('--purple-400'),
            documentStyle.getPropertyValue('--teal-400'),
          ],
        },
      ],
    };

    this.pieEventOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  getNewsPost() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.polarData = {
          datasets: [
            {
              data: [
                `${this.postNewsDataCount?.newsCount}`,
                `${this.postNewsDataCount?.postCount}`,
              ],
              backgroundColor: [
                documentStyle.getPropertyValue('--indigo-500'),
                documentStyle.getPropertyValue('--purple-500'),
              ],
              label: '',
            },
          ],
          labels: ['Total News', 'Total Posts'],
        };

        this.polarOptions = {
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            r: {
              grid: {
                color: surfaceBorder,
              },
            },
          },
        };
  }

}
