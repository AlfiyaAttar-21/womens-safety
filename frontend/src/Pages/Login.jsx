
import { useState } from 'react'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

function Login() {

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="login-container">

      {/* Background Decorations */}
      <div className="login-circle circle-one"></div>
      <div className="login-circle circle-two"></div>

      {/* Login Card */}
      <div className="login-box">

        {/* Logo */}
        <div className="login-logo">
          <ShieldCheck size={42} />
        </div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">
          Login to your SafeHer account
        </p>

        {/* Form */}
        <form onSubmit={(e) => {
          e.preventDefault()
          window.location.href = '/dashboard'
        }}>

          {/* Email */}
          <label>Email Address</label>

          <div className="login-input-box">
            <Mail size={19} />

            <input
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <label>Password</label>

          <div className="login-input-box">
            <Lock size={19} />

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-submit-btn">
            Login to Account
            <ArrowRight size={19} />
          </button>

        </form>

        {/* Register Link */}
        <p className="register-text">
          Don't have an account?
          <a href="/register"> Sign Up</a>
        </p>

        {/* Security Text */}
        <div className="login-security">
          <ShieldCheck size={17} />
          Your safety and privacy matter to us.
        </div>

      </div>

    </div>
  )
}

export default Login
