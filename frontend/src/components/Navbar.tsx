// React imports
import type { JSX } from 'react'
// React Router DOM
import { Link } from "react-router-dom";
// Global state
import { useAuthStore } from "../store/useAuthStore";
// Icons
import { LogOut, MessageSquare, Settings, User } from "lucide-react";


const Navbar = (): JSX.Element => {

  const { logout, authUser } = useAuthStore()

  const handleLogout = async (): Promise<void> => {
    await logout()
  }

  return (
    <header
      className="border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <nav className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">MERN Chat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="btn btn-sm flex gap-2 items-center cursor-pointer"
                  onClick={handleLogout}
                  aria-label='Logout button'
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar