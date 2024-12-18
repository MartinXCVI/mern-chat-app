// Packages imports
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// Routes imports
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
// DB imports
import connectDB from './db/connectDB.js'
// Socket server/app import
import { app, server } from './socket/socket.js'


const PORT = process.env.PORT || 5000
dotenv.config()

/* Middleware for parsing the incoming 
requests with JSON data from req.body */
app.use(express.json())
/* Middleware for parsing the incoming
cookies sent from the client */
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173", // React dev server
  credentials: true, // Allows cookies to be sent
}))

/* Routes */
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

server.listen(PORT, ()=> {
  connectDB()
  console.log(`Server is listening on port ${PORT}...`)
})