import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import NewsletterBanner from '../components/NewsletterBanner'
import { blogAPI, commentAPI, getImageUrl } from '../services/api'

const BlogDetails = () => {
  const { slug: paramSlug } = useParams()
  const [searchParams] = useSearchParams()
  // Support both /blog-details/:slug AND /blog-details?slug=xxx
  const slug = paramSlug || searchParams.get('slug')
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
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
        setComments(commentsRes.data.comments || [])
      } catch (e) {
        if (import.meta.env.DEV) console.error(e)
        setError('Failed to load blog post.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.content) return
    try {
      setSubmitting(true)
      const res = await commentAPI.submit(slug, form)
      setComments((prev) => [...prev, res.data.comment || res.data])
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

  return <>
    <main className="main__content_wrapper">
{/* Start breadcrumb section */}

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

        {/* End breadcrumb section */}



        {/* Start blog details section */}

        <section className="blog__details--section section--padding">

            <div className="container">

                <div className="row">

                    <div className="col-lg-8">

                        <div className="blog__details--wrapper">

                            <div className="entry__blog">

                                <div className="blog__post--header mb-30">

                                    <h2 className="post__header--title mb-15">{post.title}</h2>

                                    <p className="blog__post--meta">Posted by : {post.author} / On : {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} / In : <Link className="blog__post--meta__link" to={`/blog?category=${post.category?.slug || post.category}`}>{post.category?.name || post.category}</Link></p>

                                </div>

                                <div className="blog__thumbnail mb-30">

                                    <img className="blog__thumbnail--img border-radius-10" src={getImageUrl(post.featuredImage, 'assets/img/blog/blog1.webp')} alt={post.title} />

                                </div>

                                <div className="blog__details--content" dangerouslySetInnerHTML={{ __html: post.content }} />

                            </div>

                            <div className="blog__tags--social__media d-flex align-items-center justify-content-between">

                                <div className="blog__tags--media d-flex align-items-center">

                                    <label className="blog__tags--media__title">Releted Tags :</label>

                                    <ul className="d-flex">
                                      {post.tags && post.tags.map((tag, i) => (
                                        <li key={i} className="blog__tags--media__list"><Link className="blog__tags--media__link" to={`/blog?tag=${tag}`}>{tag}</Link></li>
                                      ))}
                                    </ul>

                                </div>

                                <div className="blog__social--media d-flex align-items-center">

                                    <label className="blog__social--media__title">Social Share :</label>

                                    <ul className="d-flex">

                                        <li className="blog__social--media__list">

                                            <a className="blog__social--media__link" target="_blank" href="https://www.facebook.com">

                                                <svg xmlns="http://www.w3.org/2000/svg" width="7.667" height="16.524" viewBox="0 0 7.667 16.524">

                                                    <path data-name="Path 237" d="M967.495,353.678h-2.3v8.253h-3.437v-8.253H960.13V350.77h1.624v-1.888a4.087,4.087,0,0,1,.264-1.492,2.9,2.9,0,0,1,1.039-1.379,3.626,3.626,0,0,1,2.153-.6l2.549.019v2.833h-1.851a.732.732,0,0,0-.472.151.8.8,0,0,0-.246.642v1.719H967.8Z" transform="translate(-960.13 -345.407)" fill="currentColor"></path>

                                                </svg>

                                                <span className="visually-hidden">Facebook</span>

                                            </a>

                                        </li>

                                        <li className="blog__social--media__list">

                                            <a className="blog__social--media__link" target="_blank" href="https://twitter.com">

                                                <svg xmlns="http://www.w3.org/2000/svg" width="16.489" height="13.384" viewBox="0 0 16.489 13.384">

                                                    <path data-name="Path 303" d="M966.025,1144.2v.433a9.783,9.783,0,0,1-.621,3.388,10.1,10.1,0,0,1-1.845,3.087,9.153,9.153,0,0,1-3.012,2.259,9.825,9.825,0,0,1-4.122.866,9.632,9.632,0,0,1-2.748-.4,9.346,9.346,0,0,1-2.447-1.11q.4.038.809.038a6.723,6.723,0,0,0,2.24-.376,7.022,7.022,0,0,0,1.958-1.054,3.379,3.379,0,0,1-1.958-.687,3.259,3.259,0,0,1-1.186-1.666,3.364,3.364,0,0,0,.621.056,3.488,3.488,0,0,0,.885-.113,3.267,3.267,0,0,1-1.374-.631,3.356,3.356,0,0,1-.969-1.186,3.524,3.524,0,0,1-.367-1.5v-.057a3.172,3.172,0,0,0,1.544.433,3.407,3.407,0,0,1-1.1-1.214,3.308,3.308,0,0,1-.4-1.609,3.362,3.362,0,0,1,.452-1.694,9.652,9.652,0,0,0,6.964,3.538,3.911,3.911,0,0,1-.075-.772,3.293,3.293,0,0,1,.452-1.694,3.409,3.409,0,0,1,1.233-1.233,3.257,3.257,0,0,1,1.685-.461,3.351,3.351,0,0,1,2.466,1.073,6.572,6.572,0,0,0,2.146-.828,3.272,3.272,0,0,1-.574,1.083,3.477,3.477,0,0,1-.913.8,6.869,6.869,0,0,0,1.958-.546A7.074,7.074,0,0,1,966.025,1144.2Z" transform="translate(-951.23 -1140.849)" fill="currentColor"></path>

                                                </svg>

                                                <span className="visually-hidden">Twitter</span>

                                            </a>

                                        </li>

                                        <li className="blog__social--media__list">

                                            <a className="blog__social--media__link" target="_blank" href="https://www.skype.com">

                                                <svg xmlns="http://www.w3.org/2000/svg" width="16.482" height="16.481" viewBox="0 0 16.482 16.481">

                                                    <path data-name="Path 284" d="M879,926.615a4.479,4.479,0,0,1,.622-2.317,4.666,4.666,0,0,1,1.676-1.677,4.482,4.482,0,0,1,2.317-.622,4.577,4.577,0,0,1,2.43.678,7.58,7.58,0,0,1,5.048.961,7.561,7.561,0,0,1,3.786,6.593,8,8,0,0,1-.094,1.206,4.676,4.676,0,0,1,.7,2.411,4.53,4.53,0,0,1-.622,2.326,4.62,4.62,0,0,1-1.686,1.686,4.626,4.626,0,0,1-4.756-.075,7.7,7.7,0,0,1-1.187.094,7.623,7.623,0,0,1-7.647-7.647,7.46,7.46,0,0,1,.094-1.187A4.424,4.424,0,0,1,879,926.615Zm4.107,1.714a2.473,2.473,0,0,0,.282,1.234,2.41,2.41,0,0,0,.782.829,5.091,5.091,0,0,0,1.215.565,15.981,15.981,0,0,0,1.582.424q.678.151.979.235a3.091,3.091,0,0,1,.593.235,1.388,1.388,0,0,1,.452.348.738.738,0,0,1,.16.481.91.91,0,0,1-.48.753,2.254,2.254,0,0,1-1.271.321,2.105,2.105,0,0,1-1.253-.292,2.262,2.262,0,0,1-.65-.838,2.42,2.42,0,0,0-.414-.546.853.853,0,0,0-.584-.17.893.893,0,0,0-.669.283.919.919,0,0,0-.273.659,1.654,1.654,0,0,0,.217.782,2.456,2.456,0,0,0,.678.763,3.64,3.64,0,0,0,1.158.574,5.931,5.931,0,0,0,1.639.235,5.767,5.767,0,0,0,2.072-.339,2.982,2.982,0,0,0,1.356-.961,2.306,2.306,0,0,0,.471-1.431,2.161,2.161,0,0,0-.443-1.375,3.009,3.009,0,0,0-1.2-.894,10.118,10.118,0,0,0-1.865-.575,11.2,11.2,0,0,1-1.309-.311,2.011,2.011,0,0,1-.8-.452.992.992,0,0,1-.3-.744,1.143,1.143,0,0,1,.565-.97,2.59,2.59,0,0,1,1.488-.386,2.538,2.538,0,0,1,1.074.188,1.634,1.634,0,0,1,.622.49,3.477,3.477,0,0,1,.414.753,1.568,1.568,0,0,0,.4.594.866.866,0,0,0,.574.2,1,1,0,0,0,.706-.254.828.828,0,0,0,.273-.631,2.234,2.234,0,0,0-.443-1.253,3.321,3.321,0,0,0-1.158-1.046,5.375,5.375,0,0,0-2.524-.527,5.764,5.764,0,0,0-2.213.386,3.161,3.161,0,0,0-1.422,1.083A2.738,2.738,0,0,0,883.106,928.329Z" transform="translate(-878.999 -922)" fill="currentColor"></path>

                                                    </svg>

                                                    <span className="visually-hidden">Skype</span>

                                            </a>

                                        </li>

                                        <li className="blog__social--media__list">

                                            <a className="blog__social--media__link" target="_blank" href="https://www.youtube.com">

                                                <svg xmlns="http://www.w3.org/2000/svg" width="16.49" height="11.582" viewBox="0 0 16.49 11.582">

                                                    <path data-name="Path 321" d="M967.759,1365.592q0,1.377-.019,1.717-.076,1.114-.151,1.622a3.981,3.981,0,0,1-.245.925,1.847,1.847,0,0,1-.453.717,2.171,2.171,0,0,1-1.151.6q-3.585.265-7.641.189-2.377-.038-3.387-.085a11.337,11.337,0,0,1-1.5-.142,2.206,2.206,0,0,1-1.113-.585,2.562,2.562,0,0,1-.528-1.037,3.523,3.523,0,0,1-.141-.585c-.032-.2-.06-.5-.085-.906a38.894,38.894,0,0,1,0-4.867l.113-.925a4.382,4.382,0,0,1,.208-.906,2.069,2.069,0,0,1,.491-.755,2.409,2.409,0,0,1,1.113-.566,19.2,19.2,0,0,1,2.292-.151q1.82-.056,3.953-.056t3.952.066q1.821.067,2.311.142a2.3,2.3,0,0,1,.726.283,1.865,1.865,0,0,1,.557.49,3.425,3.425,0,0,1,.434,1.019,5.72,5.72,0,0,1,.189,1.075q0,.095.057,1C967.752,1364.1,967.759,1364.677,967.759,1365.592Zm-7.6.925q1.49-.754,2.113-1.094l-4.434-2.339v4.66Q958.609,1367.311,960.156,1366.517Z" transform="translate(-951.269 -1359.8)" fill="currentColor"></path>

                                                </svg>

                                                <span className="visually-hidden">Youtube</span>

                                            </a>

                                        </li>

                                    </ul>

                                </div>

                            </div>

                            <div className="related__post--area mb-50">

                                <div className="section__heading text-center mb-20">

                                    <h2 className="section__heading--maintitle h3">Related Articles</h2>

                                </div>

                                <div className="row row-cols-md-2 row-cols-sm-2 row-cols-1 mb--n28">

                                    <div className="col mb-28">

                                        <div className="related__post--items">

                                            <div className="related__post--thumbnail border-radius-10 mb-20">

                                                <Link className="display-block" to="/blog-details"><img className="related__post--img display-block border-radius-10" src="assets/img/blog/related-post1.webp" alt="related-post" /></Link>

                                            </div>

                                            <div className="related__post--text">

                                                <h3 className="related__post--title mb-5"><Link className="related__post--title__link" to="/blog-details">Post With Gallery</Link></h3>

                                                <span className="related__post--deta">September 17, 2022</span>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="col mb-28">

                                        <div className="related__post--items">

                                            <div className="related__post--thumbnail border-radius-10 mb-20">

                                                <Link className="display-block" to="/blog-details"><img className="related__post--img display-block border-radius-10" src="assets/img/blog/related-post2.webp" alt="related-post" /></Link>

                                            </div>

                                            <div className="related__post--text">

                                                <h3 className="related__post--title mb-5"><Link className="related__post--title__link" to="/blog-details">Post With Vedio</Link></h3>

                                                <span className="related__post--deta">September 17, 2022</span>

                                            </div>

                                        </div>

                                    </div>

                                    

                                </div>

                            </div>

                            <div className="comment__box">

                                <div className="reviews__comment--area2 mb-50">

                                    <h3 className="reviews__comment--reply__title mb-25">Recent Comment</h3>

                                    <div className="reviews__comment--inner">
                                      {comments.length === 0 ? (
                                        <p className="mb-20">No comments yet. Be the first to comment!</p>
                                      ) : (
                                        comments.map((comment, i) => (
                                          <div key={comment._id || i} className={`reviews__comment--list d-flex${i % 2 === 1 ? ' margin__left' : ''}`}>

                                            <div className="reviews__comment--thumbnail">

                                              <img src={getImageUrl(comment.avatar, "assets/img/other/comment-thumb1.webp")} alt={comment.name} />

                                            </div>

                                            <div className="reviews__comment--content ">

                                              <h4 className="reviews__comment--content__title2">{comment.name}</h4>

                                              <span className="reviews__comment--content__date2">{new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>

                                              <p className="reviews__comment--content__desc">{comment.content}</p>

                                              <button className="comment__reply--btn primary__btn" type="submit">Reply</button>

                                            </div>

                                          </div>
                                        ))
                                      )}
                                    </div>

                                </div>

                                <div className="reviews__comment--reply__area">

                                    <form onSubmit={handleSubmit}>

                                        <h3 className="reviews__comment--reply__title mb-20">Leave A Comment</h3>

                                        <div className="row">

                                            <div className="col-lg-4 col-md-6 mb-20">

                                                <label>

                                                    <input className="reviews__comment--reply__input" placeholder="Your Name...." type="text" name="name" value={form.name} onChange={handleChange} required />

                                                </label>

                                            </div>  

                                            <div className="col-lg-4 col-md-6 mb-20">

                                                <label>

                                                    <input className="reviews__comment--reply__input" placeholder="Your Email...." type="email" name="email" value={form.email} onChange={handleChange} required />

                                                </label>

                                            </div> 

                                            <div className="col-lg-4 col-md-6 mb-20">

                                                <label>

                                                    <input className="reviews__comment--reply__input" placeholder="Your Website...." type="text" name="website" value={form.website} onChange={handleChange} />

                                                </label>

                                            </div> 

                                            <div className="col-12 mb-15">

                                                <textarea className="reviews__comment--reply__textarea" placeholder="Your Comments...." name="content" value={form.content} onChange={handleChange} required></textarea>

                                            </div> 

                                             

                                        </div>

                                        <button className="primary__btn text-white" data-hover="Submit" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'SUBMIT'}</button>

                                    </form>   

                                </div> 

                            </div> 

                        </div>

                    </div>

                    <div className="col-lg-4">

                        <div className="blog__sidebar--widget left widget__area">

                            <div className="single__widget widget__bg">

                                <h2 className="widget__title position__relative h3">Search</h2>

                                <form className="widget__search--form" action="#">

                                    <label>

                                        <input className="widget__search--form__input border-0" placeholder="Search by" type="text" />

                                    </label>

                                    <button className="widget__search--form__btn"  type="submit">

                                        Search 

                                    </button>

                                </form>

                            </div>



                            <div className="single__widget widget__bg">

                                <h2 className="widget__title position__relative h3">Post article</h2>

                                <div className="articl__post--inner">

                                    <div className="articl__post--items d-flex align-items-center">

                                        <div className="articl__post--items__thumbnail position__relative">

                                            <Link className="articl__post--items__link display-block" to="/blog-details">

                                                <img className="articl__post--items__img display-block" src="assets/img/product/small-product1.webp" alt="product-img" />

                                            </Link>

                                        </div>

                                        <div className="articl__post--items__content">

                                            <h4 className="articl__post--items__content--title"><Link to="/blog-details">The Greatest Team's Favorite Leggings.</Link></h4>

                                            <span className="meta__deta text__secondary">Jan 11, 2022</span>

                                        </div>

                                    </div>

                                    <div className="articl__post--items d-flex align-items-center">

                                        <div className="articl__post--items__thumbnail position__relative">

                                            <Link className="articl__post--items__link display-block" to="/blog-details">

                                                <img className="articl__post--items__img display-block" src="assets/img/product/small-product2.webp" alt="product-img" />

                                            </Link>

                                        </div>

                                        <div className="articl__post--items__content">

                                            <h4 className="articl__post--items__content--title"><Link to="/blog-details">Top 10 Best Furniture Company.</Link></h4>

                                            <span className="meta__deta text__secondary">Jan 11, 2022</span>

                                        </div>

                                    </div>

                                    <div className="articl__post--items d-flex align-items-center">

                                        <div className="articl__post--items__thumbnail position__relative">

                                            <Link className="articl__post--items__link display-block" to="/blog-details">

                                                <img className="articl__post--items__img display-block" src="assets/img/product/small-product3.webp" alt="product-img" />

                                            </Link>

                                        </div>

                                        <div className="articl__post--items__content">

                                            <h4 className="articl__post--items__content--title"><Link to="/blog-details">There are History you Should Know.</Link></h4>

                                            <span className="meta__deta text__secondary">Jan 11, 2022</span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="single__widget widget__bg">

                                <h2 className="widget__title position__relative h3">Tags</h2>

                                <ul className="widget__tagcloud">

                                    <li className="widget__tagcloud--list"><Link className="widget__tagcloud--link" to="/blog-details">Wooden</Link></li>

                                    <li className="widget__tagcloud--list"><Link className="widget__tagcloud--link" to="/blog-details">Chair</Link></li>

                                    <li className="widget__tagcloud--list"><Link className="widget__tagcloud--link" to="/blog-details">Modern</Link></li>

                                    <li className="widget__tagcloud--list"><Link className="widget__tagcloud--link" to="/blog-details">Fabric  </Link></li>

                                    <li className="widget__tagcloud--list"><Link className="widget__tagcloud--link" to="/blog-details">Shoulder </Link></li>

                                    <li className="widget__tagcloud--list"><Link className="widget__tagcloud--link" to="/blog-details">Winter</Link></li>

                                    <li className="widget__tagcloud--list"><Link className="widget__tagcloud--link" to="/blog-details">Accessories</Link></li>

                                    <li className="widget__tagcloud--list"><Link className="widget__tagcloud--link" to="/blog-details">Dress </Link></li>

                                </ul>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        {/* End blog details section */}



        {/* Start Newsletter banner section */}
        <NewsletterBanner />
        {/* End Newsletter banner section */}
    </main>
  </>;
};

export default BlogDetails;
