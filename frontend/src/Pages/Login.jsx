function Login() {
  return (
    <div className="login-container">

      <div className="login-box">

        <h1>Welcome Back!</h1>
        <p>Login to your SafeHer account</p>

        <form>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />

          <button
  type="button"
  onClick={() => window.location.href = '/dashboard'}
>
  Login
</button>
        </form>

        <p>
          Don't have an account? <a href="/register">Sign Up</a>
        </p>

      </div>

    </div>
  )
}

export default Login