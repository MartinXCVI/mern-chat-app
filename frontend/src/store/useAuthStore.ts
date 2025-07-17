import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import type { IAuthStore } from "../interfaces/IAuthStore";


export const useAuthStore = create<IAuthStore>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/is-auth")
      set({ authUser: res.data })
    } catch(error) {
      console.error(`Error checking user authentication: ${error instanceof Error ? error.message : error}`)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  }
}))