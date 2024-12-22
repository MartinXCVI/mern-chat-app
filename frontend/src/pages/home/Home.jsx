// Components imports
import Sidebar from "../../components/Sidebar/Sidebar"
import MessageContainer from "../../components/messages/MessageContainer"

const Home = () => {
  return (
    <div className="flex sm:h-[450px] flex-col sm:flex-row md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0">
      <Sidebar />
      <MessageContainer />
    </div>
  )
}

export default Home