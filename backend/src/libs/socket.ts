import { Server } from 'socket.io'
import http from 'node:http'
import express from 'express'
import { CLIENT_URL } from '../config/env.js'
import { authenticateSocket } from '../helpers/authenticateSocket.js'
import { IUserSocket, IClientToServerEvents, IServerToClientEvents } from '../interfaces/socketInterfaces.js'
import { validateTypingData } from '../helpers/validateTypingData.js'

/*
* Real-time Socket.IO chat server
* 
* This module implements a websocket server for real-time chat functionalities
* Includes user authentication, activity tracking, typing indicators,
* duplicate connection handling, and graceful shutdown mechanisms.
*/

// Express app and HTTP server setup
const app = express()
const server = http.createServer(app)

/**
* Socket.IO server configuration with CORS, transport options, and connection limits
* 
* @configuration
* - CORS enabled for client URL with credentials
* - WebSocket and polling transports supported
* - 10MB max buffer size for file transfers
* - 5-minute connection timeout
* - 60-second ping timeout with 20-second intervals
*/
const io = new Server<IClientToServerEvents, IServerToClientEvents>(server, {
  cors: {
    origin: [CLIENT_URL],
    credentials: true,
    methods: ['GET', 'POST']
  },
  path: "/socket.io/",
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 20000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 10e6, // 10 mb
  connectTimeout: 300000
})


/**
* User session storage with activity tracking
* Maps userId to socket information and last activity timestamp
* Used for managing online status and cleaning up inactive sessions
*/
const userSocketMap = new Map<string, { socketId: string; lastActivity: Date }>()
/**
* Reverse mapping for quick socket-to-user lookups
* Maps socketId to user information for efficient cleanup operations
*/
const socketUserMap = new Map<string, { userId: string; email: string }>()


/**
* Retrieves the socket ID for a specific user if they are active
* Automatically cleans up inactive users (older than 5 minutes)
* @param { string } userId - ID of the user to find
* @returns { string | undefined } - The socket ID if user is active. Otherwise, undefined
*/
export function getReceiverSocketId(userId: string): string | undefined {
  const userInfo = userSocketMap.get(userId)
  if(!userInfo) return undefined;
  // Check if user is still active (within 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  if(userInfo.lastActivity < fiveMinutesAgo) {
    userSocketMap.delete(userId)
    return undefined
  }
  // Returning socket ID from user's data
  return userInfo.socketId
}

/**
* Gets list of currently active users and performs cleanup
* Removes users who haven't been active in the last 5 minutes
* @returns { string[] } - Array of active users' IDs
* @sideEffect - Removes inactive users from userSocketMap
*/
export function getOnlineUsers(): string[] {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  const activeUsers: string[] = []

  for(const [userId, userInfo] of userSocketMap.entries()) {
    if(userInfo.lastActivity >= fiveMinutesAgo) {
      activeUsers.push(userId);
    } else {
      // Clean up inactive users
      userSocketMap.delete(userId);
    }
  }

  return activeUsers
}

/**
* Global cleanup interval. Runs every minute and automatically
  updates all clients with current online users list
* @interval 60000ms (1 minute)
*/
const globalCleanupInterval = setInterval(() => {
  const activeUsers = getOnlineUsers()
  io.emit('getOnlineUsers', activeUsers)
}, 60000) // Every 1 minute

/**
* Shutdown handler for the socket server for proper
* cleanup of resources and client notification before termination
* @description
* 1. Clears all active intervals
* 2. Notifies all connected clients of shutdown
* 3. Closes server gracefully with timeout fallback
* 4. Forces exit after 5 seconds if graceful close fails
*/
const gracefulShutdown = () => {
  console.log('\nInitiating graceful shutdown of socket server...')
  // Clearing the global cleanup interval
  clearInterval(globalCleanupInterval)
  // Notify all connected clients about the shutdown
  io.emit('forceDisconnect', 'Server shutting down for maintenance')
  // Close the server
  io.close(() => {
    console.log('Socket server closed successfully')
    process.exit(0)
  })
  // Force close after 5 seconds if graceful shutdown fails
  setTimeout(() => {
    console.log('Force closing socket server...')
    process.exit(1)
  }, 5000)
}

/**
* Global process event listeners for graceful shutdown
* Handles system signals and uncaught exceptions
* Registered only once to prevent duplicate handlers
*/
process.on('SIGTERM', gracefulShutdown) // Termination signal
process.on('SIGINT', gracefulShutdown) // Interrupt signal (Ctrl+C)

/**
* Uncaught exception handler
* Logs the error and initiates graceful shutdown to prevent data corruption
*/
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception in socket server:', error)
  gracefulShutdown()
})


