import { Component,ElementRef, ViewChild } from '@angular/core';
import { ResponseType,profileData } from 'src/app/types/auth.type';
import { FormBuilder, Validators } from '@angular/forms';
import { SocketService } from 'src/app/socket/socket.service';
import { ApiService } from '../../services/api.service';
import { UtilService } from 'src/app/utils/util.service';
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from 'rxjs';
import { chatKnownData, userData, searchUser, chatMessages, getMessage, Messages } from 'src/app/types/chat.type';




@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedChat: number | null = null;
  message: string = '';
  chatData: userData[] = [];
  chatKnownData: chatKnownData[] = [];
  userData: userData[] = [];
  chatMessages: Messages[] = [];
  name: string;
  status: boolean;
  user: string;
  sender_id: number;
  receiver_id: number;
  router = inject(Router);
  chat_id: number;
  usermessage: Messages[] = [];
  searchQuery: string = '';
  show: boolean = false;
  profile: string = '';
  profilereceiver: string = '';
  check: boolean = true;
  file:any;
  formData = new FormData();
  newUserData:any=[];
  uData:any=[];
  visible:boolean = false;

  constructor(private socketService: SocketService, private builder: FormBuilder, private api: ApiService, private utils: UtilService) {

    const token = localStorage.getItem('token')
    this.user = JSON.stringify(this.utils.decodeJwtToken(token))
    this.sender_id = JSON.parse(this.user).id     
    this.socketService.sendStatus(this.sender_id)

    this.socketService.getNotification().subscribe(data=>{
      this.newUserData.push(data)
    })
    
    // this.socketService.getMessageSeen().subscribe((data: ResponseType<getMessage>) => {
    //   if(data['receiver_id']== this.receiver_id){
    //   this.chatMessages = data['messages'];
    //   const defaultvalue = data['messages']
    //   defaultvalue[defaultvalue.length-1].delivered = true;
    //   defaultvalue[defaultvalue.length-1].read = true;            
    //   this.chatMessages = defaultvalue;
    //   console.log("lets check unique socket id is working or not")
    //   }
    // })

    this.socketService.getStatus().subscribe(data => {
      this.getKnownUsers();
      this.searchUsers();
    })

    this.socketService.offline().subscribe(user_id=>{
      this.getKnownUsers();
      this.searchUsers();
    })
    
    this.socketService.getonclickMessageSeen().subscribe((data:ResponseType<getMessage>)=>{
      console.log("this.chat_id",this.chat_id);
      console.log("data['chat_id']",data['messages'][0].chat_id);
      if(this.chat_id == data['messages'][0].chat_id){
        this.chatMessages = data['messages'];
      }
      console.log("this.chatMessages=====>>>",this.chatMessages);
      
    })

    this.socketService.getMessage().subscribe((data: ResponseType<getMessage>) => {
      this.usermessage = data['messages'];
      if (this.chat_id == data['messages'][0].chat_id) {
        this.chatMessages = data['messages'];
        if (this.receiver_id == data['messages'][data['messages'].length - 1].sender_id) {
          console.log("coming inside or not");
          this.socketService.onclickMessageSeen(data['messages'][0].chat_id);
        }
      }
      this.getKnownUsers();
      this.searchUsers();
    })


  }

  ngOnInit() {
    this.getProfileData();
  }

  
  getProfileData() {
    this.api.getApi(`/user/getProfileData`).subscribe((response:ResponseType<profileData>) => {
      if (response) {
        if(response.data.profilePic == null){
          this.profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGf_8UZ3xLijdkOtv3qWnUpyknARbKMrcVJA&usqp=CAU';
        }else{
          this.profile =environment.profileUrl+response.data.profilePic;         
        }
      }
    });
  }

  getImageUrl(path){
    if(path.endsWith('/null')){
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGf_8UZ3xLijdkOtv3qWnUpyknARbKMrcVJA&usqp=CAU';
    }else{
      return path;
    }
  }

  getKnownUsers() {
    this.api.getApi(`/chat/getKnownUsers?sender_id=${this.sender_id}`).subscribe((response: Observable<chatKnownData>) => {
      if (response) {
        this.userData = response['data'] 
        this.newUserData = [];
        this.uData = [];
      this.userData.forEach((element)=>{
        this.api.getApi(`/chat/notificationCount?sender_id=${element['id']}&receiver_id=${this.sender_id}&chat_id=${element['chat_id']}`).subscribe((response)=>{
          if(response['id']==this.receiver_id){
            this.newUserData.push(0);
          }else{
            this.newUserData.push(response['notificationcount'])
          }
        })
      })
      this.uData = this.newUserData       
      }
    }
    )
  }

  emojishow() {
    this.show = !this.show;
  }

  truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  searchUsers() {
    this.api.getApi(`/user/getUsers?searchQuery=${this.searchQuery}&sender_id=${this.sender_id}`).subscribe((response: Observable<searchUser>) => {
      if (response) {
        this.chatData = JSON.parse(response['data']);
      }
    });
  }


  getAllUsers(){
    this.api.getApi('/user/getAllUserss').subscribe(data=>{
      this.userData = data['data'];
    })
  }

  fileSelectFunc(){
    this.visible = true;
  }


  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.formData.append('dest', 'sharedFiles');
      this.formData.append('file', this.file);
      this.formData.append('sender_id',String(this.sender_id));
      this.formData.append('receiver_id',String(this.receiver_id));
    }
  }

  userClick(name, profile, receiver_id, status) {
    this.name = name;  
    this.chatMessages = []; 
    this.newUserData = []; 
    if(profile.endsWith('null')){
      this.profilereceiver = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGf_8UZ3xLijdkOtv3qWnUpyknARbKMrcVJA&usqp=CAU';
    }else{
      this.profilereceiver = profile;
    }
    this.receiver_id = receiver_id;
    this.status = status;
    this.check = false;
    this.api.postApi(`/chat/FindChatId`,{'sender_id':this.sender_id,'receiver_id':this.receiver_id}).subscribe(data=>{
      this.chat_id = data['chat_id']
    this.api.postApi(`/chat/Messages`, { 'sender_id': this.sender_id, 'receiver_id': this.receiver_id }).subscribe((response: Observable<chatMessages>) => {
        this.chat_id = response['chat_id'];
        this.chatMessages = response['messages'];      
        this.socketService.messagesent(JSON.stringify(this.chatMessages));   
        this.getKnownUsers();
   
    })
  })
  }

  sendFile(){
    this.visible = false;    
    if(this.formData){   
      this.api.postApi(`/chat/sharedFiles`,this.formData).subscribe(data=>{
        this.socketService.imediateFile({data:data['data']})
        this.fileInput.nativeElement.value = '';
        this.formData = new FormData();

      })
    }
  }

  downloadFile(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }

  isSupportedFile(filePath: string): boolean {
    const lowerCasePath = filePath.toLowerCase();
    return lowerCasePath.endsWith('.pdf') || lowerCasePath.endsWith('.xls') || lowerCasePath.endsWith('.xlsx');
  }

  senddata() {
    this.socketService.sendMessage({ 'sender_id': this.sender_id, 'receiver_id': this.receiver_id, 'message': this.message});
    this.message = '';
    this.show = false;
    this.visible = false;
  }


  addEmoji(event: any): void {
    this.message += event.emoji.native;
    if (this.message == '') { 
      this.message = event.emoji.native;
    } else {
      this.message += event.emoji.native;
    }
  }

  toggleChat(chatIndex: number) {
    this.selectedChat = chatIndex;
  }

}