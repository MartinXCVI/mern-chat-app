import 'express'

// Augmenting Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}