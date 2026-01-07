import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  
  private socket!: Socket

  connect(){
    this.socket = io('http://localhost:3007',{
      withCredentials: true
    });

    this.socket.on('connect',()=>{
      console.log('socket connected ', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected from Angular');
    });
  }

  onNotification(callback: (data: any) => void) {

    if (!this.socket) {
      console.log('Socket not initialized');
      return;
    }

    this.socket.on('notification', (payload) => {
      console.log('notification event from socket', payload);
      callback(payload);
    });
  }

  disconnect(){
    if(this.socket){
      this.socket.disconnect()
    }
  }
}
