import { useState } from "react"
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext'

const useLogin = ()=> {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const login = async (username, password)=> {

    const success = handleInputErrors(username, password)
    if(!success) return
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })

      // Check if the response status is not 200
      if(!response.ok) {
        const errorData = await response.json(); // Get error message from backend
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json()
      
      if(data.error) {
        throw new Error(data.error)
      }

      // Store user in localStorage and update context
      localStorage.setItem("chat-user", JSON.stringify(data))
      setAuthUser(data)
      toast.success("Logged in successfully!");

    } catch(error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  } // End of login
  return { loading, login }
}

export default useLogin

function handleInputErrors(username, password) {
  if(!username || !password) {
    toast.error('Please fill all the fields properly')
    return false
  }
  return true
}