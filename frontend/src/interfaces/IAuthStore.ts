import type { Socket } from "socket.io-client";
import type { IAuthUser } from "./IAuthUser";
import type { ISignUpData } from "./ISignUpData";
import type { ILoginData } from "./ILoginData";
import type { IUpdateProfileData } from "./IUpdateProfileData";

export interface IAuthStore {
  authUser: IAuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: string[];
  isCheckingAuth: boolean;
  socket: Socket | null;

  checkAuth: ()=> Promise<void>;
  signup: (data: ISignUpData)=> Promise<void>;
  login: (data: ILoginData)=> Promise<void>;
  logout: ()=> Promise<void>;
  updateProfile: (data: IUpdateProfileData) => Promise<void>;

  connectSocket: ()=> void;
  disconnectSocket: ()=> void;
}