import useConversation from '../../store/useConversation'

const Conversation = ({ conversation, lastIndex }) => {

  const { fullName, profilePic } = conversation

  const { selectedConversation, setSelectedConversation } = useConversation()

  const isSelected = selectedConversation?._id === conversation._id

  const divLine = (
    <div className="divider my-0 py-0 h-1"></div>
  )

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
          ${isSelected ? 'bg-sky-500' : ''}`
        }
        onClick={()=> setSelectedConversation(conversation)}
      >
        <div className="avatar online">
          <figure className="w-12 rounded-full">
            <img
              src={ profilePic }
              alt="user avatar"
            />
          </figure>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{ fullName }</p>
          </div>
        </div>
      </div>

      {!lastIndex && divLine}
    </>
  )
}

export default Conversation