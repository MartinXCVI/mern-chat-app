import { useEffect, useState } from "react"
import toast from "react-hot-toast"


// Utility function for fetching data
const fetchWithAbort = async (url, options = {}) => {
  const controller = new AbortController()
  const signal = controller.signal
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const response = await fetch(url, { ...options, signal })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json();
    return data
  } finally {
    clearTimeout(timeout)
  }
}

const useGetConversations = (endpoint = "/api/users") => {

  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState([])
  const [error, setError] = useState(null);

  useEffect(()=> {
    let isMounted = true;

    const getConversations = async ()=> {
      setLoading(true)
      setError(null);

      try {
        const data = await fetchWithAbort(endpoint, { credentials: "include" });
        if(isMounted) {
          setConversations(data)
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

    getConversations()

    return ()=> {
      isMounted = false; // Cleanup for unmounted component
    }
  }, [endpoint])

  return { loading, conversations, error }
}

export default useGetConversations