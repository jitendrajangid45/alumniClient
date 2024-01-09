import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/socket/socket.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { UtilService } from 'src/app/utils/util.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-news-room',
  templateUrl: './news-room.component.html',
  styleUrls: ['./news-room.component.scss']
})

export class NewsRoomComponent implements OnInit{
  api:ApiService=inject(ApiService)
  route:ActivatedRoute=inject(ActivatedRoute);
  router:Router=inject(Router)
  data:any;
  news:any[]=[];
  newsId:number;
  newsContent: any;
  showCommentInput: boolean = true;
  showComments: boolean = false;
  newsComments: string = '';
  comments: any = [] ;
  commentsData:any
  data1:any
  comme:any
  commentCountDetails: any;
  newsDetails: any;
  searchText: string;
  page: number
  user:any;
  id:number;
  isLoading: boolean;
  numberOfLikes = 0;
  isLiked = false;
  newsImage: SafeResourceUrl;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private socketService: SocketService, private sanitizer: DomSanitizer,private utils: UtilService) {
    const token=localStorage.getItem('token')
    this.user = JSON.stringify(this.utils.decodeJwtToken(token))
    this.id = JSON.parse(this.user).id 
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const newsId = params['query'];
      this.newsId = newsId;
      this.getNewsById(newsId)
    });

    this.api.getApi( `/news/getAllNews?searchText=${this.searchText}&page=${this.page}`).subscribe((data :any)=> {
      this.data = data;
      this.news = this.data.data.newsData;
      this.newsId = data.data.newsData[0].newsId;
      this.getNewsById(this.newsId)
    });

    this.socketService.getComment().subscribe((comment:any) => {
      this.getNewsById(this.newsId);
      this.comments=comment 
    });

    this.socketService.getLike().subscribe((like:any) => {
      this.comments=like.data
    });

    this.api.getApi(`/news/getNewsComment?newsId=${this.newsId}`).subscribe(data=>{  
      this.data=data['data']
      const comments=this.data; 
    }) 
  }

  loadView(data:string){
    const queryParams={
      query:data
    }
    this.router.navigate(['pages','news-room',],{queryParams})
  }

  getNewsById(newsId:number){
    this.api.getApi(`/news/getNews?newsId=${newsId}`).subscribe((data:any)=>{
    this.data=data;
    this.newsContent = data.news;
    this.newsImage = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://localhost:3000/uploads/newsImage/'+ data.news.newsImage
     );
    })
  }

  toggleCommentInput() {
    if (this.comments.length) {
      this.showCommentInput = !this.showCommentInput;
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
    this.getComments();
  }
  
  getComments(){
    this.api.getApi(`/news/getNewsComment?newsId=${this.newsId}`).subscribe(data=>{
      const comments=data['data']
         this.comments= comments.map((el,i)=> {
        el.profilePic = el.user.profilePic ? this.sanitizer.bypassSecurityTrustResourceUrl(
          environment.profileUrl+`${el.user.profilePic}`
          ) : '../../../assets/profile.png'
        return {
          ...el
        }
      })
    })
  }

  addComment() {
    this.socketService.newsComments({ 'newsId': this.newsId, 'userId': this.id, 'newsComments': this.newsComments });
    // this.getNewsById(this.newsId);
  }

  shareNews() {
    // Implement share functionality here
  }

  back(){
    this.router.navigate(['pages','news-room'])
  }

  h(){    
  }
  likeClick() {
    // Toggle the like status immediately for a responsive UI
    this.isLiked = !this.isLiked;
    
    this.api.postApi('/news/addLike', { newsId: this.newsId }).subscribe(
      (response: { message: string }) => {
        // this.getNewsById(this.newsId);
        // If successfully added the like
        if (response.message === 'Like added successfully') {
          this.numberOfLikes++;
        } else if (response.message === 'Like removed successfully') {
          // If successfully removed the like
          this.numberOfLikes--;
        }
      },
      (error: any) => {
        // If there's an error, revert the like status
        this.isLiked = !this.isLiked;
        // Handle error if needed
        console.error('Error occurred:', error);
      }
    );
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}