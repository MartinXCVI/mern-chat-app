// React hooks
import { useState } from "react"

// React router
import { Link } from "react-router-dom"

// React icons
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaCheckDouble } from "react-icons/fa";
import { FaIdCard } from "react-icons/fa";

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
    <div className="flex flex-col items-center justify-center min-w-95 md:w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5 py-2">
        <h1 className="text-3x1 font-semibold text-center text-gray-400">
          Sign Up — <span className="text-emerald-500">MERN Chat App</span>
        </h1>
        <form onSubmit={handleSignUpSubmit}>
          <div className="mb-3">
            <label htmlFor="fullname-input" className="label p-2">
              <span className="inline-flex items-center text-base label-text text-gray-300"><MdOutlineDriveFileRenameOutline className="mr-2" title="Pencil icon" /> Full Name</span>
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
          <div className="mb-3">
            <label htmlFor="username-input" className="label p-2">
              <span className="inline-flex items-center text-base label-text text-gray-300"><FaUser className="mr-2" title="User icon" /> Username</span>
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
          <div className="mb-3">
            <label htmlFor="password-input" className="label">
              <span className="inline-flex items-center text-base label-text text-gray-300"><RiLockPasswordFill className="mr-2" title="Padlock icon" /> Password</span>
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
          <div className="mb-3">
            <label htmlFor="confirm-password-input" className="label">
              <span className="inline-flex items-center text-base label-text text-gray-300"><FaCheckDouble className="mr-2" title="Double check icon" /> Confirm Password</span>
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
            className="text-sm hover:underline hover:text-emerald-400 mt-2 inline-block text-gray-700"
          >
            Already have an account?
          </Link>

          <div>
            <button
              className="btn btn-block btn-sm mt-2 mb-2 border border-slate-700"
              disabled={loading}
              title="Button for signing up"
            >
              { loading ? (loadingSpinner) : <>{"Sign Up"} <FaIdCard title="ID card icon" /></> }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp