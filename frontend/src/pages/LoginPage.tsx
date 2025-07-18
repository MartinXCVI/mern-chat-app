// React & React hooks imports
import type { FormEvent, JSX, ChangeEvent } from 'react'
import { useState } from "react";
// Global state
import { useAuthStore } from "../store/useAuthStore";
// Components
import AuthImagePattern from "../components/AuthImagePattern";
// React Router DOM
import { Link } from "react-router-dom";
// Icons
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
// Types/Interfaces
import type { ILoginData } from '../interfaces/ILoginData';
// Utilities
import toast from 'react-hot-toast';


const LoginPage = (): JSX.Element => {

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [formData, setFormData] = useState<ILoginData>({
    email: "",
    password: "",
  })
  
  const { login, isLoggingIn } = useAuthStore()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    
    if(!formData.email || !formData.password) {
      toast.error("All fields are required.")
      return
    }
    login(formData)
  }

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div className="form-control">
              <label className="label" htmlFor='email-login-input'>
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  id='email-login-input'
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => setFormData({ ...formData, email: event.target.value })}
                  autoComplete='on'
                />
              </div>
            </div>
            {/* Password input */}
            <div className="form-control">
              <label className="label" htmlFor='password-login-input'>
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  id='password-login-input'
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => setFormData({ ...formData, password: event.target.value })}
                  autoComplete='off'
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={(): void => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  )
}

export default LoginPage