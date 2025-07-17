/* ENVIRONMENT VARIABLES */
import { PORT_ENV, CLIENT_URL } from './config/env.js'

/* SERVER SETUP */
import express from 'express'
import connectDB from './config/dbConnection.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
connectDB()

/* MIDDLEWARES */
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))


/* ROUTES */
import authRouter from './routes/auth.routes.js'
import messageRouter from './routes/message.routes.js'

app.use('/api/auth', authRouter)
app.use('/api/message', messageRouter)

app.listen(PORT_ENV, ()=> {
  console.log(`Server listening on port ${PORT_ENV}...`)
})