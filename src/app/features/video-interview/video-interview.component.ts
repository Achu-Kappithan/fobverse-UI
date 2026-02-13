import { Component, OnInit, OnDestroy, signal, computed, effect, ViewChild, ElementRef, inject } from '@angular/core';
import { LoggerService } from '../../shared/services/logger/logger.service';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../shared/services/socket/socket.service';
import { PeerService } from '../../shared/services/peer/peer.service';
import { ChatMessage, Participant, RoomJoinedData, UserJoinedData, UserLeftData, VideoMessageData } from '../../shared/interfaces/video-call.interface';
import { AuthService } from '../auth/services/auth.service';
import { ConfirmService } from '../../shared/services/confirm/confirm.service';
import { MediaConnection } from 'peerjs';

@Component({
  selector: 'app-video-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-interview.component.html',
  styleUrls: ['./video-interview.component.css']
})
export class VideoInterviewComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>;

  participants = signal<Participant[]>([]);
  chatMessages = signal<ChatMessage[]>([]);
  isMicOn = signal(true);
  isCameraOn = signal(true);
  localStream = signal<MediaStream | null>(null);
  isConnecting = signal(true);
  showChat = signal(true);
  newMessage = signal('');

  participantCount = computed(() => this.participants().length + 1);

  roomId = '';
  userId = '';
  userName = '';
  peerId = '';
  private readonly _logger = inject(LoggerService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService,
    private peerService: PeerService,
    private authService: AuthService,
    private confirmService: ConfirmService
  ) {
    effect(() => {
      const messages = this.chatMessages();
      if (messages.length > 0) {
        setTimeout(() => this.scrollChatToBottom(), 100);
      }
    });
  }

  async ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';

    if (!this.roomId) {
      this._logger.error('[VideoInterview] No room ID provided');
      this.router.navigate(['../../'], { relativeTo: this.route });
      return;
    }

    this.userId = this.getUserId();
    this.userName = this.getUserName();

    if (!this.userId || !this.userName) {
      this._logger.error('[VideoInterview] User not authenticated. UserId:', this.userId, 'UserName:', this.userName);
      alert('Please log in to join the video interview.');
      this.router.navigate(['/login']);
      return;
    }

    this._logger.log('[VideoInterview] Joining room:', this.roomId, 'User:', this.userName, 'ID:', this.userId);

    try {
      const stream = await this.peerService.getUserMedia();
      this.localStream.set(stream);

      this.peerId = await this.peerService.initializePeer(this.userId);
      this._logger.log('[VideoInterview] Peer ID:', this.peerId);

      this.setupSocketListeners();

      this.socketService.joinVideoRoom({
        roomId: this.roomId,
        userId: this.userId,
        peerId: this.peerId,
        name: this.userName,
        role: 'interviewer'
      });

      this.peerService.incomingCallSubject.subscribe((call) => {
        this.handleIncomingCall(call);
      });

      this.isConnecting.set(false);

      setTimeout(() => {
        this.displayLocalVideo(stream);
      }, 0);

    } catch (error) {
      this._logger.error('[VideoInterview] Setup error:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  setupSocketListeners() {
    this.socketService.onRoomJoined((data: unknown) => {
      const roomData = data as RoomJoinedData;
      this._logger.log('[VideoInterview] Room joined:', roomData);

      if (roomData.otherPeers && roomData.otherPeers.length > 0) {
        roomData.otherPeers.forEach((peer: { peerId: string; userId: string; name: string }) => {
          this.callPeer(peer.peerId, peer.userId, peer.name);
        });
      }

      this.addSystemMessage(`You joined the room`);
    });

    this.socketService.onUserJoinedVideo((data: unknown) => {
      const userJoinedData = data as UserJoinedData;
      this._logger.log('[VideoInterview] User joined:', userJoinedData);
      this.addSystemMessage(`${userJoinedData.name} joined the room`);

      if (userJoinedData.peerId && userJoinedData.userId !== this.userId) {
        this.callPeer(userJoinedData.peerId, userJoinedData.userId, userJoinedData.name);
      }
    });

    this.socketService.onUserLeftVideo((data: unknown) => {
      const userLeftData = data as UserLeftData;
      this._logger.log('[VideoInterview] User left:', userLeftData);
      this.removeParticipant(userLeftData.userId);
      this.addSystemMessage(`${userLeftData.name || 'User'} left the room`);
    });

    this.socketService.onVideoMessage((data: unknown) => {
      const messageData = data as VideoMessageData;
      this._logger.log('[VideoInterview] Chat message:', messageData);
      this.chatMessages.update(messages => [...messages, {
        userId: messageData.userId,
        name: messageData.name,
        message: messageData.message,
        timestamp: new Date(messageData.timestamp),
        type: 'user'
      }]);
    });
  }

  async callPeer(peerId: string, userId: string, name: string) {
    const localStream = this.localStream();
    if (!localStream) return;

    try {
      this._logger.log('[VideoInterview] Calling peer:', peerId, 'Name:', name);
      const remoteStream = await this.peerService.call(peerId, localStream);

      this.addOrUpdateParticipant({
        userId,
        peerId,
        name,
        stream: remoteStream
      });

      this._logger.log('[VideoInterview] Successfully connected to:', name);

    } catch (error) {
      this._logger.warn('[VideoInterview] Failed to connect to peer:', name, error instanceof Error ? error.message : error);
    }
  }

  async handleIncomingCall(call: MediaConnection) {
    const localStream = this.localStream();
    if (!localStream) return;

    try {
      this._logger.log('[VideoInterview] Answering call from:', call.peer);
      const remoteStream = await this.peerService.answer(call, localStream);

      const existingParticipant = this.participants().find(p => p.peerId === call.peer || p.userId === call.peer);

      this.addOrUpdateParticipant({
        userId: existingParticipant?.userId || call.peer,
        peerId: call.peer,
        name: existingParticipant?.name || 'Participant',
        stream: remoteStream
      });

    } catch (error) {
      this._logger.error('[VideoInterview] Error answering call:', error);
    }
  }

  addOrUpdateParticipant(participant: Participant) {
    this.participants.update(participants => {
      const existing = participants.find(p => p.userId === participant.userId);
      if (existing) {
        return participants.map(p =>
          p.userId === participant.userId ? { ...p, ...participant } : p
        );
      }
      return [...participants, participant];
    });
  }

  removeParticipant(userId: string) {
    this.participants.update(participants =>
      participants.filter(p => p.userId !== userId)
    );
  }

  displayLocalVideo(stream: MediaStream) {
    let videoElement: HTMLVideoElement | null = null;

    if (this.localVideoRef && this.localVideoRef.nativeElement) {
      videoElement = this.localVideoRef.nativeElement;
    } else {
      videoElement = document.getElementById('local-video') as HTMLVideoElement;
    }

    if (videoElement) {
      videoElement.srcObject = stream;
      videoElement.muted = true;
      videoElement.play().catch(e => this._logger.error('[VideoInterview] Error playing local video:', e));
    } else {
      this._logger.warn('[VideoInterview] Local video element not found, retrying...');
      setTimeout(() => {
        const retryElement = document.getElementById('local-video') as HTMLVideoElement;
        if (retryElement) {
            retryElement.srcObject = stream;
            retryElement.muted = true;
            retryElement.play().catch(e => this._logger.error('[VideoInterview] Error playing local video:', e));
        }
      }, 500);
    }
  }

  toggleMic() {
    const newState = !this.isMicOn();
    this.isMicOn.set(newState);
    this.peerService.toggleAudio(newState);
  }

  async toggleCamera() {
    const newState = !this.isCameraOn();

    try {
      await this.peerService.toggleVideo(newState);
      this.isCameraOn.set(newState);

      if (newState) {
        const stream = this.peerService.getLocalStream();
        if (stream) {
          this.displayLocalVideo(stream);
        }
      }
    } catch (error) {
      this._logger.error('[VideoInterview] Failed to toggle camera:', error);
      alert('Failed to toggle camera. Please check permissions.');
    }
  }

  sendMessage() {
    const message = this.newMessage().trim();
    if (!message) return;

    this.socketService.sendVideoMessage({
      roomId: this.roomId,
      userId: this.userId,
      name: this.userName,
      message
    });

    this.newMessage.set('');
  }

  addSystemMessage(message: string) {
    this.chatMessages.update(messages => [...messages, {
      userId: 'system',
      name: 'System',
      message,
      timestamp: new Date(),
      type: 'system'
    }]);
  }

  scrollChatToBottom() {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  toggleChat() {
    this.showChat.update(show => !show);
  }

  async leaveCall() {
    const confirmed = await this.confirmService.confirm({
      title: 'Leave Call?',
      message: 'Are you sure you want to leave?',
      confirmText: 'Yes, leave',
      cancelText: 'Cancel',
      type: 'warning'
    });

    if (confirmed) {
      this.socketService.leaveVideoRoom({
        roomId: this.roomId,
        userId: this.userId
      });

      this.peerService.destroy();
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  ngOnDestroy() {
    this.socketService.leaveVideoRoom({
      roomId: this.roomId,
      userId: this.userId
    });
    this.peerService.destroy();
  }

  private getUserId(): string {
    const currentUser = this.authService.CompanySubject.value ||
                      this.authService.CandidateSubject.value ||
                      this.authService.adminSubject.value;

    if (currentUser && (currentUser.id || currentUser._id)) {
      const userId = currentUser.id || currentUser._id || '';
      this._logger.log('[VideoInterview] Got user ID from AuthService:', userId);
      return userId;
    }

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this._logger.log('[VideoInterview] Got user ID from localStorage:', storedUserId);
      return storedUserId;
    }

    this._logger.error('[VideoInterview] No authenticated user found in AuthService or localStorage');
    return '';
  }

  private getUserName(): string {
    const currentUser = this.authService.CompanySubject.value ||
                      this.authService.CandidateSubject.value ||
                      this.authService.adminSubject.value;

    if (currentUser && currentUser.name) {
      this._logger.log('[VideoInterview] Got user name from AuthService:', currentUser.name);
      return currentUser.name;
    }

    const storedUserName = localStorage.getItem('userName') || localStorage.getItem('name');
    if (storedUserName) {
      this._logger.log('[VideoInterview] Got user name from localStorage:', storedUserName);
      return storedUserName;
    }

    this._logger.error('[VideoInterview] No authenticated user name found');
    return '';
  }
}
