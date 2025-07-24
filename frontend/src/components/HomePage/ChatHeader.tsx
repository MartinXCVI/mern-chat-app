// React imports
import type { JSX } from 'react'
// Global state
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from "../../store/useChatStore";
// Icons
import { X } from "lucide-react";

const ChatHeader = (): JSX.Element => {

  const { selectedUser, setSelectedUser } = useChatStore()
  const { onlineUsers } = useAuthStore()

  const isUserOnline = (id?: string): boolean => {
    return !!id && onlineUsers.includes(id)
  }

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.fullName} />
            </div>
          </div>
          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {isUserOnline(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader