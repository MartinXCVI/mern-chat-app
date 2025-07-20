import type { IAuthUser } from "./IAuthUser";

export interface IAuthResponse {
  success: boolean;
  message: string;
  user: IAuthUser;
}
