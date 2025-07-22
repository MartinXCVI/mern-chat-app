// React imports
import type { JSX } from 'react'
// Global state
import { useChatStore } from '../store/useChatStore'
// Components
import Sidebar from '../components/HomePage/Sidebar'
import NoChatSelected from '../components/HomePage/NoChatSelected'
import ChatContainer from '../components/HomePage/ChatContainer'


const HomePage = (): JSX.Element => {

  const { selectedUser } = useChatStore()

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage