// React router
import { Link } from "react-router-dom"

// Hooks imports
import { useState } from "react"
import useLogin from "../../hooks/useLogin"

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
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-5">
        <h1 className="text-3x1 font-semibold text-center text-gray-300">
          Login <span className="text-blue-500">ChatApp</span>
        </h1>

        <form onSubmit={handleLoginSubmit}>
          <div>
            <label htmlFor="username-input" className="label p-2">
              <span className="text-base label-text">Username</span>
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
          <div>
            <label htmlFor="password-input">
              <span className="text-base label-text">Password</span>
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
          <Link to="/signup" className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block">
            Don&apos;t have an account?
          </Link>
          <div>
            <button
              className="btn btn-block btn-sm mt-2"
              disabled={loading}
            >
              { loading ? (loadingSpinner) : "Login" }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login