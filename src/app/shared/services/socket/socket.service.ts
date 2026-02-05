import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../../env/environment';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  
  private socket!: Socket

  constructor(private _logger: LoggerService) {}

  connect(){
    this.socket = io(environment.socketUrl,{
      withCredentials: true
    });

    this.socket.on('connect',()=>{
      this._logger.info('socket connected ', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      this._logger.info('Socket disconnected from Angular');
    });
  }

  onNotification(callback: (data: any) => void) {

    if (!this.socket) {
      this._logger.warn('Socket not initialized');
      return;
    }

    this.socket.on('notification', (payload) => {
      this._logger.debug('notification event from socket', payload);
      callback(payload);
    });
  }

  // Video Call Methods
  joinVideoRoom(data: { roomId: string; userId: string; peerId: string; name: string; role?: string }) {
    if (this.socket) {
      this._logger.debug('[Socket] Joining video room:', data);
      this.socket.emit('join-video-room', data);
    }
  }

  leaveVideoRoom(data: { roomId: string; userId: string }) {
    if (this.socket) {
      this._logger.debug('[Socket] Leaving video room:', data);
      this.socket.emit('leave-video-room', data);
    }
  }

  sendVideoMessage(data: { roomId: string; userId: string; name: string; message: string }) {
    if (this.socket) {
      this.socket.emit('video-message', data);
    }
  }

  onRoomJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('room-joined', callback);
    }
  }

  onUserJoinedVideo(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user-joined-video', callback);
    }
  }

  onUserLeftVideo(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user-left-video', callback);
    }
  }

  onVideoMessage(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('video-message', callback);
    }
  }

  disconnect(){
    if(this.socket){
      this.socket.disconnect()
    }
  }

  getSocket(): Socket {
    return this.socket;
  }
}
