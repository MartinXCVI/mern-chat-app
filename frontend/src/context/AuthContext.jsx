import { createContext, useContext, useState } from "react";

export const AuthContext = createContext()

export const useAuthContext = ()=> {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({ children })=> {
  // JSON.parse() for turning the string value into an object
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null)

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      { children }
    </AuthContext.Provider>
  )
}