import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import NewsletterBanner from '../components/NewsletterBanner'
import { blogAPI, commentAPI, getImageUrl } from '../services/api'

const BlogDetails = () => {
  const { slug: paramSlug } = useParams()
  const [searchParams] = useSearchParams()
  const slug = paramSlug || searchParams.get('slug')
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [tags, setTags] = useState([])
  const [form, setForm] = useState({ name: '', email: '', website: '', content: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!slug) return
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [postRes, commentsRes] = await Promise.all([
          blogAPI.getBySlug(slug),
          commentAPI.list(slug),
        ])
        setPost(postRes.data)
        setComments(commentsRes.comments || [])
        if (postRes.recentPosts) setRecentPosts(postRes.recentPosts)
      } catch (e) {
        if (import.meta.env.DEV) console.error(e)
        setError('Failed to load blog post.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  useEffect(() => {
    blogAPI.tags().then(res => setTags(res.data || [])).catch(() => {})
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.content) return
    try {
      setSubmitting(true)
      const res = await commentAPI.submit(slug, form)
      setComments((prev) => [...prev, res.data?.comment || res.data || res])
      setForm({ name: '', email: '', website: '', content: '' })
    } catch (e) {
      if (import.meta.env.DEV) console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="main__content_wrapper">
        <section className="breadcrumb__section breadcrumb__bg">
          <div className="container">
            <div className="row row-cols-1">
              <div className="col">
                <div className="breadcrumb__content">
                  <h1 className="breadcrumb__content--title text-white mb-10">Blog Details</h1>
                  <ul className="breadcrumb__content--menu d-flex">
                    <li className="breadcrumb__content--menu__items"><Link className="text-white" to="/">Home</Link></li>
                    <li className="breadcrumb__content--menu__items"><span className="text-white">Blog Details</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="blog__details--section section--padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center py-5">
                  <h3>Loading...</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <NewsletterBanner />
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="main__content_wrapper">
        <section className="breadcrumb__section breadcrumb__bg">
          <div className="container">
            <div className="row row-cols-1">
              <div className="col">
                <div className="breadcrumb__content">
                  <h1 className="breadcrumb__content--title text-white mb-10">Blog Details</h1>
                  <ul className="breadcrumb__content--menu d-flex">
                    <li className="breadcrumb__content--menu__items"><Link className="text-white" to="/">Home</Link></li>
                    <li className="breadcrumb__content--menu__items"><span className="text-white">Blog Details</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="blog__details--section section--padding">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center py-5">
                  <h3>{error || 'Post not found.'}</h3>
                  <Link to="/blog" className="primary__btn text-white mt-3 d-inline-block">Back to Blog</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <NewsletterBanner />
      </main>
    )
  }

  return (
    <main className="main__content_wrapper">
      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">Blog Details</h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items"><Link className="text-white" to="/">Home</Link></li>
                  <li className="breadcrumb__content--menu__items"><Link className="text-white" to="/blog">Blog</Link></li>
                  <li className="breadcrumb__content--menu__items"><span className="text-white">{post.title?.slice(0, 30)}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog__details--section section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="blog__details--wrapper">
                <div className="blog__post--header mb-30">
                  <h2 className="post__header--title mb-15">{post.title}</h2>
                  <div className="blog__post--meta">
                    <span><strong>Posted by:</strong> {post.author}</span>
                    <span className="meta-sep">|</span>
                    <span><strong>On:</strong> {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {post.category && (
                      <>
                        <span className="meta-sep">|</span>
                        <span><strong>In:</strong> <Link to={`/blog?category=${post.category?.slug || post.category}`}>{post.category?.name || post.category}</Link></span>
                      </>
                    )}
                  </div>
                </div>

                {post.featuredImage && (
                  <div className="blog__thumbnail mb-30">
                    <img className="blog__thumbnail--img" src={getImageUrl(post.featuredImage, 'assets/img/blog/blog1.webp')} alt={post.title} />
                  </div>
                )}

                <div className="blog__details--content" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="blog__tags--social__media d-flex align-items-center justify-content-between">
                  {post.tags && post.tags.length > 0 && (
                    <div className="blog__tags--media d-flex align-items-center">
                      <label className="blog__tags--media__title">Tags:</label>
                      <ul className="d-flex">
                        {post.tags.map((tag, i) => (
                          <li key={i} className="blog__tags--media__list">
                            <Link className="blog__tags--media__link" to={`/blog?tag=${tag}`}>{tag}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="blog__social--media d-flex align-items-center">
                    <label className="blog__social--media__title">Share:</label>
                    <ul className="d-flex">
                      <li className="blog__social--media__list">
                        <a className="blog__social--media__link" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                      </li>
                      <li className="blog__social--media__list">
                        <a className="blog__social--media__link" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      </li>
                      <li className="blog__social--media__list">
                        <a className="blog__social--media__link" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {recentPosts.length > 0 && (
                  <div className="related__post--area mb-50">
                    <div className="section__heading mb-25">
                      <h2 className="section__heading--maintitle h3">Related Articles</h2>
                    </div>
                    <div className="row row-cols-md-2 row-cols-sm-2 row-cols-1 mb--n28">
                      {recentPosts.slice(0, 4).map(rp => (
                        <div className="col mb-28" key={rp._id}>
                          <div className="related__post--items">
                            <div className="related__post--thumbnail">
                              <Link to={`/blog-details?slug=${rp.slug}`}>
                                <img className="related__post--img" src={getImageUrl(rp.featuredImage, 'assets/img/blog/related-post1.webp')} alt={rp.title} />
                              </Link>
                            </div>
                            <div className="related__post--text">
                              <h3 className="related__post--title">
                                <Link className="related__post--title__link" to={`/blog-details?slug=${rp.slug}`}>{rp.title}</Link>
                              </h3>
                              <span className="related__post--deta">{new Date(rp.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="comment__box">
                  <div className="reviews__comment--area2 mb-50">
                    <h3 className="reviews__comment--reply__title mb-25">Comments ({comments.length})</h3>
                    <div className="reviews__comment--inner">
                      {comments.length === 0 ? (
                        <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                      ) : (
                        comments.map((comment, i) => (
                          <div key={comment._id || i} className="reviews__comment--list">
                            <div className="reviews__comment--avatar">
                              <img src={getImageUrl(comment.avatar, "assets/img/other/comment-thumb1.webp")} alt={comment.name} />
                            </div>
                            <div className="reviews__comment--content">
                              <div className="reviews__comment--content__head">
                                <h4 className="reviews__comment--content__title">{comment.name}</h4>
                                <span className="reviews__comment--content__date">{new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </div>
                              <p className="reviews__comment--content__desc">{comment.content}</p>
                              <button className="comment__reply--btn" type="button">Reply</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="reviews__comment--reply__area">
                    <h3 className="reviews__comment--reply__title mb-20">Leave A Comment</h3>
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-4 col-md-6 mb-20">
                          <input className="reviews__comment--reply__input" placeholder="Your Name *" type="text" name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="col-lg-4 col-md-6 mb-20">
                          <input className="reviews__comment--reply__input" placeholder="Your Email *" type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="col-lg-4 col-md-6 mb-20">
                          <input className="reviews__comment--reply__input" placeholder="Website" type="text" name="website" value={form.website} onChange={handleChange} />
                        </div>
                        <div className="col-12 mb-15">
                          <textarea className="reviews__comment--reply__textarea" placeholder="Your Comment *" name="content" value={form.content} onChange={handleChange} required></textarea>
                        </div>
                      </div>
                      <button className="primary__btn text-white" type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Post Comment'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <aside className="blog__sidebar--widget">
                <div className="single__widget">
                  <h3 className="widget__title">Search</h3>
                  <form className="widget__search--form" action="#" method="get">
                    <input className="widget__search--form__input" placeholder="Search posts..." type="text" name="s" />
                    <button className="widget__search--form__btn" type="submit">Search</button>
                  </form>
                </div>

                <div className="single__widget">
                  <h3 className="widget__title">Recent Posts</h3>
                  {recentPosts.length === 0 ? (
                    <p className="no-data">No recent posts.</p>
                  ) : (
                    <div className="recent__post--list">
                      {recentPosts.slice(0, 4).map(rp => (
                        <div className="recent__post--item d-flex align-items-center" key={rp._id}>
                          <div className="recent__post--thumb">
                            <Link to={`/blog-details?slug=${rp.slug}`}>
                              <img src={getImageUrl(rp.featuredImage, 'assets/img/product/small-product1.webp')} alt={rp.title} />
                            </Link>
                          </div>
                          <div className="recent__post--info">
                            <h4 className="recent__post--title">
                              <Link to={`/blog-details?slug=${rp.slug}`}>{rp.title}</Link>
                            </h4>
                            <span className="recent__post--date">{new Date(rp.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {tags.length > 0 && (
                  <div className="single__widget">
                    <h3 className="widget__title">Tags</h3>
                    <ul className="widget__tagcloud">
                      {tags.map((tag, i) => (
                        <li key={i} className="widget__tagcloud--list">
                          <Link className="widget__tagcloud--link" to={`/blog?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>

      <NewsletterBanner />
    </main>
  )
}

export default BlogDetails
