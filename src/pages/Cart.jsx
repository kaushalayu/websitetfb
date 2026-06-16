import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderAPI , getImageUrl } from '../services/api'
import NewsletterBanner from '../components/NewsletterBanner'
const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState('')

  const handleApplyCoupon = async () => {
    try {
      const res = await orderAPI.validateCoupon(couponCode)
      setCouponMsg(res.message || 'Coupon applied successfully!')
    } catch (err) {
      setCouponMsg(err.message || 'Invalid coupon code')
    }
  }

  const handleClearCart = () => {
    clearCart()
  }

  const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`

  return <>
    <main className="main__content_wrapper">
{/* Start breadcrumb section */}

        <section className="breadcrumb__section breadcrumb__bg">

            <div className="container-fluid">

                <div className="row row-cols-1">

                    <div className="col">

                        <div className="breadcrumb__content">

                            <h1 className="breadcrumb__content--title text-white mb-10">Shopping Cart</h1>

                            <ul className="breadcrumb__content--menu d-flex">

                                <li className="breadcrumb__content--menu__items"><Link className="text-white" to="/">Home</Link></li>

                                <li className="breadcrumb__content--menu__items"><span className="text-white">Shopping Cart</span></li>

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        {/* End breadcrumb section */}



        {/* cart section start */}

        <section className="cart__section section--padding">

            <div className="container-fluid">

                <div className="cart__section--inner">

                    <form onSubmit={(e) => e.preventDefault()}>

                        <h2 className="cart__title mb-40">Shopping Cart</h2>

                        <div className="row">

                            <div className="col-lg-8">

                                <div className="cart__table">

                                    <table className="cart__table--inner">

                                        <thead className="cart__table--header">

                                            <tr className="cart__table--header__items">

                                                <th className="cart__table--header__list">Product</th>

                                                <th className="cart__table--header__list">Price</th>

                                                <th className="cart__table--header__list">Quantity</th>

                                                <th className="cart__table--header__list">Total</th>

                                            </tr>

                                        </thead>

                                        <tbody className="cart__table--body">

                                          {items.length === 0 && (
                                            <tr className="cart__table--body__items">
                                              <td className="cart__table--body__list" colSpan="4">
                                                <p style={{ textAlign: 'center', padding: '40px 0' }}>Your cart is empty.</p>
                                              </td>
                                            </tr>
                                          )}

                                          {items.map((item) => (
                                            <tr className="cart__table--body__items" key={item.variantKey}>

                                                <td className="cart__table--body__list">

                                                    <div className="cart__product d-flex align-items-center">

                                                        <button className="cart__remove--btn" aria-label="search button" type="button" onClick={() => removeItem(item.variantKey)}><svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="16px" height="16px"><path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"/></svg></button>

                                                        <div className="cart__thumbnail">

                                                            <Link to={`/product-variable?slug=${item.product.slug}`}><img className="border-radius-5" src={getImageUrl(item.image || item.product.images?.[0]?.url, 'assets/img/product/product1.webp')} alt="cart-product" onError={e=>{e.target.onerror=null;e.target.src='assets/img/product/product1.webp'}} /></Link>

                                                        </div>

                                                        <div className="cart__content">

                                                            <h4 className="cart__content--title"><Link to={`/product-variable?slug=${item.product.slug}`}>{item.product.title || item.product.name}</Link></h4>

                                                            {item.selectedColor && <span className="cart__content--variant">COLOR: {item.selectedColor}</span>}

                                                            {item.selectedSize && <span className="cart__content--variant">WEIGHT: {item.selectedSize}</span>}

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="cart__table--body__list">

                                                    <span className="cart__price">{formatPrice(item.product.salePrice || item.product.price)}</span>

                                                </td>

                                                <td className="cart__table--body__list">

                                                    <div className="quantity__box">

                                                        <button type="button" className="quantity__value quickview__value--quantity decrease" aria-label="quantity value" value="Decrease Value" onClick={() => updateQuantity(item.variantKey, item.quantity - 1)}>-</button>

                                                        <label>

                                                            <input type="number" className="quantity__number quickview__value--number" value={item.quantity} onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v >= 0) updateQuantity(item.variantKey, v) }} />

                                                        </label>

                                                        <button type="button" className="quantity__value quickview__value--quantity increase" aria-label="quantity value" value="Increase Value" onClick={() => updateQuantity(item.variantKey, item.quantity + 1)}>+</button>

                                                    </div>

                                                </td>

                                                <td className="cart__table--body__list">

                                                    <span className="cart__price end">{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</span>

                                                </td>

                                            </tr>
                                          ))}

                                        </tbody>

                                    </table>

                                    <div className="continue__shopping d-flex justify-content-between">

                                        <Link className="continue__shopping--link" to="/shop">Continue shopping</Link>

                                        <button className="continue__shopping--clear" type="button" onClick={handleClearCart}>Clear Cart</button>

                                    </div>

                                </div>

                            </div>

                            <div className="col-lg-4">

                                <div className="cart__summary border-radius-10">

                                    <div className="coupon__code mb-30">

                                        <h3 className="coupon__code--title">Coupon</h3>

                                        <p className="coupon__code--desc">Enter your coupon code if you have one.</p>

                                        <div className="coupon__code--field d-flex">

                                            <label>

                                                <input className="coupon__code--field__input border-radius-5" placeholder="Coupon code" type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />

                                            </label>

                                            <button className="coupon__code--field__btn primary__btn" type="button" onClick={handleApplyCoupon}>Apply Coupon</button>

                                        </div>

                                        {couponMsg && <p style={{ marginTop: 8, fontSize: 13, color: couponMsg.includes('Invalid') ? 'red' : 'green' }}>{couponMsg}</p>}

                                    </div>

                                    <div className="cart__note mb-20">

                                        <h3 className="cart__note--title">Note</h3>

                                        <p className="cart__note--desc">Add special instructions for your seller...</p>

                                        <textarea className="cart__note--textarea border-radius-5"></textarea>

                                    </div>

                                    <div className="cart__summary--total mb-20">

                                        <table className="cart__summary--total__table">

                                            <tbody>

                                                <tr className="cart__summary--total__list">

                                                    <td className="cart__summary--total__title text-left">SUBTOTAL</td>

                                                    <td className="cart__summary--amount text-right">{formatPrice(subtotal)}</td>

                                                </tr>

                                                <tr className="cart__summary--total__list">

                                                    <td className="cart__summary--total__title text-left">GRAND TOTAL</td>

                                                    <td className="cart__summary--amount text-right">{formatPrice(subtotal)}</td>

                                                </tr>

                                            </tbody>

                                        </table>

                                    </div>

                                    <div className="cart__summary--footer">

                                        <p className="cart__summary--footer__desc">Shipping & taxes calculated at checkout</p>

                                        <ul className="d-flex justify-content-between">

                                            <li><button className="cart__summary--footer__btn primary__btn cart" type="submit">Update Cart</button></li>

                                            <li><Link className="cart__summary--footer__btn primary__btn checkout" to="/checkout">Check Out</Link></li>

                                        </ul>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </section>

        {/* cart section end */}





        {/* Start Newsletter banner section */}
        <NewsletterBanner bgImage="assets/img/banner/banner-bg2.webp" fluid />
        {/* End Newsletter banner section */}


        {/* Start brand logo section */}

        <div className="brand__logo--section bg__secondary section--padding">

            <div className="container-fluid">

                <div className="row row-cols-1">

                    <div className="col">

                        <div className="brand__logo--section__inner d-flex justify-content-center align-items-center">

                            <div className="brand__logo--items">

                                <img className="brand__logo--items__thumbnail--img" src="assets/img/logo/brand-logo1.webp" alt="brand logo" />

                            </div>

                            <div className="brand__logo--items">

                                <img className="brand__logo--items__thumbnail--img" src="assets/img/logo/brand-logo2.webp" alt="brand logo" />

                            </div>

                            <div className="brand__logo--items">

                                <img className="brand__logo--items__thumbnail--img" src="assets/img/logo/brand-logo3.webp" alt="brand logo" />

                            </div>

                            <div className="brand__logo--items">

                                <img className="brand__logo--items__thumbnail--img" src="assets/img/logo/brand-logo4.webp" alt="brand logo" />

                            </div>

                            <div className="brand__logo--items">

                                <img className="brand__logo--items__thumbnail--img" src="assets/img/logo/brand-logo5.webp" alt="brand logo" />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        {/* End brand logo section */}
    </main>
  </>;
};

export default Cart;
