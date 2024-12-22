import useConversation from "../../store/useConversation";
import { useEffect } from "react"

// Components imports
import Messages from "./Messages"
import MessageInput from "./MessageInput"
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";


const MessageContainer = () => {

  const { selectedConversation, setSelectedConversation } = useConversation()

  useEffect(()=> {
    // Clean up function for unmounting
    return ()=> setSelectedConversation(null)
  }, [setSelectedConversation])

  return (
    <div className="md:min-w-[450px] flex flex-col">
      {!selectedConversation ? (<NoChatSelected />) : (<DefaultContent />)}
    </div>
  )
}

export default MessageContainer

const DefaultContent = ()=> {

  const { selectedConversation, setSelectedConversation } = useConversation()
  const { fullName } = selectedConversation

  return (
    <>
      <div className="bg-slate-700 px-4 py-2 mb-2">
        <span className="label-text">To:</span>{" "}
        <span className="text-emerald-500 font-bold">{ fullName }</span>
      </div>
      <Messages />
      <MessageInput />
    </>
  )
}

const NoChatSelected = ()=> {

  const { authUser } = useAuthContext()

  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome, <span className="text-emerald-500">{authUser.fullName}</span>! 👋</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" title="Chat bubbles icon" />
      </div>
    </div>
  )
}