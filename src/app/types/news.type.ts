export interface createNews{
    newsId: number,
    userId: number,
    newsContent: string,
    heading: string,
    newsImage: string,
    newsType: string
}

export interface newsType {
    value: string;
    label: string;
  }

export interface getAllNews{
    newsId: number,
    userId: number,
    newsContent: string,
    heading: string,
    newsImage:string,
    newsType: string
}