import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI , getImageUrl } from '../services/api'

const NewProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.list({ limit: 4, sort: 'newest' })
        setProducts(data.data || [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])
  return (
    <section className="np-section">
      <div className="np-container">
        <div className="np-header">
          <h2 className="np-title">New Products</h2>
          <p className="np-subtitle">Discover our latest arrivals with modern design</p>
        </div>

        <div className="np-grid">
          {loading ? (
            <p className="np-loading">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="np-empty">No products found.</p>
          ) : (
            products.map((product) => (
              <div key={product._id || product.id} className="np-card">
                <div className="np-card-image">
                  <Link to={`/product-variable?slug=${product.slug || product._id}`}>
                    <img
                      className="np-img-primary"
                      src={getImageUrl(product.images?.[0]?.url, 'assets/img/product/product1.webp')}
                      alt={product.title}
                      loading="lazy"
                      onError={e=>{e.target.onerror=null;e.target.src='assets/img/product/product1.webp'}}
                    />
                    <img
                      className="np-img-secondary"
                      src={getImageUrl(product.images?.[1]?.url || product.images?.[0]?.url, 'assets/img/product/product2.webp')}
                      alt={product.title}
                      loading="lazy"
                      onError={e=>{e.target.onerror=null;e.target.src='assets/img/product/product2.webp'}}
                    />
                  </Link>

                  {product.badge && (
                    <span className={`np-badge ${product.badge === 'Sale' ? 'np-badge-sale' : ''}`}>
                      {product.badge}
                    </span>
                  )}

                  <div className="np-actions">
                    <button className="np-action-btn" title="Quick View">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <Link to="/wishlist" className="np-action-btn" title="Add to Wishlist">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </Link>
                    <Link to="/compare" className="np-action-btn" title="Compare">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 7 4 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 4"/>
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="np-card-body">
                  <div className="np-colors">
                    {product.colors?.length > 0 ? (
                      product.colors.map((color, i) => (
                        <span key={i} className={`np-color-dot np-color-${color}`} />
                      ))
                    ) : (
                      <span className="np-color-dot np-color-one" />
                    )}
                  </div>

                  <h3 className="np-product-title">
                    <Link to={`/product-variable?slug=${product.slug || product._id}`}>{product.title}</Link>
                  </h3>

                  <div className="np-pricing">
                    <span className="np-current-price">₹{product.salePrice || product.price}</span>
                    {product.salePrice && (
                      <span className="np-old-price">₹{product.price}</span>
                    )}
                  </div>

                  <Link to="/cart" className="np-add-cart">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Add to Cart
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default NewProducts
