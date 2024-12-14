// React router
import { Link } from "react-router-dom"

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-5">
        <h1 className="text-3x1 font-semibold text-center text-gray-300">
          Login <span className="text-blue-500">ChatApp</span>
        </h1>
        <form>
          <div>
            <label htmlFor="username-input" className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              id="username-input"
              className="w-full input input-bordered h-10"
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
            />
          </div>
          <Link to="/signup" className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block">
            Don&apos;t have an account?
          </Link>
          <div>
            <button className="btn btn-block btn-sm mt-2">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login