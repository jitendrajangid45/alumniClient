import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/socket/socket.service';
import { ResponseType, user } from 'src/app/types/auth.type';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  api: ApiService = inject(ApiService);
  linkedInToken: any;
  router: Router = inject(Router);
  isCardExpanded: boolean = false;
  discussionText: string = '';
  posts: any[] = [];
  newsList: any[] = [];
  events: any[] = [];
  postForm: FormGroup;
  selectedImageData: SafeResourceUrl | ArrayBuffer | null = null;
  file: File;
  photoURL: SafeResourceUrl;
  image: string;
  profileImg: string;
  selectedImageName: string | ArrayBuffer | null = null;
  comments: { [key: number]: any[] } = {}; // Using an object to store comments for each newsId
  showCommentInput: { [key: number]: boolean } = {}; // For tracking comment input visibility
  showComments: { [key: number]: boolean } = {};
  newComment: string = '';
  newsId: any;
  data: any;
  comme: any;
  // comments: any = [] ;
  commentCountDetails: any;
  newsDetails: any;
  news: any;
  newsContent: any;
  userId: any;
  userDetails: user;
  endpoint: string;
  comment: any;
  postsComments: { [key: number]: any[] } = {};
  newsComments: { [key: number]: any[] } = {};
  eventsComments: any;
  postType:string;
  numberOfLikes=0;
  isLiked=false;
  toggleCardSize() {
    this.isCardExpanded = !this.isCardExpanded;
  }


  constructor(
    private route: ActivatedRoute,
    http: HttpClient,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private socketService: SocketService
  ) {
    this.postForm = new FormGroup({
      content: new FormControl('', [Validators.required]),
      
    });

    this.socketService.getpostFeedComment().subscribe(data=>{
      this.comments[data['id']].push(data);

    })
    
  }
  ngOnInit(): void {
    // this.apiService.getApi(`/user/getUserDetails`).subscribe((details:ResponseType<user>)=>{
    //   this.userDetails=details.data;
    // })
    this.showComments = {};
    this.comments = {};
    this.linkedInToken = this.route.snapshot.queryParams['code'];
    this.getPostData();

    // Fetch comments for posts, news, and events
    this.fetchComments('posts', 'getPostComment');
    this.fetchComments('news', 'getNewsComment');
    this.fetchComments('events', 'getEventComment');

    
    const data = '';

    // this.socketService.getLike().subscribe((like: any) => {
    //   this.comments = like.data;
    // });
    // this.api.getApi(`/news/getNewsComment?newsId=${this.newsId}`).subscribe(data=>{
    //   this.data=data['data']
    //   this.comments=this.data
    // })
  }
  toggleLike() {
    // Toggle the like status immediately for a responsive UI
    this.isLiked = !this.isLiked;

    // Determine the API endpoint based on the content type
    // let endpoint: string;
    // if (type === 'news') {
    //     endpoint = `/news/addLike`;
    // } else if (type === 'post') {
    //     endpoint = `/posts/addLike`;
    // } else if (type === 'event') {
    //     endpoint = `/event/addLike`;
    // }

    // // Send a POST request to add/remove like
    // this.api.postApi(endpoint, { contentId: id }).subscribe(
    //     (response: { message: string }) => {
    //         // If successfully added the like
    //         if (response.message === 'Like added successfully') {
    //             this.numberOfLikes++;
    //         } else if (response.message === 'Like removed successfully') {
    //             // If successfully removed the like
    //             this.numberOfLikes--;
    //         }
    //     },
    //     (error: any) => {
    //         // If there's an error, revert the like status
    //         this.isLiked = !this.isLiked;
    //         // Handle error if needed
    //         console.error('Error occurred:', error);
    //     }
    // );
}


  toggleComments(id: number, type: string) {
    // If comments for this id are not already loaded, fetch them
    
    this.postType=type;
    if (type === 'news') {
      
      this.endpoint = `/news/getNewsComment?${type}Id=${id}`;
    } else if (type === 'post') {
      this.endpoint = `/posts/getPostComment?${type}Id=${id}`;
    } else if (type === 'event') {
       
    this.endpoint = `/event/getEventComment?${type}Id=${id}`;
    }


    this.apiService.getApi(this.endpoint).subscribe((data: any) => {

      this.comments[id] = data['data'];
 
    });

    // Toggle the display of comments
    this.showComments[id] = !this.showComments[id];

  
    

    // If comments are shown, also show the comment input
    if (this.showComments[id]) {
      this.showCommentInput[id] = true;
    }
  }

  fetchComments(type: string, endpoint: string) {
    this.apiService.getApi(`/${type}/getComment`).subscribe((data) => {
      if (type === 'post') {
        this.postsComments = data['data'];
      } else if (type === 'news') {
        this.newsComments = data['data'];
      }
      else if (type === 'event') {
        this.eventsComments = data['data'];
      }
    });
  }

  addComment(id: number, type: string,userId) {
    let endpoint = '';
   
    const commentData={}
    commentData['Id']=id;
    commentData['content']=this.newComment
    commentData['userId']=userId
    if (type === 'news') {
    
      endpoint = `/news/addComment?${type}Id=${id}`;
      // Update newsComments array
      // this.newsComments[id] = [...this.newsComments[id], this.newComment];
    } else if (type === 'post') {
      
      endpoint = `/posts/addPostComment?${type}Id=${id}`;
      // Update postsComments array
      // this.postsComments[id] = [...this.postsComments[id], this.newComment];
      
    }else if (type === 'event') {
      endpoint = `/event/addEventComment?${type}Id=${id}`;
    }
   
    
    if (this.newComment.trim() !== '') {
    // Add the comment to the server
    this.apiService.postApi(endpoint,commentData).subscribe((data) => {
      this.comme = data['data'];

      this.socketService.postFeedComment({type:type,id:id})
     
    });
  }
 // Clear the newComment input field
 this.newComment = '';
}
 

  toggleCommentInput(id: number) {
    if (this.comments[id] && this.comments[id].length) {
      this.showCommentInput[id] = !this.showCommentInput[id];
    }
  }



  private savePost(formData: FormData) {
    this.apiService
      .postApi('/posts/savePosts', formData)
      .subscribe((response: ResponseType<any>) => {
        this.getPostData();

        this.selectedImageData = null;
        this.file = null;
        this.discussionText = '';
      });
  }


  viewFullPost(newsId: string) {
    const queryParams = {
      query: newsId,
    };
    this.router.navigate(['pages', 'news-room',], { queryParams });
  }
  viewEvent() {
    this.router.navigate(['pages', 'events']);
  }

  getPostData() {
    this.apiService.getApi(`/posts/getposts`).subscribe((response: any) => {
      // Handle the response 
      if (response && response.data) {
        this.posts = response.data;
       


        this.posts.forEach((post) => {
          post.photoURL = this.sanitizer.bypassSecurityTrustResourceUrl(
            `${environment.postUrl}${post.postFilePath}`
          );
          post.profilePic = this.sanitizer.bypassSecurityTrustResourceUrl(
            `${environment.profileUrl}${post.user.profilePic}`
          );
        });
      }
    });
  }
  onSubmit() {
    const type = 'post';
    const formData = new FormData();
    formData.append('dest', type);
    formData.append('file', this.file);
    formData.append('content', this.postForm.get('content').value);

    // Save the post to the server
    if (this.postForm.valid) {
      this.apiService
        .postApi('/posts/savePosts', formData)
        .subscribe((response: ResponseType<any>) => {
          // Handle the response if needed
          this.getPostData();
      

          this.selectedImageData = null;
          this.file = null;
          // Reset discussion text
          this.discussionText = '';
        
        });
    }
  }

  load() {
    this.router.navigate(['pages', 'news-room']);
  }

  back() {
    this.router.navigate(['pages', 'events']);
  }
  openFileInput() {
    const fileInput = document.getElementById('picture');
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    // Check if a file is selected
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      // this.selectedImageName = this.file.name;

      // Display the selected image on the discussion card
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImageData = e.target?.result as SafeResourceUrl;
      };
      reader.readAsDataURL(this.file);
    }
  }
  handleFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
    }
  }

  cancelImageSelection() {
    this.file = null;
    this.selectedImageData = null;
    // You may want to reset any other related variables here
  }
}
