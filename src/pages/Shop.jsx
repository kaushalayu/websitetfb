import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { productAPI, categoryAPI, getImageUrl } from '../services/api'
import { useCart } from '../context/CartContext'
import NewsletterBanner from '../components/NewsletterBanner'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
]

/* ── Quick View Modal ── */
const QuickViewModal = ({ slug, onClose }) => {
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    productAPI.getBySlug(slug)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const images = product?.images?.length ? product.images : []
  const price = product?.salePrice || product?.price || 0
  const oldPrice = product?.salePrice ? product.price : null

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="sqv-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Quick view">
      <div className="sqv-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sqv-close" onClick={onClose} aria-label="Close">&times;</button>
        {loading ? (
          <div className="sqv-loading"><div className="sqv-spinner" /></div>
        ) : !product ? (
          <div className="sqv-loading"><p>Product not found</p></div>
        ) : (
          <div className="sqv-grid">
            <div className="sqv-images">
              <div className="sqv-main-img">
                <img src={getImageUrl(images[activeImage]?.url || images[activeImage], 'assets/img/product/product1.webp')} alt={product.title} onError={(e)=>{e.target.onerror=null;e.target.src='assets/img/product/product1.webp'}} />
              </div>
              {images.length > 1 && (
                <div className="sqv-thumbs">
                  {images.map((img, i) => (
                    <button key={i} className={`sqv-thumb ${i === activeImage ? 'active' : ''}`} onClick={() => setActiveImage(i)}>
                      <img src={getImageUrl(img.url || img)} alt={`${product.title} ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="sqv-info">
              {product.category?.name && <span className="sqv-category">{product.category.name}</span>}
              <h2 className="sqv-title">{product.title}</h2>
              <div className="sqv-price">
                <span className="sqv-current">₹{Number(price).toLocaleString('en-IN')}</span>
                {oldPrice && <span className="sqv-old">₹{Number(oldPrice).toLocaleString('en-IN')}</span>}
              </div>
              <p className="sqv-desc">
                {product.description?.substring(0, 200)}{product.description?.length > 200 ? '...' : ''}
              </p>
              <div className="sqv-row">
                <span className="sqv-label">Qty:</span>
                <div className="sqv-qty">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
              </div>
              <button className={`sqv-btn-cart ${added ? 'added' : ''}`} onClick={handleAddToCart}>
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <Link to={`/product-variable?slug=${product.slug}`} className="sqv-btn-link">View Full Details →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Shop Component ── */
const Shop = () => {
  const { addItem } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [quickViewSlug, setQuickViewSlug] = useState(null)
  const [addedItems, setAddedItems] = useState({})
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'

  const page    = parseInt(searchParams.get('page')) || 1
  const category = searchParams.get('category') || ''
  const search  = searchParams.get('search') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sort    = searchParams.get('sort') || 'newest'

  const updateParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value)
      else newParams.delete(key)
    })
    if (!('page' in updates)) newParams.delete('page')
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = { page, limit: 12 }
        if (category) params.category = category
        if (search)   params.search   = search
        if (minPrice) params.minPrice = minPrice
        if (maxPrice) params.maxPrice = maxPrice
        if (sort)     params.sort     = sort
        const [prodRes, catRes] = await Promise.all([productAPI.list(params), categoryAPI.list()])
        if (cancelled) return
        setProducts(prodRes.data || [])
        if (prodRes.pagination) setPagination(prodRes.pagination)
        setCategories(catRes.data || [])
      } catch (err) {
        if (!cancelled) { setError(err.message || 'Failed to load products'); setProducts([]) }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [category, search, minPrice, maxPrice, sort, page])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = new FormData(e.target).get('search')
    updateParams({ search: q })
  }

  const handlePriceFilter = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    updateParams({ minPrice: fd.get('minPrice'), maxPrice: fd.get('maxPrice') })
  }

  const FALLBACK_IMG = 'assets/img/product/product1.webp'

  const getImage = (product, index = 0) => {
    const url = product.images?.[index]?.url || product.images?.[0]?.url
    return getImageUrl(url, FALLBACK_IMG)
  }

  const handleImgError = (e) => {
    e.target.onerror = null
    e.target.src = FALLBACK_IMG
  }

  const getPrice = (product) => {
    const num = (val) => Number(val || 0)
    if (product.salePrice && product.salePrice < product.price)
      return { current: num(product.salePrice), old: num(product.price) }
    return { current: num(product.price), old: null }
  }

  const renderStars = (rating = 0) => {
    const full = Math.floor(rating)
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24"
        fill={i < full ? '#f5a623' : 'none'} stroke="#f5a623" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAddedItems(prev => ({ ...prev, [product._id]: true }))
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product._id]: false })), 1500)
  }

  const activeFiltersCount = [category, minPrice, maxPrice, search].filter(Boolean).length

  return (
    <main className="sp-page">
      {quickViewSlug && <QuickViewModal slug={quickViewSlug} onClose={() => setQuickViewSlug(null)} />}

      {/* ── Hero Breadcrumb ── */}
      <section className="sp-hero">
        <div className="sp-hero__bg" />
        <div className="container">
          <div className="sp-hero__content">
            <h1 className="sp-hero__title">
              {category ? (categories.find(c => c.slug === category)?.name || 'Shop') : 'Our Collection'}
            </h1>
            <nav className="sp-breadcrumb" aria-label="breadcrumb">
              <Link to="/">Home</Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              <span>Shop</span>
              {category && (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  <span>{categories.find(c => c.slug === category)?.name || category}</span>
                </>
              )}
            </nav>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="sp-body">
        <div className="container">
          <div className="sp-layout">

            {/* ── Sidebar ── */}
            <aside className={`sp-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Product filters">
              <div className="sp-sidebar__head">
                <h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                  </svg>
                  Filters
                  {activeFiltersCount > 0 && <span className="sp-sidebar__badge">{activeFiltersCount}</span>}
                </h3>
                <button className="sp-sidebar__close" onClick={() => setSidebarOpen(false)} aria-label="Close filters">&times;</button>
              </div>

              {/* Search */}
              <div className="sp-widget">
                <h4 className="sp-widget__title">Search</h4>
                <form className="sp-search-form" onSubmit={handleSearch}>
                  <input type="text" name="search" defaultValue={search} placeholder="Search products…" />
                  <button type="submit" aria-label="Search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="sp-widget">
                <h4 className="sp-widget__title">Categories</h4>
                <ul className="sp-cat-list">
                  <li>
                    <button className={!category ? 'active' : ''} onClick={() => updateParams({ category: '' })}>
                      All Categories
                      <span className="sp-cat-arrow">→</span>
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        className={category === cat.slug ? 'active' : ''}
                        onClick={() => updateParams({ category: cat.slug })}
                      >
                        {cat.name}
                        <span className="sp-cat-arrow">→</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div className="sp-widget">
                <h4 className="sp-widget__title">Price Range</h4>
                <form className="sp-price-form" onSubmit={handlePriceFilter}>
                  <div className="sp-price-inputs">
                    <label>
                      <span>Min ₹</span>
                      <input name="minPrice" type="number" defaultValue={minPrice} placeholder="0" min="0" />
                    </label>
                    <span className="sp-price-sep">—</span>
                    <label>
                      <span>Max ₹</span>
                      <input name="maxPrice" type="number" defaultValue={maxPrice} placeholder="Any" min="0" />
                    </label>
                  </div>
                  <button type="submit" className="sp-btn-apply">Apply Filter</button>
                </form>
              </div>

              {activeFiltersCount > 0 && (
                <button className="sp-btn-clear" onClick={() => setSearchParams({})}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Clear All Filters
                </button>
              )}
            </aside>

            {sidebarOpen && <div className="sp-backdrop" onClick={() => setSidebarOpen(false)} />}

            {/* ── Main Area ── */}
            <div className="sp-main">

              {/* Toolbar */}
              <div className="sp-toolbar">
                <div className="sp-toolbar__left">
                  <button className="sp-filter-btn" onClick={() => setSidebarOpen(true)} aria-label="Open filters">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
                    Filters
                    {activeFiltersCount > 0 && <span className="sp-filter-badge">{activeFiltersCount}</span>}
                  </button>
                  <p className="sp-results">{pagination.total} product{pagination.total !== 1 ? 's' : ''}</p>
                </div>
                <div className="sp-toolbar__right">
                  <div className="sp-view-toggle">
                    <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} aria-label="Grid view">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    </button>
                    <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="List view">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    </button>
                  </div>
                  <select className="sp-sort" value={sort} onChange={(e) => updateParams({ sort: e.target.value })} aria-label="Sort products">
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFiltersCount > 0 && (
                <div className="sp-chips">
                  {search && (
                    <span className="sp-chip">
                      Search: "{search}"
                      <button onClick={() => updateParams({ search: '' })} aria-label="Remove search filter">×</button>
                    </span>
                  )}
                  {category && (
                    <span className="sp-chip">
                      {categories.find(c => c.slug === category)?.name || category}
                      <button onClick={() => updateParams({ category: '' })} aria-label="Remove category filter">×</button>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="sp-chip">
                      ₹{minPrice || '0'} – ₹{maxPrice || '∞'}
                      <button onClick={() => updateParams({ minPrice: '', maxPrice: '' })} aria-label="Remove price filter">×</button>
                    </span>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="sp-error">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
              )}

              {/* Loading skeleton */}
              {loading && !error && (
                <div className={`sp-grid ${viewMode === 'list' ? 'sp-grid--list' : ''}`}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="sp-card sp-skeleton">
                      <div className="sp-skeleton__img" />
                      <div className="sp-skeleton__body">
                        <div className="sp-skeleton__line" />
                        <div className="sp-skeleton__line short" />
                        <div className="sp-skeleton__line shorter" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty */}
              {!loading && !error && products.length === 0 && (
                <div className="sp-empty">
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filters</p>
                  <button className="sp-btn-apply" onClick={() => setSearchParams({})}>Clear Filters</button>
                </div>
              )}

              {/* Product Grid / List */}
              {!loading && !error && products.length > 0 && (
                <>
                  <div className={`sp-grid ${viewMode === 'list' ? 'sp-grid--list' : ''}`}>
                    {products.map((product) => {
                      const price = getPrice(product)
                      const discount = price.old ? Math.round((1 - price.current / price.old) * 100) : 0
                      return (
                        <article className="sp-card" key={product._id}>
                          <div className="sp-card__img-wrap">
                            <Link to={`/product-variable?slug=${product.slug}`} tabIndex="-1">
                              <img className="sp-card__img sp-card__img--primary" src={getImage(product, 0)} alt={product.title} loading="lazy" onError={handleImgError} />
                              <img className="sp-card__img sp-card__img--secondary" src={getImage(product, 1) || getImage(product, 0)} alt={product.title} loading="lazy" onError={handleImgError} />
                            </Link>

                            {discount > 0 && (
                              <span className="sp-badge sp-badge--sale">-{discount}%</span>
                            )}
                            {!discount && product.isNew && (
                              <span className="sp-badge sp-badge--new">New</span>
                            )}

                            <div className="sp-card__actions">
                              <button
                                className="sp-action-btn"
                                aria-label="Quick view"
                                title="Quick View"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewSlug(product.slug) }}
                              >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                              <Link to={`/product-variable?slug=${product.slug}`} className="sp-action-btn" aria-label="View details" title="View Details">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                              </Link>
                            </div>
                          </div>

                          <div className="sp-card__body">
                            {product.category?.name && (
                              <span className="sp-card__cat">{product.category.name}</span>
                            )}
                            <h3 className="sp-card__title">
                              <Link to={`/product-variable?slug=${product.slug}`}>{product.title}</Link>
                            </h3>
                            {viewMode === 'list' && product.description && (
                              <p className="sp-card__desc">
                                {product.description.substring(0, 120)}{product.description.length > 120 ? '…' : ''}
                              </p>
                            )}
                            {product.rating > 0 && (
                              <div className="sp-card__stars" aria-label={`Rating: ${product.rating} out of 5`}>
                                {renderStars(product.rating)}
                                <span>({product.rating.toFixed(1)})</span>
                              </div>
                            )}
                            <div className="sp-card__price">
                              <span className="sp-card__price--current">₹{price.current.toLocaleString('en-IN')}</span>
                              {price.old && (
                                <span className="sp-card__price--old">₹{price.old.toLocaleString('en-IN')}</span>
                              )}
                            </div>
                            <button
                              className={`sp-card__cart-btn ${addedItems[product._id] ? 'added' : ''}`}
                              onClick={(e) => handleAddToCart(e, product)}
                              aria-label={`Add ${product.title} to cart`}
                            >
                              {addedItems[product._id] ? (
                                <>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                  Added!
                                </>
                              ) : (
                                <>
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                                  Add to Cart
                                </>
                              )}
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <nav className="sp-pagination" aria-label="Product pagination">
                      <button
                        className="sp-page-btn sp-page-btn--arrow"
                        disabled={page <= 1}
                        onClick={() => updateParams({ page: page - 1 })}
                        aria-label="Previous page"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                        const start = Math.max(1, Math.min(page - 3, pagination.pages - 6))
                        const p = start + i
                        if (p > pagination.pages) return null
                        return (
                          <button
                            key={p}
                            className={`sp-page-btn ${p === page ? 'active' : ''}`}
                            onClick={() => updateParams({ page: p })}
                            aria-current={p === page ? 'page' : undefined}
                          >
                            {p}
                          </button>
                        )
                      })}
                      <button
                        className="sp-page-btn sp-page-btn--arrow"
                        disabled={page >= pagination.pages}
                        onClick={() => updateParams({ page: page + 1 })}
                        aria-label="Next page"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsletterBanner />
    </main>
  )
}

export default Shop
