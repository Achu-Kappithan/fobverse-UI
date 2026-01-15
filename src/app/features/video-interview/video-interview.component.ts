import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../shared/services/socket/socket.service';
import { PeerService } from '../../shared/services/peer/peer.service';
import { ChatMessage, Participant } from '../../shared/interfaces/video-call.interface';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-video-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-interview.component.html',
  styleUrls: ['./video-interview.component.css']
})
export class VideoInterviewComponent implements OnInit, OnDestroy {
  // Signals (Angular 19)
  participants = signal<Participant[]>([]);
  chatMessages = signal<ChatMessage[]>([]);
  isMicOn = signal(true);
  isCameraOn = signal(true);
  localStream = signal<MediaStream | null>(null);
  isConnecting = signal(true);
  showChat = signal(true);
  newMessage = signal('');
  
  // Computed
  participantCount = computed(() => this.participants().length + 1); // +1 for self
  
  // Component state
  roomId: string = '';
  userId: string = '';
  userName: string = '';
  peerId: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService,
    private peerService: PeerService,
    private authService: AuthService
  ) {
    // Effect to auto-scroll chat
    effect(() => {
      const messages = this.chatMessages();
      if (messages.length > 0) {
        setTimeout(() => this.scrollChatToBottom(), 100);
      }
    });
  }

  async ngOnInit() {
    // Get room ID from route
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';
    
    if (!this.roomId) {
      console.error('[VideoInterview] No room ID provided');
      this.router.navigate(['/']);
      return;
    }

    // Get user info from auth service
    this.userId = this.getUserId();
    this.userName = this.getUserName();

    // Validate user is authenticated
    if (!this.userId || !this.userName) {
      console.error('[VideoInterview] User not authenticated. UserId:', this.userId, 'UserName:', this.userName);
      alert('Please log in to join the video interview.');
      this.router.navigate(['/login']);
      return;
    }

    console.log('[VideoInterview] Joining room:', this.roomId, 'User:', this.userName, 'ID:', this.userId);

    try {
      // 1. Get user media
      const stream = await this.peerService.getUserMedia();
      this.localStream.set(stream);
      this.displayLocalVideo(stream);

      // 2. Initialize peer
      this.peerId = await this.peerService.initializePeer(this.userId);
      console.log('[VideoInterview] Peer ID:', this.peerId);

      // 3. Setup socket listeners
      this.setupSocketListeners();

      // 4. Join room via socket
      this.socketService.joinVideoRoom({
        roomId: this.roomId,
        userId: this.userId,
        peerId: this.peerId,
        name: this.userName,
        role: 'interviewer' // or get from context
      });

      // 5. Setup peer incoming call handler
      this.peerService.incomingCallSubject.subscribe((call) => {
        this.handleIncomingCall(call);
      });

      this.isConnecting.set(false);

    } catch (error) {
      console.error('[VideoInterview] Setup error:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
      this.router.navigate(['/']);
    }
  }

  setupSocketListeners() {
    // When successfully joined room
    this.socketService.onRoomJoined((data) => {
      console.log('[VideoInterview] Room joined:', data);
      
      // Call all existing participants
      if (data.otherPeers && data.otherPeers.length > 0) {
        data.otherPeers.forEach((peer: any) => {
          this.callPeer(peer.peerId, peer.userId, peer.name);
        });
      }

      this.addSystemMessage(`You joined the room`);
    });

    // When another user joins
    this.socketService.onUserJoinedVideo((data) => {
      console.log('[VideoInterview] User joined:', data);
      this.addSystemMessage(`${data.name} joined the room`);
      
      // Call the new user
      if (data.peerId && data.userId !== this.userId) {
        this.callPeer(data.peerId, data.userId, data.name);
      }
    });

    // When user leaves
    this.socketService.onUserLeftVideo((data) => {
      console.log('[VideoInterview] User left:', data);
      this.removeParticipant(data.userId);
      this.addSystemMessage(`${data.name || 'User'} left the room`);
    });

    // Chat messages
    this.socketService.onVideoMessage((data) => {
      console.log('[VideoInterview] Chat message:', data);
      this.chatMessages.update(messages => [...messages, {
        userId: data.userId,
        name: data.name,
        message: data.message,
        timestamp: new Date(data.timestamp),
        type: 'user'
      }]);
    });
  }

  async callPeer(peerId: string, userId: string, name: string) {
    const localStream = this.localStream();
    if (!localStream) return;

    try {
      console.log('[VideoInterview] Calling peer:', peerId, 'Name:', name);
      const remoteStream = await this.peerService.call(peerId, localStream);
      
      this.addOrUpdateParticipant({
        userId,
        peerId,
        name,
        stream: remoteStream
      });

      console.log('[VideoInterview] Successfully connected to:', name);

    } catch (error: any) {
      console.warn('[VideoInterview] Failed to connect to peer:', name, error?.message || error);
      // Don't throw - just log and continue. User might have left or connection failed.
      // This is normal in WebRTC scenarios
    }
  }

  async handleIncomingCall(call: any) {
    const localStream = this.localStream();
    if (!localStream) return;

    try {
      console.log('[VideoInterview] Answering call from:', call.peer);
      const remoteStream = await this.peerService.answer(call, localStream);
      
      // Find participant from our participants list (already added from socket event)
      const existingParticipant = this.participants().find(p => p.peerId === call.peer || p.userId === call.peer);
      
      this.addOrUpdateParticipant({
        userId: existingParticipant?.userId || call.peer,
        peerId: call.peer,
        name: existingParticipant?.name || 'Participant',
        stream: remoteStream
      });

    } catch (error) {
      console.error('[VideoInterview] Error answering call:', error);
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
    setTimeout(() => {
      const videoElement = document.getElementById('local-video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.muted = true; // Mute own audio
      }
    }, 100);
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
      
      // If turning on, update local video display
      if (newState) {
        const stream = this.peerService.getLocalStream();
        if (stream) {
          this.displayLocalVideo(stream);
        }
      }
    } catch (error) {
      console.error('[VideoInterview] Failed to toggle camera:', error);
      // Revert UI state on error
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
    if (confirm('Are you sure you want to leave the call?')) {
      this.socketService.leaveVideoRoom({
        roomId: this.roomId,
        userId: this.userId
      });

      this.peerService.destroy();
      this.router.navigate(['/']); // Navigate back
    }
  }

  ngOnDestroy() {
    this.socketService.leaveVideoRoom({
      roomId: this.roomId,
      userId: this.userId
    });
    this.peerService.destroy();
  }

  // Helper methods - get from auth service
  private getUserId(): string {
    // Try to get from auth service subjects
    let currentUser = this.authService.CompanySubject.value ||
                      this.authService.CandidateSubject.value ||
                      this.authService.adminSubject.value;
    
    // Check for both 'id' and '_id' to be safe
    if (currentUser && (currentUser.id || currentUser._id)) {
      const userId = currentUser.id || currentUser._id || '';
      console.log('[VideoInterview] Got user ID from AuthService:', userId);
      return userId;
    }
    
    // Fallback: Try localStorage (might be set by auth service)
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      console.log('[VideoInterview] Got user ID from localStorage:', storedUserId);
      return storedUserId;
    }
    
    // No user found
    console.error('[VideoInterview] No authenticated user found in AuthService or localStorage');
    return '';
  }

  private getUserName(): string {
    // Try to get from auth service subjects
    let currentUser = this.authService.CompanySubject.value ||
                      this.authService.CandidateSubject.value ||
                      this.authService.adminSubject.value;
    
    if (currentUser && currentUser.name) {
      console.log('[VideoInterview] Got user name from AuthService:', currentUser.name);
      return currentUser.name;
    }
    
    // Fallback: Try localStorage
    const storedUserName = localStorage.getItem('userName') || localStorage.getItem('name');
    if (storedUserName) {
      console.log('[VideoInterview] Got user name from localStorage:', storedUserName);
      return storedUserName;
    }
    
    // No user found
    console.error('[VideoInterview] No authenticated user name found');
    return '';
  }
}
