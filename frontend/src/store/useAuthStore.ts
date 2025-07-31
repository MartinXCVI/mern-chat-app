// Global state
import { create } from "zustand";
// Types/Interfaces
import type { IAuthStore } from "../interfaces/IAuthStore";
import type { IAuthResponse } from "../interfaces/IAuthResponse";
// Utilities
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

/**
* Zustand Auth Store.
* Handles user authentication state, profile updates, and socket connections.
* @module useAuthStore
*/
export const useAuthStore = create<IAuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  /**
  * Check if the user is authenticated.
  * If authenticated, sets authUser and connects the socket.
  */
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<IAuthResponse>("/auth/is-auth")
      set({ authUser: res.data?.user })
      get().connectSocket()
    } catch(error) {
      console.error(`Error checking user authentication: ${error instanceof Error ? error.message : error}`)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  /**
   * @description Register a new user account.
   * On success, sets authUser, stores token, and connects the socket.
   * @param { ISignUpData } data - New user data
   */
  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post<IAuthResponse>("/auth/signup", data)
      set({ authUser: res.data?.user })
      toast.success("Account succesfully created!")
      get().connectSocket()
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Error on user signup: ${error.message || error}`)
        toast.error(error.message)
      } else {
        console.error(`Error on user sign-up: ${error}`)
        toast.error("Error on user sign-up. Try again later")
      }
    } finally {
      set({ isSigningUp: false })
    }
  },

  /**
  * @description Log in an existing user.
  * On success, sets authUser and connects the socket.
  * @param { ILoginData } data - Login credentials: email, password
  */
  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post<IAuthResponse>("/auth/login", data)
      set({ authUser: res.data?.user })
      toast.success("Logged in successfully")
      get().connectSocket()
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Error on user login: ${error.message || error}`)
        toast.error(error.message)
      } else {
        console.error(`Error on user login: ${error}`)
        toast.error("Error on user login. Try again later")
      }
    } finally {
      set({ isLoggingIn: false })
    }
  },

  /**
  * Log out the current user.
  * Clears authUser and disconnects the socket.
  */
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Error on user logout: ${error.message || error}`)
        toast.error(error.message)
      } else {
        console.error(`Error on user logout: ${error}`)
        toast.error("Error on user logout. Try again later")
      }
    } finally {
      // Clear all user data
      set({ authUser: null, onlineUsers: [] })
      get().disconnectSocket()
      // Clear chat data (lazy import to prevent circular dependency)
      try {
        const { useChatStore } = await import('./useChatStore')
        useChatStore.getState().clearMessages?.()
      } catch (error) {
        console.warn('Could not clear chat messages:', error)
      }
      toast.success("Logged out successfully")
    }
  },

  /**
  * @description Update the user's profile picture
  * @param { IUpdateProfileData } data - Profile picture
  */
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true })
    try {
      const res = await axiosInstance.put("/auth/update-profile", data)

      if(res.data.success && res.data.updatedUser) {
        set({ authUser: res.data.updatedUser })
        toast.success("Profile updated successfully")
      } else {
        toast.error(res.data.message || "Profile update failed")
      }
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Error on profile update: ${error.message || error}`)
        toast.error(error.message)
      } else {
        console.error(`Error on profile update: ${error}`)
        toast.error("Error on profile update. Try again later")
      }
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  /**
  * @description Connects the Socket.IO client using the current user's ID.
  * Handles relevant socket events.
  */
  connectSocket: ()=> {
    const { authUser } = get()

    if(!authUser) {
      console.log("No authenticated user, skipping socket connection")
      return
    }

    // Disconnecting existing socket if it's connected
    const existingSocket = get().socket
    if(existingSocket?.connected) {
      console.log("Disconnecting existing socket...")
      existingSocket?.disconnect()
    }

    console.log(`Connecting socket for user: ${authUser._id}`)

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      path: "/socket.io/",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000
    })

    set({ socket: socket })

    socket.on("connect", () => {
      console.log(`Socket successfully connected with ID: ${socket.id}`)
    })

    socket.on("connect_error", (error) => {
      console.error(`Socket connection error: ${error.message}`)
      toast.error("Connection failed. Please check your internet connection.")
    })

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`)
      // Clearing online users when disconnected
      set({ onlineUsers: [] })
      if(reason === "io server disconnect") {
        // Server disconnected the socket, reconnect manually
        socket.connect()
      }
    })
    // Online users updates
    socket.on("getOnlineUsers", (userIds)=> {
      console.log(`Online users updated: ${userIds?.length || 0} users`)
      set({ onlineUsers: Array.isArray(userIds) ? userIds : [] })
    })

    // Handling server errors and forced disconnections
    socket.on("connectionError", (message) => {
      console.error(`Socket connection error: ${message}`)
      toast.error(`Connection error: ${message}`)
      // If it's an auth error, logout the user
      if(message.includes('authentication') || 
         message.includes('token') || 
         message.includes('Invalid') ||
         message.includes('expired')) {
        console.log("Authentication error detected, logging out...")
        get().logout()
      }
    })

    socket.on("forceDisconnect", (reason) => {
      console.warn(`Forced disconnect: ${reason}`)
      toast.error(`Disconnected: ${reason}`)
      
      if(reason.includes('elsewhere') || reason.includes('another')) {
        toast.error("You've been logged in from another device")
        get().logout()
      } else if(reason.includes('maintenance') || reason.includes('shutdown')) {
        toast("Server is under maintenance. Please try again later.")
      }
    })

    // Ping/pong for connection health check
    socket.on("ping", () => {
      socket.emit("pong")
    })

    // Reconnection events
    socket.on("reconnect", (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`)
      toast.success("Connection restored")
    })

    socket.on("reconnect_failed", () => {
      console.error("Socket reconnection failed")
      toast.error("Unable to restore connection. Please refresh the page.")
    })

    // Debug logging in development
    if(import.meta.env.DEV) {
      socket.onAny((event, ...args) => {
        // Filter out noisy events
        if (!['ping', 'pong', 'getOnlineUsers'].includes(event)) {
          console.log(`Socket event '${event}':`, args)
        }
      })
    }
  }, // End of connectSocket

  /**
  * @description Disconnects the current Socket.IO client and cleans up listeners.
  */
  disconnectSocket: ()=> {
    const socket = get().socket
    if(socket?.connected) {
      console.log("Disconnecting socket...")
      socket?.removeAllListeners()
      socket?.disconnect()
    }
    set({ socket: null, onlineUsers: [] })
  },

})) // End of useAuthStore