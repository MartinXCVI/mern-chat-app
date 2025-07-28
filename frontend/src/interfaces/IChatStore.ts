import type { IAuthUser } from "./IAuthUser";
import type { IMessage } from "./IMessage";
import type { INewMessage } from "./INewMessage";

export interface IChatStore {
  users: IAuthUser[];
  messages: IMessage[];
  selectedUser: IAuthUser | null;
  areUsersLoading: boolean;
  areMessagesLoading: boolean;
  messageCleanup: (() => void) | null;
  typingUsers: Map<string, boolean>

  getUsers: ()=> Promise<void>;
  getMessages: (userId: string)=> Promise<void>;
  sendMessage: (messageData: INewMessage)=> Promise<void>;
  sendTypingIndicator: (isTyping: boolean)=> void
  setSelectedUser: (user: IAuthUser | null)=> void;
  isUserTyping: (userId: string)=> boolean;
  clearMessages: ()=> void ;
  subscribeToMessages: ()=> void;
  unsubscribeFromMessages: ()=> void;
}