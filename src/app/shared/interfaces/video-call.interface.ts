export interface Participant {
  userId: string;
  peerId: string;
  name: string;
  stream?: MediaStream;
  role?: string;
}

export interface ChatMessage {
  userId: string;
  name: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system';
}

export interface RoomInfo {
  roomId: string;
  participants: Participant[];
  status: 'connecting' | 'connected' | 'disconnected';
}

export interface JoinRoomData {
  roomId: string;
  userId: string;
  peerId: string;
  name: string;
  role?: string;
}

export interface UserJoinedData {
  userId: string;
  peerId: string;
  name: string;
  socketId: string;
  roomSize: number;
}

export interface UserLeftData {
  userId: string;
  name?: string;
  roomSize: number;
}
export interface RoomJoinedData {
  otherPeers: { peerId: string; userId: string; name: string }[];
  roomId: string;
}

export interface VideoMessageData {
  userId: string;
  name: string;
  message: string;
  timestamp: string;
}
