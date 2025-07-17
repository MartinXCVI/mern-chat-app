import { Router } from 'express'
import { signUp, login, logout, updateProfile, isAuthenticated } from '../controllers/auth.controllers.js'
import { protectRoute } from '../middlewares/protectRoute.js'

// Router setup
const authRouter = Router()

/* GET routes */
// Check if user is authenticated
authRouter.get('/is-auth', protectRoute, isAuthenticated)

/* POST routes */
// Registering a new user
authRouter.post('/signup', signUp)
// Log in an existing user
authRouter.post('/login', login)
// Log out a user
authRouter.post('/logout', logout)

/* PUT routes */
// Updating user profile
authRouter.put('/update-profile', protectRoute, updateProfile)

export default authRouter