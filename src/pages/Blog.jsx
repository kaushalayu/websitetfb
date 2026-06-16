import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogAPI, getImageUrl } from '../services/api'
import NewsletterBanner from '../components/NewsletterBanner'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1 })
  const [page, setPage] = useState(1)

  useEffect(() => {
    blogAPI.list({ page, limit: 6 })
      .then(res => {
        setPosts(res.data)
        setPagination(res.pagination)
      })
      .catch(() => {})
  }, [page])

  useEffect(() => {
    blogAPI.list({ page: 1, limit: 3 })
      .then(res => setRecentPosts(res.data))
      .catch(() => {})
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: '2-digit',
    })
  }

  const pageNumbers = Array.from({ length: pagination.pages }, (_, i) => i + 1)

  return (
    <main className="main__content_wrapper">
      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">Our Blog</h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items">
                    <Link className="text-white" to="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span className="text-white">Blog</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-page section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog-header">
                <h2 className="blog-header-title">Latest From Our Blog</h2>
                <p className="blog-header-sub">Tips, ideas & inspiration for your home</p>
              </div>

              {posts.length === 0 ? (
                <div className="blog-empty">No posts yet.</div>
              ) : (
                <>
                  <div className="blog-grid">
                    {posts.map(post => (
                      <article className="blog-card" key={post._id}>
                        <Link className="blog-card__img-wrap" to={`/blog-details?slug=${post.slug}`}>
                          <img
                            className="blog-card__img"
                            src={getImageUrl(post.featuredImage, 'assets/img/blog/blog5.webp')}
                            alt={post.title}
                          />
                        </Link>
                        <div className="blog-card__body">
                          <div className="blog-card__meta">
                            <span className="blog-card__meta-item">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              {post.author?.name || post.author || 'Admin'}
                            </span>
                            <span className="blog-card__meta-item">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              {formatDate(post.publishedAt)}
                            </span>
                          </div>
                          <h3 className="blog-card__title">
                            <Link to={`/blog-details?slug=${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="blog-card__excerpt">{post.excerpt}</p>
                          <Link className="blog-card__btn" to={`/blog-details?slug=${post.slug}`}>
                            Read More
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                  {pagination.pages > 1 && (
                    <div className="blog-pagination">
                      <button
                        className="blog-pagination__arrow"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="19" y1="12" x2="5" y2="12" />
                          <polyline points="12 19 5 12 12 5" />
                        </svg>
                      </button>
                      {pageNumbers.map(p => (
                        p === page ? (
                          <span className="blog-pagination__item blog-pagination__item--active" key={p}>{p}</span>
                        ) : (
                          <button className="blog-pagination__item" onClick={() => setPage(p)} key={p}>{p}</button>
                        )
                      ))}
                      <button
                        className="blog-pagination__arrow"
                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                        disabled={page >= pagination.pages}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="col-lg-4">
              <aside className="blog-sidebar">
                <div className="blog-sidebar__widget">
                  <h3 className="blog-sidebar__title">Search</h3>
                  <form className="blog-sidebar__search" action="#">
                    <input className="blog-sidebar__search-input" placeholder="Search posts..." type="text" />
                    <button className="blog-sidebar__search-btn" type="submit">Search</button>
                  </form>
                </div>

                <div className="blog-sidebar__widget">
                  <h3 className="blog-sidebar__title">Recent Posts</h3>
                  <div className="blog-sidebar__recent">
                    {recentPosts.map(rp => (
                      <div className="blog-sidebar__recent-item" key={rp._id}>
                        <img
                          className="blog-sidebar__recent-img"
                          src={getImageUrl(rp.featuredImage, 'assets/img/product/small-product1.webp')}
                          alt={rp.title}
                        />
                        <div className="blog-sidebar__recent-content">
                          <h4 className="blog-sidebar__recent-title">
                            <Link to={`/blog-details?slug=${rp.slug}`}>{rp.title}</Link>
                          </h4>
                          <span className="blog-sidebar__recent-date">{formatDate(rp.publishedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <NewsletterBanner />
    </main>
  )
}

export default Blog
