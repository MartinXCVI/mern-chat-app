import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

const useLogout = () => {
  
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const [error, setError] = useState(null)

  const logout = async ()=> {

    setLoading(true)
    setError(null)

    const controller = new AbortController()
    const signal = controller.signal

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Logout failed")
      }

      // Remove user data from localStorage and update context
      localStorage.removeItem("chat-user")
      setAuthUser(null)
      toast.success("Logged out successfully!")

    } catch(error) {
      if (error.name === "AbortError") {
        console.log("Logout request aborted")
      } else {
        console.error(error)
        setError(error.message)
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  } // End of logout
  return { loading, error, logout }
}

export default useLogout