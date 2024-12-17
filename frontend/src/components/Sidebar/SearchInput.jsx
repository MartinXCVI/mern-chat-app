// React icons
import { useState } from "react";
import { BsSearch } from "react-icons/bs";

// Hooks
import useConversation from '../../store/useConversation'
import useGetConversations from '../../hooks/useGetConversations'
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("")
  const { setSelectedConversation } = useConversation()
  const { conversations } = useGetConversations()

  const handleSearchSubmit = (event)=> {
    event.preventDefault()
    if(!search) {
      return;
    }
    if(search.length < 3) {
      return toast.error('Your search must be at least 3 characters long')
    }

    const conversation = conversations.find((conversation)=> conversation.fullName.toLowerCase().includes(search.toLowerCase()))

    if(conversation) {
      setSelectedConversation(conversation)
      setSearch('')
    } else {
      toast.error('No such user found')
    }

  }

  return (
    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        id="search-input"
        className="input input-bordered rounded-full"
        value={search}
        onChange={(event)=> setSearch(event.target.value)}
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <BsSearch className="w-6 h-6 outline-none" />
      </button>
    </form>
  )
}

export default SearchInput