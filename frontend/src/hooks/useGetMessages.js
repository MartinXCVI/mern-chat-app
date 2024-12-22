// Hooks
import { useEffect, useState } from "react"
import useConversation from "../store/useConversation"

import toast from "react-hot-toast"


// Utility function for fetch with AbortController
const fetchWithAbort = async (url, options = {}) => {
  const controller = new AbortController()
  const signal = controller.signal
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const response = await fetch(url, { ...options, signal })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } finally {
    clearTimeout(timeout)
  }
}

const useGetMessages = (endpointBase = "/api/messages") => {
  const [loading, setLoading] = useState(false)
  const { messages, setMessages, selectedConversation } = useConversation()
  const [error, setError] = useState(null);

  useEffect(()=> {
    let isMounted = true

    const getMessages = async()=> {
      if (!selectedConversation?._id) return;
      setLoading(true)
      setError(null)

      try {
        const data = await fetchWithAbort(`${endpointBase}/${selectedConversation._id}`);
        if (isMounted) {
          setMessages(data)
        }
      } catch(error) {
        console.error(error)
        if(isMounted) {
          setError(error.message)
          toast.error(error.message)
        }
      } finally {
        if(isMounted) {
          setLoading(false)
        }
      }
    }

    getMessages()

    return ()=> {
      isMounted = false; // Cleanup for unmounted components
    }
  }, [endpointBase, selectedConversation?._id, setMessages])
  // End of useEffect
  return { messages, loading, error }
}

export default useGetMessages