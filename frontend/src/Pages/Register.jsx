function Register() {
  return (
    <div className="register-container">

      <div className="register-box">

        <h1>Create Account</h1>
        <p>Join SafeHer and stay safe</p>

        <form>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter your mobile number"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
          />

          <button
            type="button"
            onClick={() => window.location.href = '/dashboard'}
          >Create Account</button>
        </form>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>

      </div>

    </div>
  )
}

export default Register