import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import NewsletterBanner from '../components/NewsletterBanner'
import { useAuth } from '../context/AuthContext'
import { accountAPI } from '../services/api'

const defaultAddress = {
  label: 'Home',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'India',
  isDefault: false,
}

const MyAccount2 = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [form, setForm] = useState({ ...defaultAddress })
  const [error, setError] = useState('')

  const fetchAddresses = async () => {
    try {
      const res = await accountAPI.getAddresses()
      setAddresses(res.data || [])
    } catch {
      setAddresses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchAddresses()
    else setLoading(false)
  }, [user])

  const openAddForm = () => {
    setForm({ ...defaultAddress })
    setEditingIndex(null)
    setError('')
    setShowForm(true)
  }

  const openEditForm = (index) => {
    setForm({ ...addresses[index] })
    setEditingIndex(index)
    setError('')
    setShowForm(true)
  }

  const handleDelete = (index) => {
    const updated = addresses.filter((_, i) => i !== index)
    setSaving(true)
    accountAPI.updateAddresses({ addresses: updated })
      .then(() => setAddresses(updated))
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false))
  }

  const handleSetDefault = (index) => {
    const updated = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }))
    setSaving(true)
    accountAPI.updateAddresses({ addresses: updated })
      .then(() => setAddresses(updated))
      .catch((err) => setError(err.message))
      .finally(() => setSaving(false))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.street || !form.city || !form.state || !form.zip) {
      setError('Please fill in all required fields')
      return
    }
    setSaving(true)
    setError('')
    try {
      let updated
      if (editingIndex !== null) {
        updated = addresses.map((addr, i) => (i === editingIndex ? form : addr))
      } else {
        const newAddr = form.isDefault
          ? form
          : { ...form, isDefault: addresses.length === 0 }
        if (newAddr.isDefault) {
          updated = [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
        } else {
          updated = [...addresses, newAddr]
        }
      }
      await accountAPI.updateAddresses({ addresses: updated })
      setAddresses(updated)
      setShowForm(false)
      setEditingIndex(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <main className="main__content_wrapper">
      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">My Addresses</h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items"><Link className="text-white" to="/">Home</Link></li>
                  <li className="breadcrumb__content--menu__items"><span className="text-white">My Addresses</span></li>
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
                    <p className="account__details--desc">Please <Link to="/login">log in</Link> to manage your addresses.</p>
                  </>
                ) : (
                  <>
                    <div className="d-flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <h3 className="account__content--title mb-0">Saved Addresses</h3>
                      {!showForm && (
                        <button className="new__address--btn" onClick={openAddForm}
                          style={{ padding: '10px 25px', background: 'var(--secondary-color)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1.4rem', fontWeight: 600, cursor: 'pointer' }}>
                          + Add New Address
                        </button>
                      )}
                    </div>

                    {error && (
                      <div style={{ padding: '12px 16px', background: '#fff0f0', color: '#d32f2f', borderRadius: 6, marginBottom: 20, fontSize: '1.3rem' }}>
                        {error}
                      </div>
                    )}

                    {loading ? (
                      <p className="account__details--desc">Loading addresses...</p>
                    ) : showForm ? (
                      <form onSubmit={handleSubmit} className="account__address--form">
                        <div className="account__address--form-grid">
                          <div className="form-group">
                            <label>Label *</label>
                            <select name="label" value={form.label} onChange={handleChange} required>
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="form-group full-width">
                            <label>Street Address *</label>
                            <input name="street" value={form.street} onChange={handleChange} placeholder="House number, street name, area" required />
                          </div>
                          <div className="form-group">
                            <label>City *</label>
                            <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
                          </div>
                          <div className="form-group">
                            <label>State *</label>
                            <input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
                          </div>
                          <div className="form-group">
                            <label>ZIP / Pincode *</label>
                            <input name="zip" value={form.zip} onChange={handleChange} placeholder="Pincode" required />
                          </div>
                          <div className="form-group">
                            <label>Country</label>
                            <input name="country" value={form.country} onChange={handleChange} placeholder="Country" />
                          </div>
                          <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input type="checkbox" name="isDefault" id="isDefault" checked={form.isDefault} onChange={handleChange} style={{ width: 18, height: 18 }} />
                            <label htmlFor="isDefault" style={{ margin: 0, fontSize: '1.4rem' }}>Set as default address</label>
                          </div>
                        </div>
                        <div className="account__details--footer d-flex">
                          <button type="submit" className="account__details--footer__btn" disabled={saving}
                            style={{ background: 'var(--secondary-color)', color: '#fff', border: 'none' }}>
                            {saving ? 'Saving...' : editingIndex !== null ? 'Update Address' : 'Save Address'}
                          </button>
                          <button type="button" className="account__details--footer__btn" onClick={() => { setShowForm(false); setError('') }}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : addresses.length === 0 ? (
                      <div className="account__details">
                        <h4 className="account__details--title">No Addresses Yet</h4>
                        <p className="account__details--desc">You haven't saved any addresses. Click "Add New Address" to add one.</p>
                      </div>
                    ) : (
                      <div className="account__addresses--list">
                        {addresses.map((addr, index) => (
                          <div key={index} className={`account__address--card ${addr.isDefault ? 'default' : ''}`}>
                            <div className="account__address--card-header">
                              <span className="account__address--label">{addr.label}</span>
                              {addr.isDefault && <span className="account__address--default-badge">Default</span>}
                            </div>
                            <p className="account__address--details">
                              {addr.street}<br />
                              {addr.city}, {addr.state} - {addr.zip}<br />
                              {addr.country}
                            </p>
                            <div className="account__address--card-actions">
                              <button onClick={() => openEditForm(index)} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '6px 16px', borderRadius: 4, cursor: 'pointer', fontSize: '1.3rem' }}>
                                Edit
                              </button>
                              {!addr.isDefault && (
                                <button onClick={() => handleSetDefault(index)} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '6px 16px', borderRadius: 4, cursor: 'pointer', fontSize: '1.3rem' }}>
                                  Set Default
                                </button>
                              )}
                              <button onClick={() => handleDelete(index)} style={{ background: 'none', border: '1px solid #d32f2f', color: '#d32f2f', padding: '6px 16px', borderRadius: 4, cursor: 'pointer', fontSize: '1.3rem' }}>
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
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

export default MyAccount2
