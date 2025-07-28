export interface IJWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}