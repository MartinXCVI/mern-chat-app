import { Request, Response } from "express"


export const signUp = (req: Request, res: Response) => {
  res.send('Sign Up router')
}


export const login = (req: Request, res: Response) => {
  res.send('Login router')
}


export const logout = (req: Request, res: Response) => {
  res.send('Logout router')
}