import { useEffect, useState } from "react"
import toast from "react-hot-toast"


const useGetConversations = () => {

  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState([])

  useEffect(()=> {
    const getConversations = async ()=> {

      setLoading(true)

      try {
        const response = await fetch("/api/users", { credentials: "include" })
        const data = await response.json()
        if(data.error) {
          throw new Error(data.error)
        }
        setConversations(data)

      } catch(error) {
        console.error(error)
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    getConversations()
  }, [])

  return { loading, conversations }
}

export default useGetConversations