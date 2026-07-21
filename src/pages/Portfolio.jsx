import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { portfolioAPI, getImageUrl } from '../services/api'

const FALLBACK_ITEMS = [
  { _id:'f1', title:'Living Room Elegance', description:'Custom teak wood sofa set with premium upholstery', image:'assets/img/other/portfolio1.webp', category:'living-room' },
  { _id:'f2', title:'Bedroom Serenity', description:'Handcrafted king size bed with side tables', image:'assets/img/other/portfolio2.webp', category:'bedroom' },
  { _id:'f3', title:'Dining Perfection', description:'12-seater solid wood dining table with carvings', image:'assets/img/other/portfolio3.webp', category:'dining' },
  { _id:'f4', title:'Office Classic', description:'Executive desk and ergonomic chair set', image:'assets/img/other/portfolio4.webp', category:'office' },
  { _id:'f5', title:'Outdoor Luxe', description:'Weather-resistant patio furniture collection', image:'assets/img/other/portfolio5.webp', category:'outdoor' },
  { _id:'f6', title:'Custom Heritage', description:'Bespoke carving work for luxury homes', image:'assets/img/other/portfolio6.webp', category:'custom' },
]

const Portfolio = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    portfolioAPI.list()
      .then(data => {
        const list = data.data || data
        if (Array.isArray(list) && list.length > 0) setItems(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayItems = items.length > 0 ? items : (loading ? [] : FALLBACK_ITEMS)

  return (
    <>
      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">Portfolio</h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items"><Link to="/" className="text-white">Home</Link></li>
                  <li className="breadcrumb__content--menu__items"><span className="text-white">Portfolio</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portfolio__section section--padding">
        <div className="container">
          <div className="section__heading text-center mb-40">
            <h2 className="section__heading--maintitle">Watch Our Portfolio</h2>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[1,2,3,4,5,6].map(n => (
                <div key={n} style={{ borderRadius: 12, overflow: 'hidden', background: '#f0f0f0', aspectRatio: '4/3' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                </div>
              ))}
              <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
            </div>
          ) : (
            <div className="portfolio__section--inner">
              <div className="row row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-2 mb--n30">
                {displayItems.map((item, i) => (
                  <div className="col mb-30" key={item._id || i}>
                    <div className="portfolio__items">
                      <div className="portfolio__items--thumbnail position__relative">
                        {item.link ? (
                          <a className="portfolio__items--thumbnail__link glightbox" data-gallery="portfolio" href={getImageUrl(item.image, `assets/img/other/portfolio${(i % 6) + 1}.webp`)} target="_blank" rel="noopener noreferrer">
                            <img className="portfolio__items--thumbnail__img" src={getImageUrl(item.image, `assets/img/other/portfolio${(i % 6) + 1}.webp`)} alt={item.title || 'portfolio-img'}
                              onError={e => { e.target.onerror = null; e.target.src = `assets/img/other/portfolio${(i % 6) + 1}.webp` }} />
                            <span className="portfolio__view--icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="39.697" height="27.066" viewBox="0 0 39.697 27.066">
                                <path d="M20.849,4.5A21.341,21.341,0,0,0,1,18.033a21.322,21.322,0,0,0,39.7,0A21.341,21.341,0,0,0,20.849,4.5Zm0,22.555a9.022,9.022,0,1,1,9.022-9.022A9.025,9.025,0,0,1,20.849,27.055Zm0-14.435a5.413,5.413,0,1,0,5.413,5.413A5.406,5.406,0,0,0,20.849,12.62Z" transform="translate(-1 -4.5)" fill="currentColor"/>
                              </svg>
                            </span>
                          </a>
                        ) : (
                          <a className="portfolio__items--thumbnail__link glightbox" data-gallery="portfolio" href={getImageUrl(item.image, `assets/img/other/portfolio${(i % 6) + 1}.webp`)}>
                            <img className="portfolio__items--thumbnail__img" src={getImageUrl(item.image, `assets/img/other/portfolio${(i % 6) + 1}.webp`)} alt={item.title || 'portfolio-img'}
                              onError={e => { e.target.onerror = null; e.target.src = `assets/img/other/portfolio${(i % 6) + 1}.webp` }} />
                            <span className="portfolio__view--icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="39.697" height="27.066" viewBox="0 0 39.697 27.066">
                                <path d="M20.849,4.5A21.341,21.341,0,0,0,1,18.033a21.322,21.322,0,0,0,39.7,0A21.341,21.341,0,0,0,20.849,4.5Zm0,22.555a9.022,9.022,0,1,1,9.022-9.022A9.025,9.025,0,0,1,20.849,27.055Zm0-14.435a5.413,5.413,0,1,0,5.413,5.413A5.406,5.406,0,0,0,20.849,12.62Z" transform="translate(-1 -4.5)" fill="currentColor"/>
                              </svg>
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Portfolio
