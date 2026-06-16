import { useState } from 'react'
import { Link } from 'react-router-dom'
import { newsletterAPI, getImageUrl } from '../services/api'
import { useSettings } from '../context/SettingsContext'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const { siteLogo, siteName, address, phone, email: contactEmail, facebook, twitter, instagram, youtube, whatsapp } = useSettings()

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
    <>
    <a href="https://wa.me/91XXXXXXXXXX" target="_blank" className="whatsapp__btn" aria-label="Chat on WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="30">
      <path fill="currentColor"
        d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  </a>

   
    <footer className="footer__section footer__bg">
      <div className="container-fluid">
        <div className="main__footer">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="footer__widget">
                <h2 className="footer__widget--title d-none d-md-block">About us <button
                  className="footer__widget--button" aria-label="footer widget button"></button>
                  <svg className="footer__widget--title__arrowdown--icon" xmlns="http://www.w3.org/2000/svg"
                    width="12.355" height="8.394" viewBox="0 0 10.355 6.394">
                    <path d="M15.138,8.59l-3.961,3.952L7.217,8.59,6,9.807l5.178,5.178,5.178-5.178Z"
                      transform="translate(-6 -8.59)" fill="currentColor"></path>
                  </svg>
                </h2>
                <div className="footer__widget--inner">
                  <Link className="footer__logo" to="/"><img src={getImageUrl(siteLogo, 'assets/img/logo/nav-log.webp')}
                    alt={siteName}/></Link>
                  <p className="footer__widget--desc">{siteName} - Lucknow's <br/> premier destination for premium quality furniture. <br/> We bring elegance to your home.</p>
                    <div className="footer__social">
                      <ul className="social__shear d-flex">
                        {facebook && (
                        <li className="social__shear--list">
                          <a className="social__shear--list__icon" target="_blank" rel="noopener noreferrer"
                            href={facebook}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11.239" height="20.984"
                              viewBox="0 0 11.239 20.984">
                              <path id="Icon_awesome-facebook-f"
                                data-name="Icon awesome-facebook-f"
                                d="M11.575,11.8l.583-3.8H8.514V5.542A1.9,1.9,0,0,1,10.655,3.49h1.657V.257A20.2,20.2,0,0,0,9.371,0c-3,0-4.962,1.819-4.962,5.112V8.006H1.073v3.8H4.409v9.181H8.514V11.8Z"
                                transform="translate(-1.073)" fill="currentColor" />
                            </svg>
                            <span className="visually-hidden">Facebook</span>
                          </a>
                        </li>
                        )}
                        {twitter && (
                        <li className="social__shear--list">
                          <a className="social__shear--list__icon" target="_blank" rel="noopener noreferrer"
                            href={twitter}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="19.492"
                              viewBox="0 0 24 19.492">
                              <path id="Icon_awesome-twitter" data-name="Icon awesome-twitter"
                                d="M21.533,7.112c.015.213.015.426.015.64A13.9,13.9,0,0,1,7.553,21.746,13.9,13.9,0,0,1,0,19.538a10.176,10.176,0,0,0,1.188.061,9.851,9.851,0,0,0,6.107-2.1,4.927,4.927,0,0,1-4.6-3.411,6.2,6.2,0,0,0,.929.076,5.2,5.2,0,0,0,1.294-.167A4.919,4.919,0,0,1,.975,9.168V9.107A4.954,4.954,0,0,0,3.2,9.731,4.926,4.926,0,0,1,1.675,3.152,13.981,13.981,0,0,0,11.817,8.3,5.553,5.553,0,0,1,11.7,7.173a4.923,4.923,0,0,1,8.513-3.365A9.684,9.684,0,0,0,23.33,2.619,4.906,4.906,0,0,1,21.167,5.33,9.861,9.861,0,0,0,24,4.569a10.573,10.573,0,0,1-2.467,2.543Z"
                                transform="translate(0 -2.254)" fill="currentColor" />
                            </svg>
                            <span className="visually-hidden">Twitter</span>
                          </a>
                        </li>
                        )}
                        {instagram && (
                        <li className="social__shear--list">
                          <a className="social__shear--list__icon" target="_blank" rel="noopener noreferrer"
                            href={instagram}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.497" height="19.492"
                              viewBox="0 0 19.497 19.492">
                              <path id="Icon_awesome-instagram" data-name="Icon awesome-instagram"
                                d="M9.747,6.24a5,5,0,1,0,5,5A4.99,4.99,0,0,0,9.747,6.24Zm0,8.247A3.249,3.249,0,1,1,13,11.238a3.255,3.255,0,0,1-3.249,3.249Zm6.368-8.451A1.166,1.166,0,1,1,14.949,4.87,1.163,1.163,0,0,1,16.115,6.036Zm3.31,1.183A5.769,5.769,0,0,0,17.85,3.135,5.807,5.807,0,0,0,13.766,1.56c-1.609-.091-6.433-.091-8.042,0A5.8,5.8,0,0,0,1.64,3.13,5.788,5.788,0,0,0,.065,7.215c-.091,1.609-.091,6.433,0,8.042A5.769,5.769,0,0,0,1.64,19.341a5.814,5.814,0,0,0,4.084,1.575c1.609.091,6.433.091,8.042,0a5.769,5.769,0,0,0,4.084-1.575,5.807,5.807,0,0,0,1.575-4.084c.091-1.609.091-6.429,0-8.038Zm-2.079,9.765a3.289,3.289,0,0,1-1.853,1.853c-1.283.509-4.328.391-5.746.391S5.28,19.341,4,18.837a3.289,3.289,0,0,1-1.853-1.853c-.509-1.283-.391-4.328-.391-5.746s-.113-4.467.391-5.746A3.289,3.289,0,0,1,4,3.639c1.283-.509,4.328-.391,5.746-.391s4.467-.113,5.746.391a3.289,3.289,0,0,1,1.853,1.853c.509,1.283.391,4.328.391,5.746S17.855,15.705,17.346,16.984Z"
                                transform="translate(0.004 -1.492)" fill="currentColor" />
                            </svg>
                            <span className="visually-hidden">Instagram</span>
                          </a>
                        </li>
                        )}
                        {youtube && (
                        <li className="social__shear--list">
                          <a className="social__shear--list__icon" target="_blank" rel="noopener noreferrer"
                            href={youtube}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.419" height="19.419"
                              viewBox="0 0 19.419 19.419">
                              <path id="Icon_awesome-youtube"
                                data-name="Icon awesome-youtube"
                                d="M19.415,19.419H15.4V13.108c0-1.5-.03-3.433-2.093-3.433-2.093,0-2.414,1.634-2.414,3.325v6.42H6.869V6.454H10.73V8.223h.056A4.23,4.23,0,0,1,14.6,6.129c4.075,0,4.824,2.683,4.824,6.168v7.122Z"
                                fill="currentColor" />
                            </svg>
                            <span className="visually-hidden">YouTube</span>
                          </a>
                        </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer__widget">
                  <h2 className="footer__widget--title ">Quick Links <button className="footer__widget--button"
                    aria-label="footer widget button"></button>
                    <svg className="footer__widget--title__arrowdown--icon" xmlns="http://www.w3.org/2000/svg"
                      width="12.355" height="8.394" viewBox="0 0 10.355 6.394">
                      <path d="M15.138,8.59l-3.961,3.952L7.217,8.59,6,9.807l5.178,5.178,5.178-5.178Z"
                        transform="translate(-6 -8.59)" fill="currentColor"></path>
                    </svg>
                  </h2>
                  <ul className="footer__widget--menu footer__widget--inner">
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/about">About us</Link></li>
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/wishlist">Wishlist</Link></li>
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/contact">Contact Us</Link></li>
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/privacy-policy">Privacy Policy</Link></li>
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/faq">Frequently</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer__widget">
                  <h2 className="footer__widget--title ">Account Info <button className="footer__widget--button"
                    aria-label="footer widget button"></button>
                    <svg className="footer__widget--title__arrowdown--icon" xmlns="http://www.w3.org/2000/svg"
                      width="12.355" height="8.394" viewBox="0 0 10.355 6.394">
                      <path d="M15.138,8.59l-3.961,3.952L7.217,8.59,6,9.807l5.178,5.178,5.178-5.178Z"
                        transform="translate(-6 -8.59)" fill="currentColor"></path>
                    </svg>
                  </h2>
                  <ul className="footer__widget--menu footer__widget--inner">
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/my-account">My Account</Link></li>
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/cart">Shopping Cart</Link></li>
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/login">Login</Link></li>
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/login">Register</Link></li>
                    <li className="footer__widget--menu__list"><Link className="footer__widget--menu__text"
                      to="/checkout">Checkout</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="footer__widget">
                  <h2 className="footer__widget--title ">Newsletter <button className="footer__widget--button"
                    aria-label="footer widget button"></button>
                    <svg className="footer__widget--title__arrowdown--icon" xmlns="http://www.w3.org/2000/svg"
                      width="12.355" height="8.394" viewBox="0 0 10.355 6.394">
                      <path d="M15.138,8.59l-3.961,3.952L7.217,8.59,6,9.807l5.178,5.178,5.178-5.178Z"
                        transform="translate(-6 -8.59)" fill="currentColor"></path>
                    </svg>
                  </h2>
                  <div className="footer__newsletter footer__widget--inner">
                    <p className="footer__newsletter--desc">Get updates by subscribe our
                      weekly newsletter</p>
                    <form className="newsletter__subscribe--form__style position__relative" onSubmit={handleSubmit}>
                      <label>
                        <input className="footer__newsletter--input newsletter__subscribe--input"
                          placeholder="Enter your email address" type="email" value={email}
                          onChange={e => setEmail(e.target.value)}/>
                      </label>
                      <button
                        className="footer__newsletter--button newsletter__subscribe--button primary__btn"
                        type="submit">{status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
                        <svg className="newsletter__subscribe--button__icon"
                          xmlns="http://www.w3.org/2000/svg" width="9.159" height="7.85"
                          viewBox="0 0 9.159 7.85">
                          <path data-name="Icon material-send"
                            d="M3,12.35l9.154-3.925L3,4.5,3,7.553l6.542.872L3,9.3Z"
                            transform="translate(-3 -4.5)" fill="currentColor" />
                        </svg>
                      </button>
                      {status === 'success' && <p style={{ color: '#28a745', marginTop: 8, fontSize: 14 }}>Subscribed successfully!</p>}
                      {status === 'error' && <p style={{ color: '#dc3545', marginTop: 8, fontSize: 14 }}>Something went wrong.</p>}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__bottom d-flex justify-content-between align-items-center">
            <p className="copyright__content  m-0">Copyright © 2024 <Link className="copyright__content--link"
              to="/">The Furniture Boutique</Link> . All Rights Reserved. Designed by The Furniture
              Boutique</p>
            <div className="footer__payment text-right">
              <img className="footer__payment--visa__card display-block" src="assets/img/other/payment-visa-card.webp"
                alt="visa-card"/>
            </div>
          </div>
        </div>
    </footer>
    </>
  );
};

export default Footer;
