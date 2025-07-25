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
   * On success, sets authUser and connects the socket.
   * @param { ISignUpData } data - New user data: success, message, user
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
      set({ authUser: null })
      toast.success("Logged out successfully")
      get().disconnectSocket()
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Error on user logout: ${error.message || error}`)
        toast.error(error.message)
      } else {
        console.error(`Error on user logout: ${error}`)
        toast.error("Error on user logout. Try again later")
      }
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

    if(!authUser) return;

    // Disconnecting existing socket first
    const existingSocket = get().socket
    if(!existingSocket?.connected) {
      existingSocket?.disconnect()
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      path: "/socket.io/",
    })

    set({ socket: socket })

    if(import.meta.env.DEV) { // development only
      socket.on("connect", () => {
        console.log("Socket successfully connected.")
      })

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message)
      })

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason)
      })

      socket.on("getOnlineUsers", (userIds)=> {
        set({ onlineUsers: userIds })
      })
    }
  },

  /**
  * @description Disconnects the current Socket.IO client and cleans up listeners.
  */
  disconnectSocket: ()=> {
    const socket = get().socket
    if(socket?.connected) {
      socket?.removeAllListeners()
      socket?.disconnect()
    }
    set({ socket: null })
  },

})) // End of useAuthStore