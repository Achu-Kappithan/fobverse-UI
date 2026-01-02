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

  disconnect(){
    if(this.socket){
      this.socket.disconnect()
    }
  }
}
