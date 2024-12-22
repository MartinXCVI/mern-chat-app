// React router
import { Link } from "react-router-dom"

// Hooks imports
import { useState } from "react"
import useLogin from "../../hooks/useLogin"

// React icons
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { MdLogin } from "react-icons/md";

const Login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { loading, login } = useLogin()

  const handleLoginSubmit = async (event)=> {
    event.preventDefault()
    await login(username ,password)
  }

  const loadingSpinner = (
    <span className="loading loading-spinner"></span>
  )

  return (
    <div className="flex flex-col items-center justify-center min-w-95 md:w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-5">
        <h1 className="text-3x1 font-semibold text-center text-gray-500">
          Login — <span className="text-emerald-500">MERN Chat App</span>
        </h1>

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-3">
            <label htmlFor="username-input" className="label p-2">
              <span className="inline-flex items-center text-base label-text text-gray-300"><FaUser className="mr-2" title="User icon" /> Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              id="username-input"
              className="w-full input input-bordered h-10"
              value={username}
              onChange={(event)=> setUsername(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password-input">
              <span className="inline-flex items-center text-base label-text text-gray-300"><FaKey className="mr-2" title="Access key icon" /> Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              id="password-input"
              className="w-full input input-bordered h-10"
              value={password}
              onChange={(event)=> setPassword(event.target.value)}
            />
          </div>
          <Link to="/signup" className="text-sm hover:underline hover:text-emerald-600 mt-3 mb-2 inline-block text-gray-400">
            Don&apos;t have an account?
          </Link>
          <div>
            <button
              className="btn btn-block btn-sm mt-2"
              disabled={loading}
              title="Button for logging in"
            >
              { loading ? (loadingSpinner) : <>{'Login'} <MdLogin title="Entrance icon" /></> }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login