import { Router } from 'express'
import { signUp, login, logout } from '../controllers/auth.controllers.js'

// Router setup
const authRouter = Router()

/* POST routes */
// Registering a new user
authRouter.post('/signup', signUp)
// Log in an existing user
authRouter.post('/login', login)
// Log out a user
authRouter.post('/logout', logout)

export default authRouter