import { inject, Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import Peer, { MediaConnection } from 'peerjs';
import { BehaviorSubject, Subject } from 'rxjs';

export interface PeerConnection {
  peerId: string;
  connection: MediaConnection;
  stream?: MediaStream;
}

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  private peer: Peer | null = null;
  private connections = new Map<string, MediaConnection>();
  private localStream: MediaStream | null = null;

  public peerIdSubject = new BehaviorSubject<string | null>(null);
  public incomingCallSubject = new Subject<MediaConnection>();
  public connectionErrorSubject = new Subject<Error>();

  private readonly _logger = inject(LoggerService);


  initializePeer(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(userId, {


          debug: 2,
          config: {
            iceServers: [

              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:stun3.l.google.com:19302' },
              { urls: 'stun:stun4.l.google.com:19302' },


              {
                urls: 'turn:openrelay.metered.ca:80',
                username: 'openrelayproject',
                credential: 'openrelayproject'
              },
              {
                urls: 'turn:openrelay.metered.ca:443',
                username: 'openrelayproject',
                credential: 'openrelayproject'
              },
              {
                urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                username: 'openrelayproject',
                credential: 'openrelayproject'
              }
            ],
            iceTransportPolicy: 'all',
            iceCandidatePoolSize: 10
          }
        });

        this.peer.on('open', (id: string) => {
          this._logger.log('[Peer] Peer initialized with ID:', id);
          this.peerIdSubject.next(id);
          resolve(id);
        });

        this.peer.on('call', (call: MediaConnection) => {
          this._logger.log('[Peer] Incoming call from:', call.peer);
          this.incomingCallSubject.next(call);
        });

        this.peer.on('error', (error: Error) => {
          this._logger.error('[Peer] Error:', error);
          this.connectionErrorSubject.next(error);
          reject(error);
        });

        this.peer.on('disconnected', () => {
          this._logger.log('[Peer] Disconnected');
        });

      } catch (error) {
        this._logger.error('[Peer] Failed to initialize:', error);
        reject(error);
      }
    });
  }


  setLocalStream(stream: MediaStream) {
    this.localStream = stream;
  }


  call(remotePeerId: string, stream: MediaStream): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject(new Error('Peer not initialized'));
        return;
      }

      this._logger.log('[Peer] Calling peer:', remotePeerId);
      const call = this.peer.call(remotePeerId, stream);


      const timeout = setTimeout(() => {
        this._logger.error('[Peer] Connection timeout for:', remotePeerId);
        call.close();
        reject(new Error(`Connection timeout for peer ${remotePeerId}`));
      }, 30000);

      call.on('stream', (remoteStream: MediaStream) => {
        clearTimeout(timeout);
        this._logger.log('[Peer] Received remote stream from:', remotePeerId);
        this.connections.set(remotePeerId, call);
        resolve(remoteStream);
      });

      call.on('close', () => {
        clearTimeout(timeout);
        this._logger.log('[Peer] Call closed with:', remotePeerId);
        this.connections.delete(remotePeerId);
      });

      call.on('error', (error: Error) => {
        clearTimeout(timeout);
        this._logger.error('[Peer] Call error with:', remotePeerId, error);
        this.connections.delete(remotePeerId);
        reject(error);
      });
    });
  }


  answer(call: MediaConnection, stream: MediaStream): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      this._logger.log('[Peer] Answering call from:', call.peer);
      call.answer(stream);

      call.on('stream', (remoteStream: MediaStream) => {
        this._logger.log('[Peer] Received remote stream from:', call.peer);
        this.connections.set(call.peer, call);
        resolve(remoteStream);
      });

      call.on('close', () => {
        this._logger.log('[Peer] Call closed with:', call.peer);
        this.connections.delete(call.peer);
      });

      call.on('error', (error: Error) => {
        this._logger.error('[Peer] Call error:', error);
        reject(error);
      });
    });
  }


  async getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    try {
      const defaultConstraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        constraints || defaultConstraints
      );

      this.setLocalStream(stream);
      return stream;
    } catch (error) {
      this._logger.error('[Peer] getUserMedia error:', error);
      throw error;
    }
  }


  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }


  async toggleVideo(enabled: boolean): Promise<void> {
    if (!this.localStream) return;

    if (!enabled) {

      this.localStream.getVideoTracks().forEach(track => {
        track.stop();
        this.localStream!.removeTrack(track);
      });
    } else {

      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });

        const videoTrack = videoStream.getVideoTracks()[0];
        this.localStream.addTrack(videoTrack);


        this.updateLocalVideo();
      } catch (error) {
        this._logger.error('[Peer] Failed to restart camera:', error);
        throw error;
      }
    }
  }


  private updateLocalVideo() {
    const videoElement = document.getElementById('local-video') as HTMLVideoElement;
    if (videoElement && this.localStream) {
      videoElement.srcObject = this.localStream;
    }
  }


  destroy() {
    this._logger.log('[Peer] Destroying peer and connections');


    this.connections.forEach((connection) => {
      connection.close();
    });
    this.connections.clear();


    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }


    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.peerIdSubject.next(null);
  }


  getPeerId(): string | null {
    return this.peer?.id || null;
  }


  getConnections(): Map<string, MediaConnection> {
    return this.connections;
  }


  getLocalStream(): MediaStream | null {
    return this.localStream;
  }
}
