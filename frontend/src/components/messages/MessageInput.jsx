// React icons
import { GrSend } from "react-icons/gr";

// Hooks
import useSendMessage from "../../hooks/useSendMessage";
import { useState } from "react";

const MessageInput = () => {

  const [message, setMessage] = useState("")
  const { loading, sendMessage } = useSendMessage()
  
  const handleMessageSubmit = async (event)=> {
    event.preventDefault()
    if(!message) return;
    
    await sendMessage(message)
    setMessage("")
  }

  const loadingSpinner = (
    <div className="loading loading-spinner"></div>
  )

  return (
    <form className="px-4 my-3" onSubmit={handleMessageSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(event)=> setMessage(event.target.value)}
          title="Message input"
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
          title="Send message button"
        >
          { loading ? loadingSpinner : <GrSend /> }
        </button>
      </div>
    </form>
  )
}

export default MessageInput