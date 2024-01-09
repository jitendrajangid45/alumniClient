import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  sendMessage(message) {
    this.socket.emit('message', message);
  }

  messagesent(message){
    this.socket.emit('sentmessage',message);
  }

  onclickMessageSeen(data){
    this.socket.emit('onclickMessageSeen',data);
  }

  getonclickMessageSeen(){
    return this.socket.fromEvent('onclickMessageSeen');
  }
  
  getNotification(){
    return this.socket.fromEvent('getNotification');
  }

  sendNotification(element){
    this.socket.emit('sendNotification',element);
  }

  offline(){
    return this.socket.fromEvent('offline')
  }
  
  imediateFile(data){
    this.socket.emit('imediateFile',data);
  }

  sendStatus(user_id){
    this.socket.emit('sendStatus',user_id);
  }

  getStatus(){
    return this.socket.fromEvent('getStatus');
  }

  sendlogoutStatus(){
    this.socket.emit('sendlogoutStatus');
  }

  getMessage(){
    return this.socket.fromEvent('message');
  }

  sendLikeStatus(isLiked: boolean) {
    this.socket.emit('likeStatus', isLiked);
  }

  newsComments(obj){
    this.socket.emit('newsComments',obj);

  }
  
  getpostFeedComment(){
    return this.socket.fromEvent('postFeedComment');
  }
  
  postFeedComment(data){
    this.socket.emit('postFeedComment',data);
  }

  getComment(){
    return this.socket.fromEvent('newsComments')
  }

  getLike(){
    return this.socket.fromEvent('newsLike')
  }

  sendCommentStatus(comme) {
    this.socket.emit('comme', comme);
  }

}
