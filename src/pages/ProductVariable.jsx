import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { productAPI, reviewAPI , getImageUrl } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import NewsletterBanner from '../components/NewsletterBanner'

const StarIcon = ({ fill = 'currentColor' }) => (
  <svg className="rating__list--icon__svg" xmlns="http://www.w3.org/2000/svg" width="13.105" height="13.732" viewBox="0 0 10.105 9.732">
    <path data-name="star - Copy" d="M9.837,3.5,6.73,3.039,5.338.179a.335.335,0,0,0-.571,0L3.375,3.039.268,3.5a.3.3,0,0,0-.178.514L2.347,6.242,1.813,9.4a.314.314,0,0,0,.464.316L5.052,8.232,7.827,9.712A.314.314,0,0,0,8.292,9.4L7.758,6.242l2.257-2.231A.3.3,0,0,0,9.837,3.5Z" transform="translate(0 -0.018)" fill={fill}></path>
  </svg>
)

const renderStars = (rating) => {
  const stars = []
  const full = Math.floor(rating)
  for (let i = 0; i < 5; i++) {
    stars.push(
      <li className="rating__list" key={i}>
        <span className="rating__list--icon">
          <StarIcon fill={i < full ? 'currentColor' : 'none'} />
        </span>
      </li>
    )
  }
  return stars
}

