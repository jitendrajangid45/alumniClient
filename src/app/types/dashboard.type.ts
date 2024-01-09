export interface AlumniCount {
  totalAlumni: number;
  totalFaculty: number;
  totalUnverifiedAlumni: number;
  totalVerifiedAlumni: number;
}

export interface JobBoardCount {
  totalJob: number;
  totalJobSeeker: number;
  totalJobPosted: number;
}

export interface EventDataCount {
  totalEvents: number;
  totalReunion: number;
  totalWebinar: number;
}

export interface PieChartData {
  labels: string[];
  datasets: {
    data: string[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

export interface PieChartOptions {
  plugins?: {
    legend?: {
      labels?: {
        usePointStyle?: boolean;
        color?: string;
      };
    };
  };
}

export interface CollegeDataCount {
    totalCollege:number;
    totalBatch:number;
    totalCourses:number;
}

export interface EventNewsDataCount {
    newsCount:number,
    postCount:number
}

export interface PolarChartData {
  datasets: {
    data: string[];
    backgroundColor: string[];
    label: string;
  }[];
  labels: string[];
}

export interface PolarChartOptions {
  plugins?: {
    legend?: {
      labels?: {
        color?: string;
      };
    };
  };
  scales?: {
    r?: {
      grid?: {
        color?: string;
      };
    };
  };
}