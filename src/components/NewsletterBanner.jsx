import { useState } from 'react'
import { newsletterAPI } from '../services/api'

const NewsletterBanner = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await newsletterAPI.subscribe(email)
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section className="sc-section">
      <div className="container">
        <div className="sc-card">
          <div className="sc-card__left">
            <div className="sc-icon-row">
              <span className="sc-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <span className="sc-label">Newsletter</span>
            </div>
            <h2 className="sc-title">Get <em>10% Off</em> Your First Order</h2>
            <p className="sc-desc">Join 5,000+ home lovers. New arrivals, curated picks &amp; member-only deals &mdash; once a week.</p>

            <form className="sc-form" onSubmit={handleSubmit}>
              <div className="sc-form__row">
                <input
                  className="sc-form__input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button className="sc-form__btn" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Joining...' : 'Subscribe'}
                </button>
              </div>
              {status === 'success' && <p className="sc-msg sc-msg--ok">Welcome aboard! Check your inbox for the code.</p>}
              {status === 'error' && <p className="sc-msg sc-msg--err">Something went wrong. Try again.</p>}
            </form>

            <div className="sc-trust">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>No spam. Unsubscribe anytime.</span>
            </div>
          </div>

          <div className="sc-card__right">
            <div className="sc-perks">
              <div className="sc-perk">
                <span className="sc-perk__icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </span>
                <div>
                  <h4 className="sc-perk__title">Curated Picks</h4>
                  <p className="sc-perk__text">Hand-selected furniture just for you</p>
                </div>
              </div>
              <div className="sc-perk">
                <span className="sc-perk__icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><path d="M16 8l-8 8"/><path d="M8 8h8v8"/>
                  </svg>
                </span>
                <div>
                  <h4 className="sc-perk__title">Early Access</h4>
                  <p className="sc-perk__text">Shop new drops before everyone else</p>
                </div>
              </div>
              <div className="sc-perk">
                <span className="sc-perk__icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </span>
                <div>
                  <h4 className="sc-perk__title">Member Deals</h4>
                  <p className="sc-perk__text">Exclusive discounts up to 30% off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsletterBanner
