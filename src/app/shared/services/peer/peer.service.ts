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

  constructor() {}
  private readonly _logger = inject(LoggerService);

  /**
   * Initialize peer with user ID
   */
  initializePeer(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(userId, {
          // Use default PeerJS cloud server or configure your own
          // For production, consider hosting your own PeerServer
          debug: 2, // Enable debug logs
          config: {
            iceServers: [
              // STUN servers (for discovering public IP)
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:stun3.l.google.com:19302' },
              { urls: 'stun:stun4.l.google.com:19302' },
              // Public TURN servers (for relaying when direct connection fails)
              // Note: For production, use your own TURN server
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
            iceTransportPolicy: 'all', // Try all available methods
            iceCandidatePoolSize: 10 // Pre-gather candidates
          }
        });

        this.peer.on('open', (id) => {
          this._logger.log('[Peer] Peer initialized with ID:', id);
          this.peerIdSubject.next(id);
          resolve(id);
        });

        this.peer.on('call', (call) => {
          this._logger.log('[Peer] Incoming call from:', call.peer);
          this.incomingCallSubject.next(call);
        });

        this.peer.on('error', (error) => {
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

  /**
   * Set local stream (from getUserMedia)
   */
  setLocalStream(stream: MediaStream) {
    this.localStream = stream;
  }

  /**
   * Call another peer
   */
  call(remotePeerId: string, stream: MediaStream): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject(new Error('Peer not initialized'));
        return;
      }

      this._logger.log('[Peer] Calling peer:', remotePeerId);
      const call = this.peer.call(remotePeerId, stream);
      
      // Set timeout for connection (30 seconds)
      const timeout = setTimeout(() => {
        this._logger.error('[Peer] Connection timeout for:', remotePeerId);
        call.close();
        reject(new Error(`Connection timeout for peer ${remotePeerId}`));
      }, 30000);

      call.on('stream', (remoteStream) => {
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

      call.on('error', (error) => {
        clearTimeout(timeout);
        this._logger.error('[Peer] Call error with:', remotePeerId, error);
        this.connections.delete(remotePeerId);
        reject(error);
      });
    });
  }

  /**
   * Answer an incoming call
   */
  answer(call: MediaConnection, stream: MediaStream): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      this._logger.log('[Peer] Answering call from:', call.peer);
      call.answer(stream);

      call.on('stream', (remoteStream) => {
        this._logger.log('[Peer] Received remote stream from:', call.peer);
        this.connections.set(call.peer, call);
        resolve(remoteStream);
      });

      call.on('close', () => {
        this._logger.log('[Peer] Call closed with:', call.peer);
        this.connections.delete(call.peer);
      });

      call.on('error', (error) => {
        this._logger.error('[Peer] Call error:', error);
        reject(error);
      });
    });
  }

  /**
   * Get user media (camera and microphone)
   */
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

  /**
   * Toggle audio track
   */
  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  /**
   * Toggle video track - properly stops/starts camera
   */
  async toggleVideo(enabled: boolean): Promise<void> {
    if (!this.localStream) return;

    if (!enabled) {
      // Stop all video tracks to turn off camera hardware
      this.localStream.getVideoTracks().forEach(track => {
        track.stop();
        this.localStream!.removeTrack(track);
      });
    } else {
      // Restart video track
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

        // Update video element
        this.updateLocalVideo();
      } catch (error) {
        this._logger.error('[Peer] Failed to restart camera:', error);
        throw error;
      }
    }
  }

  /**
   * Helper to update local video element after track changes
   */
  private updateLocalVideo() {
    const videoElement = document.getElementById('local-video') as HTMLVideoElement;
    if (videoElement && this.localStream) {
      videoElement.srcObject = this.localStream;
    }
  }

  /**
   * Destroy all connections and peer instance
   */
  destroy() {
    this._logger.log('[Peer] Destroying peer and connections');
    
    // Close all connections
    this.connections.forEach((connection, peerId) => {
      connection.close();
    });
    this.connections.clear();

    // Stop local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Destroy peer
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.peerIdSubject.next(null);
  }

  /**
   * Get peer ID
   */
  getPeerId(): string | null {
    return this.peer?.id || null;
  }

  /**
   * Get all active connections
   */
  getConnections(): Map<string, MediaConnection> {
    return this.connections;
  }

  /**
   * Get local media stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }
}
