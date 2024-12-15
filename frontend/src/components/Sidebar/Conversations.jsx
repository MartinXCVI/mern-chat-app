import useGetConversations from "../../hooks/useGetConversations"
import Conversation from "./Conversation"

const Conversations = () => {

  const { loading, conversations } = useGetConversations()

  const loadingSpinner = (
    <span className="loading loading-spinner mx-auto"></span>
  )

  return (
    <div className="py-2 flex flex-col overflow-auto">
      { conversations.map((conversation, index)=> (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          lastIndex={index === conversations.length - 1}
        />
      ))}

      { loading ? (loadingSpinner) : null }
    </div>
  )
}

export default Conversations