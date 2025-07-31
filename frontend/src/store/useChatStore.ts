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
  typingUsers: new Map(),

  
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
  * Uses HTTP for persistence and socket for real-time delivery.
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
    const socket = useAuthStore.getState().socket

    if (!selectedUser?._id || !currentUser) {
      toast.error("No recipient selected.")
      return
    }

    if(!socket?.connected) {
      toast.error("Connection lost. Please refresh the page.")
      return
    }

    const optimisticMessage: IMessage = {
      _id: `temp-${Date.now()}`,
      text: messageData.text,
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      createdAt: new Date().toISOString(),
      status: "sending"
    }

    // Adding optimistic message to UI immediately
    set((state)=> ({
      messages: [...state.messages, optimisticMessage]
    }))
    
    try {
      // Sending via HTTP for persistence
      const res = await axiosInstance.post<{ newMessage: IMessage }>(`/messages/send/${selectedUser?._id}`, messageData)
      // Updating optimistic message with real data
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
  * @description Send typing indicator to the selected user.
  * @param { boolean } isTyping - Whether the user is currently typing
  */
  sendTypingIndicator: (isTyping: boolean)=> {
    const { selectedUser } = get()
    const socket = useAuthStore.getState().socket

    if(!selectedUser?._id || !socket?.connected) return;

    socket.emit('typing', {
      receiverId: selectedUser._id,
      isTyping
    })
  },


  /**
  * @description Subscribe to real-time socket events for the current conversation.
  * Handles incoming messages, typing indicators, and user status updates.
  * Cleans up any previous subscription first.
  * @returns { () => void } - Cleanup function to unsubscribe.
  */
  subscribeToMessages: () => {
    const { selectedUser } = get()
    if(!selectedUser) return;

    // Cleaning up any existing subscription
    get().unsubscribeFromMessages()

    const socket = useAuthStore.getState().socket
    if(!socket) {
      console.error("Socket not available for message subscription")
      return
    }

    const currentUserId = useAuthStore.getState().authUser?._id
    if(!currentUserId) return;
    
    console.log(`Subscribing to messages for conversation with ${selectedUser._id}`)

    /**
     * Handle incoming messages
     * Only show messages relevant to current conversation
     */
    const handleNewMessage = (newMessage: IMessage) => {
      console.log(`Received new message: ${newMessage}`)
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

    // Handling typing indicators: Showing when the selected user is typing
    const handleUserTyping = (data: { senderId: string; isTyping: boolean }) => {
      console.log(`Typing indicator: ${data}`)

      if(data.senderId !== selectedUser._id) return;

      set((state) => {
        const newTypingUsers = new Map(state.typingUsers)
        
        if(data.isTyping) {
          newTypingUsers.set(data.senderId, true)
        } else {
          newTypingUsers.delete(data.senderId)
        }
        
        return { typingUsers: newTypingUsers }
      })
    }

    /* Handle connection status changes */
    const handleConnect = () => {
      console.log('Socket reconnected in chat')
    }
    const handleDisconnect = (reason: string) => {
      console.log(`Socket disconnected in chat: ${reason}`)
      // Clear typing indicators on disconnect
      set({ typingUsers: new Map() })
    }

    // Event listeners set up
    socket.on("newMessage", handleNewMessage)
    socket.on("userTyping", handleUserTyping)
    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)

    const cleanup = () => {
      console.log('Cleaning up message subscription')
      socket.off("newMessage", handleNewMessage)
      socket.off("userTyping", handleUserTyping)
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
    }

    set({ messageCleanup: cleanup })

    return cleanup
  }, // End of subscribeToMessage 


  /**
  * @description Unsubscribe from the current message socket listener.
  * Clears the cleanup reference and typing indicators.
  */
  unsubscribeFromMessages: () => {
    const { messageCleanup } = get()

    if(messageCleanup) {
      messageCleanup()
      set({
        messageCleanup: null,
        typingUsers: new Map() // Clearing typing indicators
      })
    }
  },


  /**
  * Set the active user for the chat.
  * Unsubscribes from existing listeners and resets conversation state.
  * @param { IAuthUser } user - The user to set as active.
  */
  setSelectedUser: (user) => {
    console.log('Setting selected user:', user?.fullName || user?._id)
    // Cleaning up existing subscription before switching
    get().unsubscribeFromMessages()
    set({
      selectedUser: user,
      messages: [], // Clearing messages when switching users
      typingUsers: new Map() // Clearing typing indicators
    })
    // If user is selected, fetch their messages and subscribe to updates
    if (user?._id) {
      get().getMessages(user._id)
      // Small delay to ensure messages are loaded before subscribing
      setTimeout(() => {
        get().subscribeToMessages()
      }, 100)
    }
  }, // End of setSelectedUser


  /**
  * @description Check if a user is currently typing
  * @param { string } userId - The user ID to check
  * @returns { boolean } - Whether the user is typing
  */
  isUserTyping: (userId: string) => {
    return get().typingUsers.has(userId)
  },


  /**
  * @description Clear all messages (useful for logout)
  */
  clearMessages: () => {
    get().unsubscribeFromMessages()
    set({
      messages: [],
      users: [],
      selectedUser: null,
      typingUsers: new Map()
    })
  }


})) // End of useChatStore