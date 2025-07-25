import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../libs/axios'
import type { IChatStore } from '../interfaces/IChatStore'
import type { IAuthUser } from '../interfaces/IAuthUser'
import type { IMessage } from '../interfaces/IMessage'
import { useAuthStore } from './useAuthStore'


/**
* Zustand Chat Store.
* Manages chat users, messages, sending, and real-time socket subscriptions.
* @module useChatStore
*/
export const useChatStore = create<IChatStore>((set, get)=> ({
  messages: [],
  users: [],
  selectedUser: null,
  areUsersLoading: false,
  areMessagesLoading: false,
  messageCleanup: null,

  /**
  * @description Fetch the list of available chat users.
  */
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

  /**
  * Fetch messages for the specified user.
  * @param { string } userId - The ID of the user whose messages to load.
  */
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

  /**
  * @description Send a new message to the selected user.
  * Adds an optimistic message while waiting for server confirmation.
  * @param { INewMessage } messageData - The message content to send.
  */
  sendMessage: async (messageData) => {
    if(!messageData?.text?.trim()) {
      toast.error("Message cannot be empty")
      return
    }

    const { selectedUser } = get()
    const currentUser = useAuthStore.getState().authUser

    if (!selectedUser?._id || !currentUser) {
      toast.error("No recipient selected.");
      return;
    }

    const optimisticMessage: IMessage = {
      _id: `temp-${Date.now()}`,
      text: messageData.text,
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      createdAt: new Date().toISOString(),
      status: "sending"
    }

    set((state)=> ({
      messages: [...state.messages, optimisticMessage]
    }))
    
    try {
      const res = await axiosInstance.post<{ newMessage: IMessage }>(`/messages/send/${selectedUser?._id}`, messageData)

      set((state)=> ({
        messages: state.messages.map(message => {
          return message._id === optimisticMessage._id ? res.data.newMessage : message
        })
      }))
    } catch(error) {
      // Removing optimistic message on failure
      set((state) => ({
        messages: state.messages.filter(message => message._id !== optimisticMessage._id)
      }))
      if(error instanceof Error) {
        console.error(`Error sending message: ${error.message || error}`)
        toast.error(error.message)
      } else {
        console.error(`Error sending message: ${error}`)
        toast.error("Error sending message. Try again later")
      }
    }
  },

  /**
  * @description Subscribe to incoming messages from the server socket.
  * Only listens for messages related to the selected user.
  * Cleans up any previous subscription first.
  * @returns { () => Socket | null } - Cleanup function to unsubscribe.
  */
  subscribeToMessages: () => {
    const { selectedUser } = get()
    if(!selectedUser) return;

    // Cleaning up any existing subscription
    get().unsubscribeFromMessages()

    const socket = useAuthStore.getState().socket
    if(!socket) {
      console.error("User socket state could not be retrieved")
      return
    }

    const currentUserId = useAuthStore.getState().authUser?._id
    
    const handleNewMessage = (newMessage: IMessage) => {
      // Show messages in conversation between current user & selected user
      const isRelevantMessage: boolean =
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === currentUserId) ||
        (newMessage.senderId === currentUserId && newMessage.receiverId === selectedUser._id)

      if(!isRelevantMessage) return;
      
      set((state)=> {
        // Preventing duplicates
        const messageExists = state.messages.some(message => message._id === newMessage._id)
        if (messageExists) return state;

        return {
          messages: [...state.messages, newMessage]
        }
      })
    } // End: handlenewMessage

    socket?.on("newMessage", handleNewMessage)

    const cleanup = ()=> socket?.off("newMessage", handleNewMessage)
    set({ messageCleanup: cleanup })

    return cleanup
  },

  /**
  * @description Unsubscribe from the current message socket listener.
  * Clears the cleanup reference.
  */
  unsubscribeFromMessages: () => {
    const { messageCleanup } = get()

    if(messageCleanup) {
      messageCleanup()
      set({ messageCleanup: null })
    }
  },

  /**
  * Set the active user for the chat.
  * Also unsubscribes from any existing message listener.
  * @param { IAuthUser } user - The user to set as active.
  */
  setSelectedUser: (user) => {
    // Cleaning up existing subscription before switching
    get().unsubscribeFromMessages()
    set({ selectedUser: user })
  },

})) // End of useChatStore