const ProductVariable = () => {
  const { slug: paramSlug } = useParams()
  const [searchParams] = useSearchParams()
  const slug = paramSlug || searchParams.get('slug')

  const { addItem } = useCart()
  const { user } = useAuth()
  const { isInWishlist, addItem: addWishlist, removeItem: removeWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  const [reviewName, setReviewName] = useState('')
  const [reviewEmail, setReviewEmail] = useState(user?.email || '')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewContent, setReviewContent] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    if (!slug) return
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [productRes, relatedRes, reviewsRes] = await Promise.all([
          productAPI.getBySlug(slug),
          productAPI.getRelated(slug),
          reviewAPI.getProductReviews(slug)
        ])
        setProduct(productRes.data)
        setRelatedProducts(relatedRes.data || [])
        if (reviewsRes.data) {
          setReviews(reviewsRes.data.reviews || [])
          setAverageRating(reviewsRes.data.averageRating || 0)
          setTotalReviews(reviewsRes.data.totalReviews || 0)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  useEffect(() => {
    if (product?.colors?.length) setSelectedColor(product.colors[0])
    if (product?.sizes?.length) setSelectedSize(product.sizes[0])
  }, [product])

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (product) addItem(product, quantity, selectedColor, selectedSize)
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    try {
      if (isInWishlist(product._id)) {
        await removeWishlist(product._id)
      } else {
        await addWishlist(product._id)
      }
    } catch {}
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!slug) return
    setSubmittingReview(true)
    try {
      await reviewAPI.submit(slug, { name: reviewName, email: reviewEmail, rating: reviewRating, content: reviewContent })
      setReviewSubmitted(true)
      setReviewName('')
      setReviewEmail(user?.email || '')
      setReviewRating(5)
      setReviewContent('')
      const reviewsRes = await reviewAPI.getProductReviews(slug)
      if (reviewsRes.data) {
        setReviews(reviewsRes.data.reviews || [])
        setAverageRating(reviewsRes.data.averageRating || 0)
        setTotalReviews(reviewsRes.data.totalReviews || 0)
      }
    } catch {}
    setSubmittingReview(false)
  }

  if (loading) {
    return (
      <main className="main__content_wrapper">
        <section className="breadcrumb__section breadcrumb__bg">
          <div className="container">
            <div className="row row-cols-1">
              <div className="col">
                <div className="breadcrumb__content">
                  <h1 className="breadcrumb__content--title text-white mb-10">Product Details</h1>
                  <ul className="breadcrumb__content--menu d-flex">
                    <li className="breadcrumb__content--menu__items"><Link to="/" className="text-white">Home</Link></li>
                    <li className="breadcrumb__content--menu__items"><span className="text-white">Product Details</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="container text-center py-5"><h3>Loading...</h3></div>
        <NewsletterBanner />
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="main__content_wrapper">
        <section className="breadcrumb__section breadcrumb__bg">
          <div className="container">
            <div className="row row-cols-1">
              <div className="col">
                <div className="breadcrumb__content">
                  <h1 className="breadcrumb__content--title text-white mb-10">Product Details</h1>
                  <ul className="breadcrumb__content--menu d-flex">
                    <li className="breadcrumb__content--menu__items"><Link to="/" className="text-white">Home</Link></li>
                    <li className="breadcrumb__content--menu__items"><span className="text-white">Product Details</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="container text-center py-5"><h3>{error || 'Product not found'}</h3></div>
        <NewsletterBanner />
      </main>
    )
  }

  const images = product.images?.length ? product.images : [{ url: 'assets/img/product/big-product1.webp' }]
  const currentPrice = product.salePrice || product.price
  const hasSale = !!product.salePrice

  return (
    <main className="main__content_wrapper">

      {/* Start breadcrumb section */}

      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">Product Details</h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items"><Link to="/" className="text-white">Home</Link></li>
                  <li className="breadcrumb__content--menu__items"><span className="text-white">Product Details</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* End breadcrumb section */}

      {/* Start product details section */}

      <section className="product__details--section section--padding">
        <div className="container">
          <div className="row row-cols-lg-2 row-cols-md-2">

            <div className="col">
              <div className="product__details--media">
                <div className="product__media--preview">
                  <div className="product__media--preview__items">
                    <img className="product__media--preview__items--img" src={getImageUrl(images[0]?.url || images[0], 'assets/img/product/product1.webp')} alt="product-media-img" />
                    <div className="product__media--view__icon">
                      <a className="product__media--view__icon--link glightbox" href={getImageUrl(images[0]?.url || images[0], 'assets/img/product/product1.webp')} data-gallery="product-media-preview">
                        <svg className="product__media--view__icon--svg" xmlns="http://www.w3.org/2000/svg" width="22.51" height="22.443" viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" d="M338.29 338.29L448 448"></path></svg>
                        <span className="visually-hidden">Media Gallery</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="product__details--info">
                <form onSubmit={handleAddToCart}>

                  <h2 className="product__details--info__title mb-15">{product.title}</h2>

                  <div className="product__details--info__price mb-10">
                    <span className="current__price">₹{Number(currentPrice).toLocaleString('en-IN')}</span>
                    {hasSale && <span className="old__price">₹{Number(product.price).toLocaleString('en-IN')}</span>}
                  </div>

                  <div className="product__details--info__rating d-flex align-items-center mb-15">
                    <ul className="rating product__list--rating d-flex">
                      {renderStars(averageRating)}
                      <li className="rating__list"><span className="rating__list--text">( {averageRating.toFixed(1)} )</span></li>
                    </ul>
                  </div>

                  <p className="product__details--info__desc mb-20">{product.description}</p>

                  <div className="product__variant">

                    {product.colors?.length > 0 && (
                      <div className="product__variant--list mb-20">
                        <fieldset className="variant__input--fieldset">
                          <legend className="product__variant--title mb-8">Color :</legend>
                          <div className="variant__color d-flex">
                            {product.colors.map((color, idx) => (
                              <div className="variant__color--list" key={idx}>
                                <input
                                  id={`color-${idx}`}
                                  name="color"
                                  type="radio"
                                  checked={selectedColor === color}
                                  onChange={() => setSelectedColor(color)}
                                />
                                <label className="variant__color--value red" htmlFor={`color-${idx}`} title={color}>
                                  <img className="variant__color--value__img" src={getImageUrl(images[0]?.url || images[0], 'assets/img/product/product1.webp')} alt="variant-color-img" />
                                </label>
                              </div>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    )}

                    {product.sizes?.length > 0 && (
                      <div className="product__variant--list mb-20">
                        <fieldset className="variant__input--fieldset">
                          <legend className="product__variant--title mb-8">Size :</legend>
                          <ul className="variant__size d-flex">
                            {product.sizes.map((size, idx) => (
                              <li className="variant__size--list" key={idx}>
                                <input
                                  id={`size-${idx}`}
                                  name="size"
                                  type="radio"
                                  checked={selectedSize === size}
                                  onChange={() => setSelectedSize(size)}
                                />
                                <label className="variant__size--value red" htmlFor={`size-${idx}`}>{size}</label>
                              </li>
                            ))}
                          </ul>
                        </fieldset>
                      </div>
                    )}

                    <div className="product__variant--list quantity d-flex align-items-center mb-20">
                      <div className="quantity__box">
                        <button
                          type="button"
                          className="quantity__value quickview__value--quantity decrease"
                          aria-label="quantity value"
                          value="Decrease Value"
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        >-</button>
                        <label>
                          <input
                            type="number"
                            className="quantity__number quickview__value--number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          />
                        </label>
                        <button
                          type="button"
                          className="quantity__value quickview__value--quantity increase"
                          aria-label="quantity value"
                          value="Increase Value"
                          onClick={() => setQuantity(q => q + 1)}
                        >+</button>
                      </div>
                      <button className="quickview__cart--btn primary__btn" type="submit">Add To Cart</button>
                    </div>

                    <div className="product__variant--list mb-15">
                      <button
                        type="button"
                        className={`variant__wishlist--icon mb-15 ${isInWishlist(product._id) ? 'active' : ''}`}
                        onClick={handleWishlistToggle}
                        title="Add to wishlist"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <svg className="quickview__variant--wishlist__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={isInWishlist(product._id) ? 'currentColor' : 'none'}><path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" fill={isInWishlist(product._id) ? 'currentColor' : 'none'} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg>
                        {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      </button>

                      <button className="variant__buy--now__btn primary__btn" type="submit">Buy it now</button>
                    </div>

                    <div className="product__variant--list mb-15">
                      <div className="product__details--info__meta">
                        {product.barcode && <p className="product__details--info__meta--list"><strong>Barcode:</strong> <span>{product.barcode}</span></p>}
                        {product.sku && <p className="product__details--info__meta--list"><strong>SKU:</strong> <span>{product.sku}</span> </p>}
                        {product.vendor && <p className="product__details--info__meta--list"><strong>Vendor:</strong> <span>{product.vendor}</span> </p>}
                        {product.type && <p className="product__details--info__meta--list"><strong>Type:</strong> <span>{product.type}</span> </p>}
                        {product.category && <p className="product__details--info__meta--list"><strong>Category:</strong> <span>{product.category?.name || product.category}</span> </p>}
                        {product.brand && <p className="product__details--info__meta--list"><strong>Brand:</strong> <span>{product.brand}</span> </p>}
                      </div>
                    </div>

                  </div>

                  <div className="quickview__social d-flex align-items-center mb-15">
                    <label className="quickview__social--title">Social Share:</label>
                    <ul className="quickview__social--wrapper mt-0 d-flex">
                      <li className="quickview__social--list">
                        <a className="quickview__social--icon" target="_blank" href="https://www.facebook.com">
                          <svg xmlns="http://www.w3.org/2000/svg" width="7.667" height="16.524" viewBox="0 0 7.667 16.524">
                            <path data-name="Path 237" d="M967.495,353.678h-2.3v8.253h-3.437v-8.253H960.13V350.77h1.624v-1.888a4.087,4.087,0,0,1,.264-1.492,2.9,2.9,0,0,1,1.039-1.379,3.626,3.626,0,0,1,2.153-.6l2.549.019v2.833h-1.851a.732.732,0,0,0-.472.151.8.8,0,0,0-.246.642v1.719H967.8Z" transform="translate(-960.13 -345.407)" fill="currentColor"/>
                          </svg>
                          <span className="visually-hidden">Facebook</span>
                        </a>
                      </li>
                      <li className="quickview__social--list">
                        <a className="quickview__social--icon" target="_blank" href="https://twitter.com">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16.489" height="13.384" viewBox="0 0 16.489 13.384">
                            <path data-name="Path 303" d="M966.025,1144.2v.433a9.783,9.783,0,0,1-.621,3.388,10.1,10.1,0,0,1-1.845,3.087,9.153,9.153,0,0,1-3.012,2.259,9.825,9.825,0,0,1-4.122.866,9.632,9.632,0,0,1-2.748-.4,9.346,9.346,0,0,1-2.447-1.11q.4.038.809.038a6.723,6.723,0,0,0,2.24-.376,7.022,7.022,0,0,0,1.958-1.054,3.379,3.379,0,0,1-1.958-.687,3.259,3.259,0,0,1-1.186-1.666,3.364,3.364,0,0,0,.621.056,3.488,3.488,0,0,0,.885-.113,3.267,3.267,0,0,1-1.374-.631,3.356,3.356,0,0,1-.969-1.186,3.524,3.524,0,0,1-.367-1.5v-.057a3.172,3.172,0,0,0,1.544.433,3.407,3.407,0,0,1-1.1-1.214,3.308,3.308,0,0,1-.4-1.609,3.362,3.362,0,0,1,.452-1.694,9.652,9.652,0,0,0,6.964,3.538,3.911,3.911,0,0,1-.075-.772,3.293,3.293,0,0,1,.452-1.694,3.409,3.409,0,0,1,1.233-1.233,3.257,3.257,0,0,1,1.685-.461,3.351,3.351,0,0,1,2.466,1.073,6.572,6.572,0,0,0,2.146-.828,3.272,3.272,0,0,1-.574,1.083,3.477,3.477,0,0,1-.913.8,6.869,6.869,0,0,0,1.958-.546A7.074,7.074,0,0,1,966.025,1144.2Z" transform="translate(-951.23 -1140.849)" fill="currentColor"/>
                          </svg>
                          <span className="visually-hidden">Twitter</span>
                        </a>
                      </li>
                      <li className="quickview__social--list">
                        <a className="quickview__social--icon" target="_blank" href="https://www.skype.com">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16.482" height="16.481" viewBox="0 0 16.482 16.481">
                            <path data-name="Path 284" d="M879,926.615a4.479,4.479,0,0,1,.622-2.317,4.666,4.666,0,0,1,1.676-1.677,4.482,4.482,0,0,1,2.317-.622,4.577,4.577,0,0,1,2.43.678,7.58,7.58,0,0,1,5.048.961,7.561,7.561,0,0,1,3.786,6.593,8,8,0,0,1-.094,1.206,4.676,4.676,0,0,1,.7,2.411,4.53,4.53,0,0,1-.622,2.326,4.62,4.62,0,0,1-1.686,1.686,4.626,4.626,0,0,1-4.756-.075,7.7,7.7,0,0,1-1.187.094,7.623,7.623,0,0,1-7.647-7.647,7.46,7.46,0,0,1,.094-1.187A4.424,4.424,0,0,1,879,926.615Zm4.107,1.714a2.473,2.473,0,0,0,.282,1.234,2.41,2.41,0,0,0,.782.829,5.091,5.091,0,0,0,1.215.565,15.981,15.981,0,0,0,1.582.424q.678.151.979.235a3.091,3.091,0,0,1,.593.235,1.388,1.388,0,0,1,.452.348.738.738,0,0,1,.16.481.91.91,0,0,1-.48.753,2.254,2.254,0,0,1-1.271.321,2.105,2.105,0,0,1-1.253-.292,2.262,2.262,0,0,1-.65-.838,2.42,2.42,0,0,0-.414-.546.853.853,0,0,0-.584-.17.893.893,0,0,0-.669.283.919.919,0,0,0-.273.659,1.654,1.654,0,0,0,.217.782,2.456,2.456,0,0,0,.678.763,3.64,3.64,0,0,0,1.158.574,5.931,5.931,0,0,0,1.639.235,5.767,5.767,0,0,0,2.072-.339,2.982,2.982,0,0,0,1.356-.961,2.306,2.306,0,0,0,.471-1.431,2.161,2.161,0,0,0-.443-1.375,3.009,3.009,0,0,0-1.2-.894,10.118,10.118,0,0,0-1.865-.575,11.2,11.2,0,0,1-1.309-.311,2.011,2.011,0,0,1-.8-.452.992.992,0,0,1-.3-.744,1.143,1.143,0,0,1,.565-.97,2.59,2.59,0,0,1,1.488-.386,2.538,2.538,0,0,1,1.074.188,1.634,1.634,0,0,1,.622.49,3.477,3.477,0,0,1,.414.753,1.568,1.568,0,0,0,.4.594.866.866,0,0,0,.574.2,1,1,0,0,0,.706-.254.828.828,0,0,0,.273-.631,2.234,2.234,0,0,0-.443-1.253,3.321,3.321,0,0,0-1.158-1.046,5.375,5.375,0,0,0-2.524-.527,5.764,5.764,0,0,0-2.213.386,3.161,3.161,0,0,0-1.422,1.083A2.738,2.738,0,0,0,883.106,928.329Z" transform="translate(-878.999 -922)" fill="currentColor"/>
                          </svg>
                          <span className="visually-hidden">Skype</span>
                        </a>
                      </li>
                      <li className="quickview__social--list">
                        <a className="quickview__social--icon" target="_blank" href="https://www.youtube.com">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16.49" height="11.582" viewBox="0 0 16.49 11.582">
                            <path data-name="Path 321" d="M967.759,1365.592q0,1.377-.019,1.717-.076,1.114-.151,1.622a3.981,3.981,0,0,1-.245.925,1.847,1.847,0,0,1-.453.717,2.171,2.171,0,0,1-1.151.6q-3.585.265-7.641.189-2.377-.038-3.387-.085a11.337,11.337,0,0,1-1.5-.142,2.206,2.206,0,0,1-1.113-.585,2.562,2.562,0,0,1-.528-1.037,3.523,3.523,0,0,1-.141-.585c-.032-.2-.06-.5-.085-.906a38.894,38.894,0,0,1,0-4.867l.113-.925a4.382,4.382,0,0,1,.208-.906,2.069,2.069,0,0,1,.491-.755,2.409,2.409,0,0,1,1.113-.566,19.2,19.2,0,0,1,2.292-.151q1.82-.056,3.953-.056t3.952.066q1.821.067,2.311.142a2.3,2.3,0,0,1,.726.283,1.865,1.865,0,0,1,.557.49,3.425,3.425,0,0,1,.434,1.019,5.72,5.72,0,0,1,.189,1.075q0,.095.057,1C967.752,1364.1,967.759,1364.677,967.759,1365.592Zm-7.6.925q1.49-.754,2.113-1.094l-4.434-2.339v4.66Q958.609,1367.311,960.156,1366.517Z" transform="translate(-951.269 -1359.8)" fill="currentColor"/>
                          </svg>
                          <span className="visually-hidden">Youtube</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="guarantee__safe--checkout">
                    <h5 className="guarantee__safe--checkout__title">Guaranteed Safe Checkout</h5>
                    <img className="guarantee__safe--checkout__img" src="assets/img/other/safe-checkout.webp" alt="Payment Image" />
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* End product details section */}

      {/* Start product details tab section */}

      <section className="product__details--tab__section section--padding">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">

              <ul className="product__details--tab d-flex mb-30">
                <li className={`product__details--tab__list ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</li>
                <li className={`product__details--tab__list ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Product Reviews</li>
                <li className={`product__details--tab__list ${activeTab === 'information' ? 'active' : ''}`} onClick={() => setActiveTab('information')}>Additional Info</li>
                <li className={`product__details--tab__list ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>Custom Content</li>
              </ul>

              <div className="product__details--tab__inner border-radius-10">
                <div className="tab_content">

                  {activeTab === 'description' && (
                    <div id="description" className="tab_pane active show">
                      <div className="product__tab--content">
                        <div className="product__tab--content__items mb-40 d-flex align-items-center">
                          <div className="product__tab--content__thumbnail">
                            <img className="product__tab--content__thumbnail--img display-block" src={getImageUrl(images[0]?.url || images[0], 'assets/img/product/product1.webp')} alt="product-tab" />
                          </div>
                          <div className="product__tab--content__right">
                            <div className="product__tab--content__step mb-20">
                              <h4 className="product__tab--content__title">{product.title}</h4>
                              <p className="product__tab--content__desc">{product.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div id="reviews" className="tab_pane active show">
                      <div className="product__reviews">

                        <div className="product__reviews--header">
                          <h3 className="product__reviews--header__title mb-20">Customer Reviews</h3>
                          <div className="reviews__ratting d-flex align-items-center">
                            <ul className="rating d-flex">
                              {renderStars(averageRating)}
                            </ul>
                            <span className="reviews__summary--caption">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
                          </div>
                          <a className="actions__newreviews--btn primary__btn" href="#writereview">Write A Review</a>
                        </div>

                        <div className="reviews__comment--area">
                          {reviews.map((review, idx) => (
                            <div className={`reviews__comment--list ${idx === 1 ? 'margin__left ' : ''}d-flex`} key={review._id || idx}>
                              <div className="reviews__comment--thumbnail">
                                <img src={getImageUrl(review.avatar, 'assets/img/other/comment-thumb1.webp')} alt="comment-thumbnail" />
                              </div>
                              <div className="reviews__comment--content">
                                <h4 className="reviews__comment--content__title">{review.name}</h4>
                                <ul className="rating reviews__comment--rating d-flex mb-5">
                                  {renderStars(review.rating || 5)}
                                </ul>
                                <p className="reviews__comment--content__desc">{review.content}</p>
                                <span className="reviews__comment--content__date">{new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </div>
                            </div>
                          ))}
                          {reviews.length === 0 && <p className="text-center py-3">No reviews yet. Be the first to review!</p>}
                        </div>

                        <div id="writereview" className="reviews__comment--reply__area">
                          {reviewSubmitted ? (
                            <div className="text-center py-3">
                              <h3 className="reviews__comment--reply__title mb-15">Thank you for your review!</h3>
                              <button className="primary__btn" onClick={() => setReviewSubmitted(false)}>Write another review</button>
                            </div>
                          ) : (
                            <form onSubmit={handleReviewSubmit}>
                              <h3 className="reviews__comment--reply__title mb-15">Add a review</h3>
                              <div className="reviews__ratting d-flex align-items-center mb-20">
                                <ul className="rating d-flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <li
                                      className="rating__list"
                                      key={star}
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => setReviewRating(star)}
                                    >
                                      <span className="rating__list--icon">
                                        <StarIcon fill={star <= reviewRating ? 'currentColor' : 'none'} />
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="row">
                                <div className="col-12 mb-10">
                                  <textarea
                                    className="reviews__comment--reply__textarea"
                                    placeholder="Your Comments...."
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                    required
                                  ></textarea>
                                </div>
                                <div className="col-lg-6 col-md-6 mb-15">
                                  <label>
                                    <input
                                      className="reviews__comment--reply__input"
                                      placeholder="Your Name...."
                                      type="text"
                                      value={reviewName}
                                      onChange={(e) => setReviewName(e.target.value)}
                                      required
                                    />
                                  </label>
                                </div>
                                <div className="col-lg-6 col-md-6 mb-15">
                                  <label>
                                    <input
                                      className="reviews__comment--reply__input"
                                      placeholder="Your Email...."
                                      type="email"
                                      value={reviewEmail}
                                      onChange={(e) => setReviewEmail(e.target.value)}
                                      required
                                    />
                                  </label>
                                </div>
                              </div>
                              <button className="text-white primary__btn" data-hover="Submit" type="submit" disabled={submittingReview}>
                                {submittingReview ? 'Submitting...' : 'SUBMIT'}
                              </button>
                            </form>
                          )}
                        </div>

                      </div>
                    </div>
                  )}

                  {activeTab === 'information' && (
                    <div id="information" className="tab_pane active show">
                      <div className="product__tab--content">
                        {product.additionalInfo ? (
                          <div className="product__tab--content__step mb-30">
                            <p className="product__tab--content__desc">{product.additionalInfo}</p>
                          </div>
                        ) : null}
                        {product.specifications?.length > 0 && (
                          <div className="product__tab--content__step">
                            <h4 className="product__tab--content__title mb-10">Specifications</h4>
                            <ul>
                              {product.specifications.map((spec, i) => (
                                <li key={i} className="product__tab--content__list">
                                  <svg className="product__tab--content__list--icon" xmlns="http://www.w3.org/2000/svg" width="22.51" height="20.443" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M268 112l144 144-144 144M392 256H100"></path></svg>
                                  {spec.key}: {spec.value}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {!product.additionalInfo && !product.specifications?.length && (
                          <p className="product__tab--content__desc">No additional information available.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'custom' && (
                    <div id="custom" className="tab_pane active show">
                      <div className="product__tab--content">
                        {product.customContent ? (
                          <div className="product__tab--content__step mb-30">
                            <p className="product__tab--content__desc">{product.customContent}</p>
                          </div>
                        ) : (
                          <p className="product__tab--content__desc">No custom content available.</p>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* End product details tab section */}



      <NewsletterBanner />

    </main>
  )
}

export default ProductVariable
