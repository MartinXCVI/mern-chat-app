import { useState } from "react"
import toast from 'react-hot-toast'
import useConversation from "../store/useConversation"

const useSendMessage = () => {
  
  const [loading, setLoading] = useState(false)
  const { messages, setMessages, selectedConversation } = useConversation()
  const [error, setError] = useState(null);

  const sendMessage = async (message)=> {
    if (!message?.trim()) {
      toast.error("Message cannot be empty")
      return
    }

    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const signal = controller.signal

    try {
      const response = await fetch(`/api/messages/send/${selectedConversation._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message }),
        signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send message")
      }

      const data = await response.json()

      setMessages((prevMessages) => [...prevMessages, data])

    } catch(error) {
      if (error.name === "AbortError") {
        console.log("Message sending aborted")
      } else {
        console.error(error)
        setError(error.message)
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }

    return ()=> controller.abort();
  }

  return { sendMessage, loading, error }

}

export default useSendMessage