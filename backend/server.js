// Packages imports
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'node:path'
// Routes imports
import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'
// DB imports
import connectDB from './db/connectDB.js'
// Socket server/app import
import { app, server } from './socket/socket.js'


const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

dotenv.config()

/* Middleware for parsing the incoming 
requests with JSON data from req.body */
app.use(express.json())
/* Middleware for parsing the incoming
cookies sent from the client */
app.use(cookieParser())

app.use(cors({
  origin: "https://mernchatapp.onrender.com", // React dev server
  credentials: true, // Allows cookies to be sent
}))

/* Routes */
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

app.use(express.static(path.join(__dirname, "frontend", "dist")))

app.get("*", (req, res)=> {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})

server.listen(PORT, ()=> {
  connectDB()
  console.log(`Server is listening on port ${PORT}...`)
})