// Components imports
import useGetMessages from "../../hooks/useGetMessages"
import Message from "./Message"
import MessageSkeleton from "../skeletons/MessageSkeleton"
import { useEffect, useRef } from "react"

const Messages = () => {

  const { messages, loading } = useGetMessages()
  const lastMessageRef = useRef()

  useEffect(()=> {
    setTimeout(()=> {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
    }, 0)
  }, [messages])

  return (
    <div className="px-4 flex-1 overflow-auto">

      { !loading && messages.length > 0 && messages.map((message)=> (
        <div
          key={message._id}
          ref={lastMessageRef}
        >
          <Message key={message._id} message={message} />
        </div>
      )) }

      { loading && [...Array(3)].map((_, index)=> <MessageSkeleton key={index} />) }

      { !loading && messages.length === 0 && (
        <p className="text-center">Send a message to start the conversation</p>
      ) }
    </div>
  )
}

export default Messages