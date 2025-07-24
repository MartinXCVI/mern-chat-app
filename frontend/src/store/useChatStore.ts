import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../libs/axios'
import type { IChatStore } from '../interfaces/IChatStore'
import type { IAuthUser } from '../interfaces/IAuthUser'
import type { IMessage } from '../interfaces/IMessage'
import { useAuthStore } from './useAuthStore'


export const useChatStore = create<IChatStore>((set, get)=> ({
  messages: [],
  users: [],
  selectedUser: null,
  areUsersLoading: false,
  areMessagesLoading: false,

  getUsers: async () => {
    set({ areUsersLoading: true })
    try {
      const res = await axiosInstance.get<{ users: IAuthUser[] }>("/messages/users")
      set({ users: res.data.users })
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Error retrieving users: ${error.message || error}`)
        toast.error(`Error retrieving users: ${error.message}`)
      } else {
        console.error(`Error retrieving users: ${error}`)
        toast.error("Error retrieving users. Try again later")
      }
    } finally {
      set({ areUsersLoading: false })
    }
  },

  getMessages: async (userId) => {
    set({ areMessagesLoading: true })
    try {
      const res = await axiosInstance.get<{ messages: IMessage[] }>(`/messages/${userId}`)
      set({ messages: res.data.messages })
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Error retrieving messages: ${error.message || error}`)
        toast.error(error.message)
      } else {
        console.error(`Error retrieving messages: ${error}`)
        toast.error("Error retrieving messages. Try again later")
      }
    } finally {
      set({ areMessagesLoading: false })
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()

    if (!selectedUser?._id) {
      toast.error("No recipient selected.");
      return;
    }
    
    try {
      const res = await axiosInstance.post<{ newMessage: IMessage }>(`/messages/send/${selectedUser?._id}`, messageData)
      set({ messages: [...messages, res.data.newMessage] })
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Error sending message: ${error.message || error}`)
        toast.error(error.message)
      } else {
        console.error(`Error sending message: ${error}`)
        toast.error("Error sending message. Try again later")
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get()
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket
    
    // Improve later
    socket?.on("newMessage", (newMessage)=> {
      set({ messages: [...get().messages, newMessage] })
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket?.off("newMessage")
  },

  setSelectedUser: (user) => set({ selectedUser: user })
}))