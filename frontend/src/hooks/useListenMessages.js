import { useEffect, useRef } from "react"
import { useSocketContext } from "../context/SocketContext"
import useConversation from '../store/useConversation'
import notiSound from '../assets/audio/notification.mp3'

const useListenMessages = () => {
  const { socket } = useSocketContext()
  const { messages, setMessages } = useConversation()
  // useRef to create and reuse the Audio instance, improving performance
  const audioRef = useRef(new Audio(notiSound))

  useEffect(()=> {
    const handleNewMessage = (newMessage)=> {
      newMessage.shouldShake = true

      // Play notification sound
      const sound = audioRef.current
      sound.pause()
      sound.currentTime = 0
      sound.play().catch((error) => {
        console.error("Error playing notification sound:", error)
      })

      /* Add the new message - functional state update 
      for preventing unnecessary re-creation of the listener. */
      setMessages((prevMessages) => [...prevMessages, newMessage])
    }

    socket?.on("newMessage", handleNewMessage)

    return ()=> {
      socket?.off("newMessage", handleNewMessage)
    }
  }, [socket, setMessages, messages])
  // End of useEffect hook

  return {
    playSound: ()=> audioRef.current.play(),
  }
}

export default useListenMessages