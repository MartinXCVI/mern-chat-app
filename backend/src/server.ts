/* ENVIRONMENT VARIABLES */
import { PORT_ENV } from './config/env.js'

/* SERVER SETUP */
import express from 'express'
import connectDB from './config/dbConnection.js'
import cookieParser from 'cookie-parser'


const app = express()
connectDB()

/* MIDDLEWARES */
app.use(express.json())
app.use(cookieParser())


/* ROUTES */
import authRouter from './routes/auth.routes.js'

app.use('/api/auth', authRouter)


app.listen(PORT_ENV, ()=> {
  console.log(`Server listening on port ${PORT_ENV}...`)
})