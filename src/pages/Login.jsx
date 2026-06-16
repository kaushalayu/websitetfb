import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NewsletterBanner from '../components/NewsletterBanner'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login, register, loading } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(loginEmail, loginPassword)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!agreeTerms) {
      setError('Please agree to the terms & conditions')
      return
    }
    try {
      await register({ name: regName, email: regEmail, password: regPassword })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="main__content_wrapper">
      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">
                  {isLogin ? 'Login' : 'Create Account'}
                </h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items">
                    <Link className="text-white" to="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span className="text-white">{isLogin ? 'Login' : 'Register'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="login__section section--padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              {error && (
                <div className="alert alert-danger" style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: '1.4rem', background: '#fde8e8', color: '#c0392b', border: '1px solid #f5c6cb' }}>
                  {error}
                </div>
              )}

              <div className="account__login">
                {isLogin ? (
                  <form onSubmit={handleLogin}>
                    <div className="account__login--header mb-25">
                      <h3 className="account__login--header__title mb-10">Welcome Back</h3>
                      <p className="account__login--header__desc">Login to your account</p>
                    </div>
                    <div className="account__login--inner">
                      <input
                        className="account__login--input"
                        placeholder="Email Address"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                      <input
                        className="account__login--input"
                        placeholder="Password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <div className="account__login--remember__forgot mb-15 d-flex justify-content-between align-items-center">
                        <div className="account__login--remember">
                          <input className="checkout__checkbox--input" id="remember" type="checkbox" />
                          <span className="checkout__checkbox--checkmark" />
                          <label className="checkout__checkbox--label login__remember--label" htmlFor="remember">Remember me</label>
                        </div>
                        <button className="account__login--forgot" type="button">Forgot Password?</button>
                      </div>
                      <button className="account__login--btn primary__btn" type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                      </button>
                      <p className="account__login--signup__text" style={{ marginTop: 16 }}>
                        Don't have an account?{' '}
                        <button type="button" onClick={() => { setIsLogin(false); setError('') }}>Sign up</button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegister}>
                    <div className="account__login--header mb-25">
                      <h3 className="account__login--header__title mb-10">Create an Account</h3>
                      <p className="account__login--header__desc">Join us today</p>
                    </div>
                    <div className="account__login--inner">
                      <input
                        className="account__login--input"
                        placeholder="Full Name"
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                      <input
                        className="account__login--input"
                        placeholder="Email Address"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                      <input
                        className="account__login--input"
                        placeholder="Password (min 6 characters)"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <div className="account__login--remember mb-15">
                        <input
                          className="checkout__checkbox--input"
                          id="terms"
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          required
                        />
                        <span className="checkout__checkbox--checkmark" />
                        <label className="checkout__checkbox--label login__remember--label" htmlFor="terms">
                          I agree to the terms & conditions
                        </label>
                      </div>
                      <button className="account__login--btn primary__btn" type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                      </button>
                      <p className="account__login--signup__text" style={{ marginTop: 16 }}>
                        Already have an account?{' '}
                        <button type="button" onClick={() => { setIsLogin(true); setError('') }}>Login</button>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterBanner />
    </main>
  )
}

export default Login
