/* ENVIRONMENT VARIABLES */
import { PORT_ENV, CLIENT_URL } from './config/env.js'

/* SERVER SETUP */
import express from 'express'
import connectDB from './config/dbConnection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app, server } from './libs/socket.js'

connectDB()


/* MIDDLEWARES */
app.use(express.json({ limit: "5mb" }))
app.use(cookieParser())
app.use(cors({
  origin: [CLIENT_URL],
  credentials: true
}))


/* ROUTES */
import authRouter from './routes/auth.routes.js'
import messageRouter from './routes/message.routes.js'

app.use('/api/auth', authRouter)
app.use('/api/messages', messageRouter)

server.listen(PORT_ENV, ()=> {
  console.log(`Server listening on port ${PORT_ENV}...`)
})