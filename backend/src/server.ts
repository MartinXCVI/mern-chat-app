/* ENVIRONMENT VARIABLES */
import { PORT_ENV } from './config/env.js'


/* SERVER SETUP */
import express from 'express'
import connectDB from './config/dbConnection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { app, server } from './libs/socket.js'

connectDB()


/* MIDDLEWARES */
import helmetOptions from './config/helmetOptions.js'
import expressJsonOptions from './config/expressJsonOptions.js'
import corsOptions from './config/corsOptions.js'
import { generalLimiter, authLimiter, uploadLimiter } from './middlewares/rateLimiter.js'

app.use(helmet(helmetOptions))
app.use(express.json(expressJsonOptions))
app.use(cookieParser())
app.use(cors(corsOptions))

/* Applying general rate limiter to all routes */
app.use(generalLimiter)


/* ROUTES */
import authRouter from './routes/auth.routes.js'
import messageRouter from './routes/message.routes.js'

// Applying upload limiter specifically to the profile update route
app.use('/api/auth/update-profile', uploadLimiter)

// Applying specific rate limiters to route groups
app.use('/api/auth', authLimiter, authRouter)
app.use('/api/messages', messageRouter)


/* SERVER LISTENER */
server.listen(PORT_ENV, ()=> {
  console.log(`Server listening on port ${PORT_ENV}...`)
})