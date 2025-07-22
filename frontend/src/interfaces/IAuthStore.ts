import type { IAuthUser } from "./IAuthUser";
import type { ISignUpData } from "./ISignUpData";
import type { ILoginData } from "./ILoginData";
import type { IUpdateProfileData } from "./IUpdateProfileData";

export interface IAuthStore {
  authUser: IAuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: IAuthUser[],
  isCheckingAuth: boolean;
  checkAuth: ()=> Promise<void>;
  signup: (data: ISignUpData)=> Promise<void>;
  login: (data: ILoginData)=> Promise<void>;
  logout: ()=> Promise<void>;
  updateProfile: (data: IUpdateProfileData) => Promise<void>;
}