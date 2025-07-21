// Global state
import { create } from "zustand"
// Types/Interfaces imports
import type { IThemeStore } from "../interfaces/IThemeStore"


export const useThemeStore = create<IThemeStore>((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme)
    set({ theme })
  },
}))
