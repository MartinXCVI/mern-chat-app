import type { Socket } from "socket.io";


export interface IUserSocket extends Socket {
  userId?: string;
  userEmail?: string;
  lastActivity?: Date;
}

export interface ISocketEvents {
  typing: (data: { receiverId: string; isTyping: boolean })=> void;
  disconnect: ()=> void;
}

export interface ITypingData {
  receiverId: string;
  isTyping: boolean;
}

export interface IClientToServerEvents extends ISocketEvents {}

export interface IServerToClientEvents {
  newMessage: (data: any)=> void;
  messageDeleted: (data: { messageId: string })=> void;
  getOnlineUsers: (users: string[])=> void;
  userTyping: (data: { senderId: string; isTyping: boolean })=> void;
  connectionError: (error: string)=> void;
  forceDisconnect: (reason: string)=> void;
}