// Global state
import { create } from "zustand";
// Types/Interfaces
import type { IAuthStore } from "../interfaces/IAuthStore";
import type { IAuthResponse } from "../interfaces/IAuthResponse";
// Utilities
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";


export const useAuthStore = create<IAuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get<IAuthResponse>("/auth/is-auth")
      set({ authUser: res.data?.user })
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
      toast.success("Account succesfully created!")
      set({ authUser: res.data?.user })
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
  }
}))