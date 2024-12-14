// Hooks imports
import { useState } from "react"

import toast from 'react-hot-toast'
import { useAuthContext } from "../context/AuthContext"

const useSignup = () => {

  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const signup = async ({ fullName, username, password, confirmPass, gender })=> {
    const success = handleInputErrors({ fullName, username, password, confirmPass, gender })

    if(!success) return

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, confirmPass, gender })
      })

      const data = await response.json()
      if(data.error) {
        throw new Error(data.error)
      }
      
      // Local storage
      localStorage.setItem("chat-user", JSON.stringify(data))
      setAuthUser(data)

    } catch(error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  } // End of signup
  return { loading, signup }
}

export default useSignup

function handleInputErrors({ fullName, username, password, confirmPass, gender }) {
  if(!fullName || !username || !password || !confirmPass || !gender) {
    toast.error('Please fill all the fields')
  }

  if(password !== confirmPass) {
    toast.error('Passwords dot not match')
    return false
  }

  if(password.length < 6) {
    toast.error('Password must be at least 6 characters long')
    return false
  }

  return true
}