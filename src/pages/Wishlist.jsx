import { Link } from 'react-router-dom'

import NewsletterBanner from '../components/NewsletterBanner'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

const Wishlist = () => {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()

  return <>
    <main className="main__content_wrapper">

        {/* Start breadcrumb section */}

        <section className="breadcrumb__section breadcrumb__bg">

            <div className="container">

                <div className="row row-cols-1">

                    <div className="col">

                        <div className="breadcrumb__content">

                            <h1 className="breadcrumb__content--title text-white mb-10">Wishlist</h1>

                            <ul className="breadcrumb__content--menu d-flex">

                                <li className="breadcrumb__content--menu__items"><Link to="/" className="text-white" >Home</Link></li>

                                <li className="breadcrumb__content--menu__items"><span className="text-white">Wishlist</span></li>

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        {/* End breadcrumb section */}

        {/* cart section start */}

        <section className="cart__section section--padding">

            <div className="container">

                <div className="cart__section--inner">

                    <form action="#">

                        <h2 className="cart__title mb-40">Wishlist</h2>

                        <div className="cart__table">

                            <table className="cart__table--inner">

                                <thead className="cart__table--header">

                                    <tr className="cart__table--header__items">

                                        <th className="cart__table--header__list">Product</th>

                                        <th className="cart__table--header__list">Price</th>

                                        <th className="cart__table--header__list text-center">STOCK STATUS</th>

                                        <th className="cart__table--header__list text-right">ADD TO CART</th>

                                    </tr>

                                </thead>

                                <tbody className="cart__table--body">

                                    {items.map((product) => (
                                      <tr className="cart__table--body__items" key={product._id}>

                                        <td className="cart__table--body__list">

                                            <div className="cart__product d-flex align-items-center">

                                                <button className="cart__remove--btn" aria-label="search button" type="button" onClick={() => removeItem(product._id)}><svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="16px" height="16px"><path d="M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z"/></svg></button>

                                                <div className="cart__thumbnail">

                                                    <Link to={`/product-variable?slug=${product.slug}`} ><img className="border-radius-5" src={getImageUrl(product.images?.[0]?.url, 'assets/img/product/product1.webp')} alt={product.title} onError={e=>{e.target.onerror=null;e.target.src='assets/img/product/product1.webp'}} /></Link>

                                                </div>

                                                <div className="cart__content">

                                                    <h4 className="cart__content--title"><Link to={`/product-variable?slug=${product.slug}`} >{product.title}</Link></h4>

                                                    {product.colors?.length > 0 && (
                                                      <span className="cart__content--variant">COLOR: {product.colors[0]}</span>
                                                    )}

                                                </div>

                                            </div>

                                        </td>

                                        <td className="cart__table--body__list">

                                            <span className="cart__price">₹{Number(product.salePrice || product.price).toLocaleString('en-IN')}</span>

                                        </td>

                                        <td className="cart__table--body__list text-center">

                                            <span className="in__stock text__secondary">in stock</span>

                                        </td>

                                        <td className="cart__table--body__list text-right">

                                            <button className="wishlist__cart--btn primary__btn" onClick={() => addItem(product, 1)} >Add To Cart</button>

                                        </td>

                                    </tr>
                                    ))}

                                </tbody>

                            </table>

                            <div className="continue__shopping d-flex justify-content-between">

                                <Link to="/" className="continue__shopping--link" >Continue shopping</Link>

                                <Link to="/shop" className="continue__shopping--clear" >View All Products</Link>

                            </div>

                        </div>

                    </form>

                </div>

            </div>

        </section>

        {/* cart section end */}

        <NewsletterBanner />

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

export default Wishlist;
