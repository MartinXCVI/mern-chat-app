import type { IAuthUser } from "./IAuthUser";
import type { ISignUpData } from "./ISignUpData";
import type { ILoginData } from "./ILoginData";

export interface IAuthStore {
  authUser: IAuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: ()=> Promise<void>;
  signup: (data: ISignUpData)=> Promise<void>;
  login: (data: ILoginData)=> Promise<void>
  logout: ()=> Promise<void>
}