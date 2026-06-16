import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NewsletterBanner from '../components/NewsletterBanner'
import { useAuth } from '../context/AuthContext'
import { orderAPI } from '../services/api'

const MyAccount = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.list()
        setOrders(data.orders || data || [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchOrders()
    else setLoading(false)
  }, [user])

  return (
    <main className="main__content_wrapper">
      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">My Account</h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items"><Link className="text-white" to="/">Home</Link></li>
                  <li className="breadcrumb__content--menu__items"><span className="text-white">My Account</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="my__account--section section--padding">
        <div className="container">
          <div className="my__account--section__inner border-radius-10 d-flex">
            <div className="account__left--sidebar">
              <h3 className="account__content--title mb-20">My Profile</h3>
              <ul className="account__menu">
                <li className={`account__menu--list ${location.pathname === '/my-account' ? 'active' : ''}`}><Link to="/my-account">Dashboard</Link></li>
                <li className={`account__menu--list ${location.pathname === '/my-account-2' ? 'active' : ''}`}><Link to="/my-account-2">Addresses</Link></li>
                <li className={`account__menu--list ${location.pathname === '/wishlist' ? 'active' : ''}`}><Link to="/wishlist">Wishlist</Link></li>
                <li className={`account__menu--list ${location.pathname === '/login' ? 'active' : ''}`}>
                  {user ? (
                    <a href="/" onClick={(e) => { e.preventDefault(); logout(); navigate('/') }} style={{ cursor: 'pointer' }}>Log Out</a>
                  ) : (
                    <Link to="/login">Log In</Link>
                  )}
                </li>
              </ul>
            </div>

            <div className="account__wrapper">
              <div className="account__content">
                {!user ? (
                  <>
                    <h3 className="account__content--title mb-20">Welcome</h3>
                    <p className="account__details--desc">Please <Link to="/login">log in</Link> to view your account details.</p>
                  </>
                ) : (
                  <>
                    <h3 className="account__content--title mb-20">Dashboard</h3>
                    <div className="account__details">
                      <h4 className="account__details--title">Account Details</h4>
                      <p className="account__details--desc">
                        <strong>Name:</strong> {user.name}<br />
                        <strong>Email:</strong> {user.email}
                      </p>
                    </div>

                    <h3 className="account__content--title mb-20 mt-30">Orders</h3>
                    {loading ? (
                      <p className="account__details--desc">Loading orders...</p>
                    ) : orders.length === 0 ? (
                      <p className="account__details--desc">No orders yet.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Order</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order._id}>
                                <td>#{order._id?.slice(-6) || order._id}</td>
                                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                                <td>{order.status}</td>
                                <td>₹{order.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
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

export default MyAccount
