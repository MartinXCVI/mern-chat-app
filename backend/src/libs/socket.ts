import { Server } from 'socket.io'
import http from 'node:http'
import express from 'express'
import { CLIENT_URL } from '../config/env.js'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL],
    credentials: true
  },
  path: "/socket.io/",
  transports: ['websocket', 'polling'],
  allowEIO3: true
})

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId]
}

// For storing online users
const userSocketMap: Record<string, string> = {} // Format: { userId: socketId }

io.on("connection", (socket)=> {
  console.log(`A user connected: ${socket.id}`)

  const rawUserId = socket.handshake.query.userId
  let userId: string | undefined

  if(typeof rawUserId === 'string') {
    userId = rawUserId
  } else if (Array.isArray(rawUserId)) {
    userId = rawUserId[0]
  }  

  if(userId) {
    userSocketMap[userId] = socket.id
    console.log(`User ${userId} mapped to socket ${socket.id}`)
  } else {
    console.info(`Connection missing valid userId — Disconnecting socket ${socket.id}`)
    socket.disconnect(true)
    return
  }
  // For sending events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  socket.on("disconnect", ()=> {
    console.log(`A user disconnected: ${socket.id}`)
    if(userId) {
      delete userSocketMap[userId]
      console.log(`User ${userId} removed from socket map`)
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

export { io, app, server }