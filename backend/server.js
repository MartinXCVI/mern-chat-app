import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.routes.js'
import connectDB from './db/connectDB.js'

const app = express()
const PORT = process.env.PORT || 5000
dotenv.config()

/* Middleware for parsing the incoming 
requests with JSON data from req.body */
app.use(express.json())
/* Middleware for parsing the incoming
cookies sent from the client */
app.use(cookieParser())

/* Routes */
app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.listen(PORT, ()=> {
  connectDB()
  console.log(`Server is listening on port ${PORT}...`)
})