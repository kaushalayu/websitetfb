import { useState } from 'react'
import { newsletterAPI } from '../services/api'

const NewsletterBanner = ({ bgImage, fluid, noGapTop, imgClass }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const img = bgImage || "assets/img/banner/banner-bg7.webp";
  const containerClass = fluid ? "container-fluid" : "container";
  const sectionClass = `newsletter__banner--section${noGapTop ? "" : " pt-0"}`;

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await newsletterAPI.subscribe(email)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section className={sectionClass}>
      <div className={containerClass}>
        <div className="newsletter__banner--wrapper">
          <div className="newsletter__banner--bg">
            <img
              className={`newsletter__banner--bg__img${imgClass ? " " + imgClass : ""}`}
              src={img}
              alt=""
            />
            <div className="newsletter__banner--overlay" />
          </div>

          <div className="newsletter__banner--content">
            <span className="newsletter__banner--badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Stay Connected
            </span>

            <h2 className="newsletter__banner--title">
              Subscribe to Our Newsletter
            </h2>

            <p className="newsletter__banner--desc">
              Be the first to know about new arrivals, exclusive offers, and design inspiration.
            </p>

            <form className="newsletter__banner--form" onSubmit={handleSubmit}>
              <div className="newsletter__banner--input-group">
                <svg className="newsletter__banner--input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  className="newsletter__banner--input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button className="newsletter__banner--submit" type="submit">
                  {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
              {status === 'success' && <p style={{ color: '#28a745', marginTop: 8, fontSize: 14 }}>You've subscribed successfully!</p>}
              {status === 'error' && <p style={{ color: '#dc3545', marginTop: 8, fontSize: 14 }}>Something went wrong. Try again.</p>}
            </form>

            <p className="newsletter__banner--footnote">
              No spam. Unsubscribe anytime.
            </p>
          </div>

          <div className="newsletter__banner--deco newsletter__banner--deco--1" />
          <div className="newsletter__banner--deco newsletter__banner--deco--2" />
          <div className="newsletter__banner--deco newsletter__banner--deco--3" />
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
