// Hooks imports
import { useState } from "react"

import toast from 'react-hot-toast'
import { useAuthContext } from "../context/AuthContext"

const useSignup = () => {

  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()
  const [error, setError] = useState(null)

  const signup = async ({ fullName, username, password, confirmPass, gender })=> {

    const isValid = handleInputErrors({ fullName, username, password, confirmPass, gender })
    if(!isValid) return

    setLoading(true)
    setError(null) // Reset previous error

    const controller = new AbortController()
    const signal = controller.signal

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, confirmPass, gender }),
        signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Signup failed")
      }

      const data = await response.json()
      if(data.error) {
        throw new Error(data.error)
      }
      
      // Store user in localStorage and update context
      localStorage.setItem("chat-user", JSON.stringify(data))
      setAuthUser(data)
      toast.success("Signed up successfully!")

    } catch(error) {
      if (error.name === "AbortError") {
        console.log("Signup request aborted")
      } else {
        console.error(error)
        setError(error.message)
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }

    return ()=> controller.abort();
  } // End of signup
  return { loading, signup, error }
}

export default useSignup

function handleInputErrors({ fullName, username, password, confirmPass, gender }) {
  if(!fullName || !username || !password || !confirmPass || !gender) {
    toast.error('Please fill all the fields')
    return false
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