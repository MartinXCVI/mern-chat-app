// React hooks
import { useState } from "react"

// React router
import { Link } from "react-router-dom"

// Components imports
import GenderCheck from "./GenderCheck"
import useSignup from "../../hooks/useSignup"


const SignUp = () => {

  const [inputs, setInputs] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPass: '',
    gender: ''
  })

  const { loading, signup } = useSignup()

  const handleCheckboxChange = (gender)=> {
    setInputs({...inputs, gender})
  }

  const handleSignUpSubmit = async (event)=> {
    event.preventDefault()
    await signup(inputs)
  }

  const loadingSpinner = (
    <span className="loading loading-spinner"></span>
  )

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5">
        <h1 className="text-3x1 font-semibold text-center text-gray-300">
          Sign Up <span className="text-blue-500">ChatApp</span>
        </h1>
        <form onSubmit={handleSignUpSubmit}>
          <div>
            <label htmlFor="fullname-input" className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              id="fullname-input"
              className="w-full input input-bordered h-10"
              value={inputs.fullName}
              onChange={(event)=> setInputs({...inputs, fullName: event.target.value})}
            />
          </div>
          <div>
            <label htmlFor="username-input" className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              id="username-input"
              className="w-full input input-bordered h-10"
              value={inputs.username}
              onChange={(event)=> setInputs({...inputs, username: event.target.value})}
            />
          </div>
          <div>
            <label htmlFor="password-input" className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              id="password-input"
              className="w-full input input-bordered h-10"
              value={inputs.password}
              onChange={(event)=> setInputs({...inputs, password: event.target.value})}
            />
          </div>
          <div>
            <label htmlFor="confirm-password-input" className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              id="confirm-password-input"
              className="w-full input input-bordered h-10"
              value={inputs.confirmPass}
              onChange={(event)=> setInputs({...inputs, confirmPass: event.target.value})}
            />
          </div>
          {/* Gender checkbox component */}
          <GenderCheck onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
          <Link
            to="/login"
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
          >
            Already have an account?
          </Link>

          <div>
            <button
              className="btn btn-block btn-sm mt-2 border border-slate-700"
              disabled={loading}
            >
              { loading ? (loadingSpinner) : "Sign Up" }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp