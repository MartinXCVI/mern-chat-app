// React & React hooks imports
import type { JSX, FormEvent } from 'react'
import { useState } from 'react'
// Global state
import { useAuthStore } from '../store/useAuthStore'
// React Router DOM
import { Link } from 'react-router-dom'
// Icons
import { MessageSquare, User, Mail, Lock, EyeOff, Eye } from 'lucide-react'
import { Loader2 } from 'lucide-react'
// Components
import AuthImagePattern from '../components/AuthImagePattern'
// Types/Interfaces
import type { ISignUpData } from '../interfaces/ISignUpData'
// Utilities
import toast from 'react-hot-toast'


const SignUpPage = (): JSX.Element => {

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<ISignUpData>({
    fullName: "",
    email: "",
    password: "",
  })

  const { signup, isSigningUp } = useAuthStore()

  const validateForm = () => {
    if(!formData.fullName.trim()) {
      return toast.error("Full name is required")
    }
    if(!formData.email.trim()) {
      return toast.error("Email is required")
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Invalid email format")
    }
    if(!formData.password) {
      return toast.error("Password is required")
    }
    if(formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters")
    }
    return true
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const success = validateForm()

    if(success) signup(formData)
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center
                group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className='size-6 text-primary' />
              </div>
            </div>
          </div>
          {/* SIGN-UP FORM */}
          <form
            className='space-y-6'
            onSubmit={handleSubmit}
          >
            {/* Full name input */}
            <div className="form-control">
              <label className="label" htmlFor='full-name-sign-up-input'>
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  id='full-name-sign-up-input'
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  autoComplete='on'
                />
              </div>
            </div>
            {/* Email input */}
            <div className="form-control">
              <label className="label" htmlFor='email-sign-up-input'>
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  id="email-sign-up-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  autoComplete='on'
                />
              </div>
            </div>
            {/* Password input */}
            <div className="form-control">
              <label className="label" htmlFor='password-sign-up-input'>
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  id='password-sign-up-input'
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete='off'
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            {/* Submit button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  )
}

export default SignUpPage