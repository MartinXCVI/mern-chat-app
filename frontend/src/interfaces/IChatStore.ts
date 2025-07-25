import type { Socket } from "socket.io-client";
import type { IAuthUser } from "./IAuthUser";
import type { IMessage } from "./IMessage";
import type { INewMessage } from "./INewMessage";

export interface IChatStore {
  users: IAuthUser[];
  messages: IMessage[];
  selectedUser: IAuthUser | null;
  areUsersLoading: boolean;
  areMessagesLoading: boolean;
  messageCleanup: (() => Socket) | null;

  getUsers: ()=> Promise<void>;
  getMessages: (userId: string)=> Promise<void>;
  sendMessage: (messageData: INewMessage)=> Promise<void>;
  setSelectedUser: (user: IAuthUser | null) => void;

  subscribeToMessages: ()=> void;
  unsubscribeFromMessages: ()=> void;
}