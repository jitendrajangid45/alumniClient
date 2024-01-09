import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/socket/socket.service';

@Component({
  selector: 'app-view-news',
  templateUrl: './view-news.component.html',
  styleUrls: ['./view-news.component.scss']
})
export class ViewNewsComponent implements OnInit{
  
  api:ApiService=inject(ApiService);
  route:ActivatedRoute=inject(ActivatedRoute);
  router:Router=inject(Router);
  data:any;
  news:any;
  newsId:number;
  isLiked: boolean=false;
  showCommentInput: boolean = true;
  showComments: boolean = false;
  newsComments: string = '';
  comments: any = [] ;
  data1:any
  comme:any
  commentCountDetails: any;
  newsDetails: any;
  newsContent: any;

  constructor(private socketService: SocketService){}

  ngOnInit(){
    this.route.queryParams.subscribe((params) => {
      const newsId = params['query'];
      this.newsId = newsId;
        this.getNewsById(newsId);
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
    this.comments=this.data 
  }) 
  }

  toggleCommentInput() {
    if (this.comments.length) {
      this.showCommentInput = !this.showCommentInput;
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
    this.api.getApi(`/news/getNewsComment?newsId=${this.newsId}`).subscribe(data=>{
    this.comments=data['data']
      this.showComments = true;
     })
  }
  
  addComment() {
    this.socketService.newsComments({'newsId':this.newsId,'userId':1,'newsComments':this.newsComments});
    this.getNewsById(this.newsId)
  }
  shareNews() {
    // Implement share functionality here
  }

  getNewsById(newsId:number){
    this.api.getApi(`/news/getNews?newsId=${newsId}`).subscribe((data:any)=>{
    this.data=data
    this.newsContent = data.news;
    })
  }

  back(){
    this.router.navigate(['pages','news-room'])
  }

  h(){    
  }
  toggleLike() {
    this.isLiked = !this.isLiked;
    this.api.getApi(`/news/getNews?newsId=${this.newsId}`).subscribe((data:any)=>{
  })
  }
}
