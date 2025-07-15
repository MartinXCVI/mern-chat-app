import { Router } from 'express'
import { signUp, login, logout } from '../controllers/auth.controllers.js'

const authRouter = Router()

/* POST routes */
authRouter.post('/signup', signUp)

authRouter.post('/login', login)

authRouter.post('/logout', logout)

export default authRouter