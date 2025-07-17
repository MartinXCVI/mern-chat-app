import { Router } from "express"
import { protectRoute } from "../middlewares/protectRoute.js"
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controllers.js"

// Router setup
const messageRouter = Router()

/* GET routes */
messageRouter.get('/users', protectRoute, getUsersForSidebar)
messageRouter.get('/:id', protectRoute, getMessages)

/* POST routes */
messageRouter.post('/send/:id', protectRoute, sendMessage)


export default messageRouter