/**
* Main socket connection handler with full lifecycle of a WS connection, including:
* - Authentication and authorization
* - Duplicate connection management
* - Event handlers setup
* - Resource cleanup on disconnect
* @event connection
* @param { IUserSocket } socket - The authenticated socket instance
*/
io.on("connection", async (socket: IUserSocket)=> {
  const startTime = Date.now()
  console.log(`Socket connection attempt: ${socket.id} from ${socket.handshake.address}`)
  // Verifying the socket connection using JWT
  const decoded = await authenticateSocket(socket)
  if(!decoded) {
    console.warn(`Unauthorized socket connection: ${socket.id} from ${socket.handshake.address}`)
    socket.emit('connectionError', 'Invalid or expired authentication token')
    socket.disconnect(true)
    return
  }
  // Destructuring user data from the token
  const { userId, email } = decoded

  /**
  * Duplicate connection handling
  * Prevents multiple active connections for the same user
  * Disconnects previous session when new one is established
  */
  const existingConnection = userSocketMap.get(userId)
  if(existingConnection) {
    console.log(`User ${userId} attempting multiple connections. Disconnecting previous session.`)
    const existingSocket = io.sockets.sockets.get(existingConnection.socketId)
    if(existingSocket) {
      existingSocket.emit('forceDisconnect', "New session started elsewhere")
      existingSocket.disconnect(true)
    }
  }
  /**
  * User session initialization
  * Sets up socket properties and mapping storage
  */
  socket.userId = userId
  socket.userEmail = email
  socket.lastActivity = new Date()
  // Store user-to-socket mapping with activity tracking
  userSocketMap.set(userId, {
    socketId: socket.id,
    lastActivity: new Date()
  })
  // Store reverse mapping for efficient cleanup
  socketUserMap.set(socket.id, { userId, email })

  console.log(`User ${userId} (${email}) connected with socket ${socket.id} in ${Date.now() - startTime}ms`);
  // Join user to their personal room for targeted messaging
  socket.join(userId)
  // Broadcasting updated online users
  io.emit("getOnlineUsers", getOnlineUsers())

  /**
  * Heartbeat mechanism that sends periodic ping to detect dead connections
  * Updates activity timestamps to maintain accurate online status 
  * @interval 60000ms (60 seconds)
  */
  const heartbeatInterval = setInterval(() => {
    if(socket.connected) {
      socket.emit('ping')
      // Updating activity timestamp
      socket.lastActivity = new Date()
      const userInfo = userSocketMap.get(userId)
      if(userInfo) {
        userInfo.lastActivity = new Date()
      }
    } else {
      // Cleaning up interval if socket is disconnected
      clearInterval(heartbeatInterval)
    }
  }, 60000) // Every 60 seconds

  /**
  * Typing indicator event handler
  * Manages real-time typing status between users with validation
  * @event typing
  * @param { Object } data - Typing event data
  * @param { string } data.receiverId - ID of user receiving typing indicator
  * @param { boolean } data.isTyping - Whether user is currently typing
  */
  socket.on('typing', (data: { receiverId: string; isTyping: boolean }) => {
    try {
      // Updating user activity/online status based on interaction 
      socket.lastActivity = new Date()
      const userInfo = userSocketMap.get(userId)
      if(userInfo) {
        userInfo.lastActivity = new Date()
      }
      // Validating input data
      if(!validateTypingData(data)) {
        socket.emit('connectionError', 'Invalid typing data format.')
        return
      }
      // Preventing users from sending typing events to themselves
      if(data.receiverId === userId) {
        return
      }
      // Typing indicator to the target user if they're online
      const receiverSocketId = getReceiverSocketId(data.receiverId)
      if(receiverSocketId) {
        socket.to(receiverSocketId).emit('userTyping', {
          senderId: userId,
          isTyping: data.isTyping,
        })
        // Log typing events in development
        if(process.env.NODE_ENV === 'development') {
          console.log(`${userId} is ${data.isTyping ? 'typing to' : 'stopped typing to'} ${data.receiverId}`)
        }
      }
    } catch(error) {
      console.error(`Error handling typing event from user ${userId}: ${error}`)
      socket.emit('connectionError', 'Error processing typing event')
    }
  })

  /**
  * Socket disconnection handler
  * Performs cleanup when user disconnects
  * @event disconnect
  * @param { string } reason - Reason for disconnection
  */
  socket.on("disconnect", (reason)=> {
    console.log(`User ${userId} (${email}) disconnected: ${reason}`)

    // Clearing typing indicators for this user
    // Notifying all connected users that this user stopped typing
    socket.broadcast.emit('userTyping', {
      senderId: userId,
      isTyping: false
    })
    // Clearing the heartbeat interval
    clearInterval(heartbeatInterval)
    // Cleaning up all mappings
    userSocketMap.delete(userId)
    socketUserMap.delete(socket.id)
    // Broadcasting updated online users
    io.emit("getOnlineUsers", getOnlineUsers())
  })

  /**
  * Socket error handler: Logs socket-specific errors for debugging/monitoring
  * @event error
  * @param { Error } error - The socket error object
  */
  socket.on('error', (error) => {
    console.error(`Socket error for user ${userId}: ${error}`)
  })

}) // End of socket connection handling

export { io, app, server }