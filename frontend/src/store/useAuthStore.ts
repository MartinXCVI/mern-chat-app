// Global state
import { create } from "zustand";
// Types/Interfaces
import type { IAuthStore } from "../interfaces/IAuthStore";
import type { IAuthResponse } from "../interfaces/IAuthResponse";
// Utilities
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


export const useAuthStore = create<IAuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

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

  connectSocket: ()=> {
    const { authUser } = get()

    if(!authUser || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      path: "/socket.io/",
    })

    set({ socket: socket })

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
  },

  disconnectSocket: ()=> {
    if(get().socket?.connected) {
      get().socket?.disconnect()
    }
  }
}))