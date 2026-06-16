import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI , getImageUrl } from '../services/api'
import NewsletterBanner from '../components/NewsletterBanner'

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'India',
    postalCode: '',
    orderNotes: '',
  })
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleCheckout = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const orderData = {
        items: items.map((i) => ({
          product: i.product._id,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
        })),
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode,
        },
        orderNotes: formData.orderNotes,
        couponCode,
      }
      await orderAPI.create(orderData)
      clearCart()
      navigate('/my-account')
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    orderAPI.validateCoupon(couponCode).then((res) => {
      alert(res.message || 'Coupon applied!')
    }).catch((err) => {
      alert(err.message || 'Invalid coupon code')
    })
  }

  const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`

  return <>
    <main className="main__content_wrapper">
{/* Start breadcrumb section */}

        <section className="breadcrumb__section breadcrumb__bg">

            <div className="container">

                <div className="row row-cols-1">

                    <div className="col">

                        <div className="breadcrumb__content">

                            <h1 className="breadcrumb__content--title text-white mb-10">Checkout</h1>

                            <ul className="breadcrumb__content--menu d-flex">

                                <li className="breadcrumb__content--menu__items"><Link className="text-white" to="/">Home</Link></li>

                                <li className="breadcrumb__content--menu__items"><span className="text-white">Checkout</span></li>

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        {/* End breadcrumb section */}



        {/* Start checkout page area */}

        <div className="checkout__page--area section--padding">

            <div className="container">

                <div className="row">

                    <div className="col-lg-7 col-md-6">

                        <div className="main checkout__mian">

                            <form onSubmit={handleCheckout} id="checkoutForm">

                                <div className="checkout__content--step section__contact--information">

                                    <div className="section__header checkout__section--header d-flex align-items-center justify-content-between mb-25">

                                        <h2 className="section__header--title h3">Contact information</h2>

                                        <p className="layout__flex--item">

                                            Already have an account?

                                            <Link className="layout__flex--item__link" to="/login">Log in</Link>  

                                        </p>

                                    </div>

                                    <div className="customer__information">

                                        <div className="checkout__email--phone mb-12">

                                            <input className="checkout__input--field border-radius-5" placeholder="Email or mobile phone number" type="text" value={formData.email} onChange={update('email')} />

                                        </div>

                                        <div className="checkout__checkbox">

                                            <input className="checkout__checkbox--input" id="check1" type="checkbox" />

                                            <span className="checkout__checkbox--checkmark"></span>

                                            <label className="checkout__checkbox--label" htmlFor="check1">

                                                Email me with news and offers</label>

                                        </div>

                                    </div>

                                </div>

                                <div className="checkout__content--step section__shipping--address">

                                    <div className="section__header mb-25">

                                        <h2 className="section__header--title h3">Billing Details</h2>

                                    </div>

                                    <div className="section__shipping--address__content">

                                        <div className="row">

                                            <div className="col-lg-6 col-md-6 mb-20">

                                                <div className="checkout__input--list ">

                                                    <label className="checkout__input--label mb-5" htmlFor="input1">Fist Name <span className="checkout__input--label__star">*</span></label>

                                                    <input className="checkout__input--field border-radius-5" placeholder="First name (optional)" id="input1" type="text" value={formData.firstName} onChange={update('firstName')} />

                                                </div>

                                            </div>

                                            <div className="col-lg-6 col-md-6 mb-20">

                                                <div className="checkout__input--list">

                                                    <label className="checkout__input--label mb-5" htmlFor="input2">Last Name <span className="checkout__input--label__star">*</span></label>

                                                    <input className="checkout__input--field border-radius-5" placeholder="Last name" id="input2" type="text" value={formData.lastName} onChange={update('lastName')} />

                                                </div>

                                            </div>

                                            <div className="col-12 mb-20">

                                                <div className="checkout__input--list">

                                                    <label className="checkout__input--label mb-5" htmlFor="input3">Company Name <span className="checkout__input--label__star">*</span></label>

                                                    <input className="checkout__input--field border-radius-5" placeholder="Company (optional)" id="input3" type="text" />

                                                </div>

                                            </div>

                                            <div className="col-12 mb-20">

                                                <div className="checkout__input--list">

                                                    <label className="checkout__input--label mb-5" htmlFor="input4">Address <span className="checkout__input--label__star">*</span></label>

                                                    <input className="checkout__input--field border-radius-5" placeholder="Address1" id="input4" type="text" value={formData.address} onChange={update('address')} />

                                                </div>

                                            </div>

                                            <div className="col-12 mb-20">

                                                <div className="checkout__input--list">

                                                    <input className="checkout__input--field border-radius-5" placeholder="Apartment, suite, etc. (optional)" type="text" />

                                                </div>

                                            </div>

                                            <div className="col-12 mb-20">

                                                <div className="checkout__input--list">

                                                    <label className="checkout__input--label mb-5" htmlFor="input5">Town/City <span className="checkout__input--label__star">*</span></label>

                                                    <input className="checkout__input--field border-radius-5" placeholder="City" id="input5" type="text" value={formData.city} onChange={update('city')} />

                                                </div>

                                            </div>

                                            <div className="col-lg-6 mb-20">

                                                <div className="checkout__input--list">

                                                    <label className="checkout__input--label mb-5" htmlFor="country">Country/region <span className="checkout__input--label__star">*</span></label>

                                                    <div className="checkout__input--select select">

                                                        <select className="checkout__input--select__field border-radius-5" id="country" value={formData.country} onChange={update('country')}>

                                                            <option value="India">India</option>

                                                            <option value="United States">United States</option>

                                                            <option value="Netherlands">Netherlands</option>

                                                            <option value="Afghanistan">Afghanistan</option>

                                                            <option value="Islands">Islands</option>

                                                            <option value="Albania">Albania</option>

                                                            <option value="Antigua Barbuda">Antigua Barbuda</option>

                                                        </select>

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="col-lg-6 mb-20">

                                                <div className="checkout__input--list">

                                                    <label className="checkout__input--label mb-5" htmlFor="input6">Postal Code <span className="checkout__input--label__star">*</span></label>

                                                    <input className="checkout__input--field border-radius-5" placeholder="Postal code" id="input6" type="text" value={formData.postalCode} onChange={update('postalCode')} />

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <details>

                                        <summary className="checkout__checkbox mb-20">

                                            <input className="checkout__checkbox--input" type="checkbox" />

                                            <span className="checkout__checkbox--checkmark"></span>

                                            <span className="checkout__checkbox--label">Ship to a different address?</span>

                                        </summary>

                                        <div className="section__shipping--address__content">

                                            <div className="row">

                                                <div className="col-lg-6 col-md-6 mb-20">

                                                    <div className="checkout__input--list ">

                                                        <label className="checkout__input--label mb-5" htmlFor="input7">Fist Name <span className="checkout__input--label__star">*</span></label>

                                                        <input className="checkout__input--field border-radius-5" placeholder="First name (optional)" id="input7"  type="text" />

                                                    </div>

                                                </div>

                                                <div className="col-lg-6 col-md-6 mb-20">

                                                    <div className="checkout__input--list">

                                                        <label className="checkout__input--label mb-5" htmlFor="input8">Last Name <span className="checkout__input--label__star">*</span></label>

                                                        <input className="checkout__input--field border-radius-5" placeholder="Last name" id="input8"  type="text" />

                                                    </div>

                                                </div>

                                                <div className="col-12 mb-20">

                                                    <div className="checkout__input--list">

                                                        <label className="checkout__input--label mb-5" htmlFor="input9">Company Name <span className="checkout__input--label__star">*</span></label>

                                                        <input className="checkout__input--field border-radius-5" placeholder="Company (optional)" id="input9" type="text" />

                                                    </div>

                                                </div>

                                                <div className="col-12 mb-20">

                                                    <div className="checkout__input--list">

                                                        <label className="checkout__input--label mb-5" htmlFor="input10">Address <span className="checkout__input--label__star">*</span></label>

                                                        <input className="checkout__input--field border-radius-5" placeholder="Address1" id="input10" type="text" />

                                                    </div>

                                                </div>

                                                <div className="col-12 mb-20">

                                                    <div className="checkout__input--list">

                                                        <input className="checkout__input--field border-radius-5" placeholder="Apartment, suite, etc. (optional)"  type="text" />

                                                    </div>

                                                </div>

                                                <div className="col-12 mb-20">

                                                    <div className="checkout__input--list">

                                                        <label className="checkout__input--label mb-5" htmlFor="input11">Town/City <span className="checkout__input--label__star">*</span></label>

                                                        <input className="checkout__input--field border-radius-5" placeholder="City" id="input11" type="text" />

                                                    </div>

                                                </div>

                                                <div className="col-lg-6 mb-20">

                                                    <div className="checkout__input--list">

                                                        <label className="checkout__input--label mb-5" htmlFor="country2">Country/region <span className="checkout__input--label__star">*</span></label>

                                                        <div className="checkout__input--select select">

                                                            <select className="checkout__input--select__field border-radius-5" id="country2">

                                                                <option value="1">India</option>

                                                                <option value="2">United States</option>

                                                                <option value="3">Netherlands</option>

                                                                <option value="4">Afghanistan</option>

                                                                <option value="5">Islands</option>

                                                                <option value="6">Albania</option>

                                                                <option value="7">Antigua Barbuda</option>

                                                            </select>

                                                        </div>

                                                    </div>

                                                </div>

                                                <div className="col-lg-6 mb-20">

                                                    <div className="checkout__input--list">

                                                        <label className="checkout__input--label mb-5" htmlFor="input12">Postal Code <span className="checkout__input--label__star">*</span></label>

                                                        <input className="checkout__input--field border-radius-5" placeholder="Postal code" id="input12" type="text" />

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </details>

                                    <div className="checkout__checkbox">

                                        <input className="checkout__checkbox--input" id="checkbox2" type="checkbox" />

                                        <span className="checkout__checkbox--checkmark"></span>

                                        <label className="checkout__checkbox--label" htmlFor="checkbox2">

                                            Save this information for next time</label>

                                    </div>

                                </div>

                                <div className="order-notes mb-20">

                                    <label className="checkout__input--label mb-5" htmlFor="order">Order Notes <span className="checkout__input--label__star">*</span></label>

                                   <textarea className="checkout__notes--textarea__field border-radius-5" id="order" placeholder="Notes about your order, e.g. special notes for delivery." spellcheck="false" value={formData.orderNotes} onChange={update('orderNotes')}></textarea>

                                </div>

                                <div className="checkout__content--step__footer d-flex align-items-center">

                                    <Link className="continue__shipping--btn primary__btn border-radius-5" to="/">Continue To Shipping</Link>

                                    <Link className="previous__link--content" to="/cart">Return to cart</Link>

                                </div>

                            </form>

                        </div>

                    </div>

                    <div className="col-lg-5 col-md-6">

                        <aside className="checkout__sidebar sidebar border-radius-10">

                            <h2 className="checkout__order--summary__title text-center mb-15">Your Order Summary</h2>

                            <div className="cart__table checkout__product--table">

                                <table className="cart__table--inner">

                                    <tbody className="cart__table--body">

                                      {items.map((item) => (
                                        <tr className="cart__table--body__items" key={item.variantKey}>

                                            <td className="cart__table--body__list">

                                                <div className="product__image two  d-flex align-items-center">

                                                    <div className="product__thumbnail border-radius-5">

                                                        <Link className="display-block" to={`/product-variable?slug=${item.product.slug}`}><img className="display-block border-radius-5" src={getImageUrl(item.image || item.product.images?.[0]?.url, 'assets/img/product/small-product1.webp')} alt="cart-product" onError={e=>{e.target.onerror=null;e.target.src='assets/img/product/small-product1.webp'}} /></Link>

                                                        <span className="product__thumbnail--quantity">{item.quantity}</span>

                                                    </div>

                                                    <div className="product__description">

                                                        <h4 className="product__description--name"><Link to={`/product-variable?slug=${item.product.slug}`}>{item.product.title || item.product.name}</Link></h4>

                                                        {item.selectedColor && <span className="product__description--variant">COLOR: {item.selectedColor}</span>}

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="cart__table--body__list">

                                                <span className="cart__price">{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</span>

                                            </td>

                                        </tr>
                                      ))}

                                    </tbody>

                                </table>

                            </div>

                            <div className="checkout__discount--code">

                                <form className="d-flex" onSubmit={handleApplyCoupon}>

                                    <label>

                                        <input className="checkout__discount--code__input--field border-radius-5" placeholder="Gift card or discount code" type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />

                                    </label>

                                    <button className="checkout__discount--code__btn primary__btn border-radius-5" type="submit">Apply</button>

                                </form>

                            </div>

                            <div className="checkout__total">

                                <table className="checkout__total--table">

                                    <tbody className="checkout__total--body">

                                        <tr className="checkout__total--items">

                                            <td className="checkout__total--title text-left">Subtotal </td>

                                            <td className="checkout__total--amount text-right">{formatPrice(subtotal)}</td>

                                        </tr>

                                        <tr className="checkout__total--items">

                                            <td className="checkout__total--title text-left">Shipping</td>

                                            <td className="checkout__total--calculated__text text-right">Calculated at next step</td>

                                        </tr>

                                    </tbody>

                                    <tfoot className="checkout__total--footer">

                                        <tr className="checkout__total--footer__items">

                                            <td className="checkout__total--footer__title checkout__total--footer__list text-left">Total </td>

                                            <td className="checkout__total--footer__amount checkout__total--footer__list text-right">{formatPrice(subtotal)}</td>

                                        </tr>

                                    </tfoot>

                                </table>

                            </div>

                            <div style={{ marginTop: 16, padding: '16px 20px', background: '#fef9e7', borderRadius: 8, border: '1px solid #f0e5c9' }}>
                                <p style={{ fontSize: 14, color: '#8a6d3b', margin: 0 }}><strong>Total Amount:</strong> {formatPrice(subtotal)}</p>
                            </div>

                            {error && <p style={{ color: 'red', marginBottom: 10, fontSize: 14 }}>{error}</p>}

                            <button className="checkout__now--btn primary__btn" type="submit" disabled={loading} form="checkoutForm">{loading ? 'Placing Order...' : 'Place Order'}</button>

                        </aside>

                    </div>

                    

                </div>

            </div>

        </div>

        {/* End checkout page area */}



        <NewsletterBanner />
    </main>
  </>;
};

export default Checkout;
