import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { teamAPI, getImageUrl } from '../services/api'
import NewsletterBanner from '../components/NewsletterBanner'

const counters = [
  { label: 'YEARS OF FOUNDATION', target: 50 },
  { label: 'SKILLED TEAM MEMBERS', target: 100 },
  { label: 'HAPPY CUSTOMERS', target: 80 },
  { label: 'MONTHLY ORDERS', target: 70 },
]

const useCountUp = (ref, target) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        let current = 0
        const step = Math.ceil(target / 60)
        const timer = setInterval(() => {
          current += step
          if (current >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(current)
          }
        }, 25)
        observer.disconnect()
        return () => clearInterval(timer)
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, target])

  return count
}

const CounterItem = ({ item }) => {
  const ref = useRef(null)
  const count = useCountUp(ref, item.target)

  return (
    <div className="counterup__banner--items text-center" ref={ref}>
      <p className="counterup__banner--items__text text-white">{item.label}</p>
      <span className="counterup__banner--items__number text-white">{count}</span>
    </div>
  )
}

const About = () => {
  const [team, setTeam] = useState([])

  useEffect(() => {
    teamAPI.list()
      .then(res => setTeam(Array.isArray(res) ? res : res.data || []))
      .catch(() => setTeam([]))
  }, [])

  return (
    <>
      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">About us</h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items"><Link to="/" className="text-white">Home</Link></li>
                  <li className="breadcrumb__content--menu__items"><span className="text-white">About us</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about__section section--padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="about__thumbnail d-flex">
                <div className="about__thumbnail--items">
                  <img className="about__thumbnail--img border-radius-5 display-block" src="assets/img/other/about-thumb-list1.webp" alt="about-thumbnail" />
                </div>
                <div className="about__thumbnail--items position__relative">
                  <img className="about__thumbnail--img border-radius-5 display-block" src="assets/img/other/about-thumb-list2.webp" alt="about-thumbnail" />
                  <div className="banner__bideo--play about__thumbnail--play">
                    <a className="bideo__play--icon glightbox" data-gallery="video" href="https://vimeo.com/115041822">
                      <svg id="play" xmlns="http://www.w3.org/2000/svg" width="46.302" height="46.302" viewBox="0 0 46.302 46.302">
                        <g id="Group_193" data-name="Group 193" transform="translate(0 0)">
                          <path id="Path_116" data-name="Path 116" d="M39.521,6.781a23.151,23.151,0,0,0-32.74,32.74,23.151,23.151,0,0,0,32.74-32.74ZM23.151,44.457A21.306,21.306,0,1,1,44.457,23.151,21.33,21.33,0,0,1,23.151,44.457Z" fill="currentColor"></path>
                          <g id="Group_188" data-name="Group 188" transform="translate(15.588 11.19)">
                            <g id="Group_187" data-name="Group 187">
                              <path id="Path_117" data-name="Path 117" d="M190.3,133.213l-13.256-8.964a3,3,0,0,0-4.674,2.482v17.929a2.994,2.994,0,0,0,4.674,2.481l13.256-8.964a3,3,0,0,0,0-4.963Zm-1.033,3.435-13.256,8.964a1.151,1.151,0,0,1-1.8-.953V126.73a1.134,1.134,0,0,1,.611-1.017,1.134,1.134,0,0,1,1.185.063l13.256,8.964a1.151,1.151,0,0,1,0,1.907Z" transform="translate(-172.366 -123.734)" fill="currentColor"></path>
                            </g>
                          </g>
                          <g id="Group_190" data-name="Group 190" transform="translate(28.593 5.401)">
                            <g id="Group_189" data-name="Group 189">
                              <path id="Path_118" data-name="Path 118" d="M328.31,70.492a18.965,18.965,0,0,0-10.886-10.708.922.922,0,1,0-.653,1.725,17.117,17.117,0,0,1,9.825,9.664.922.922,0,1,0,1.714-.682Z" transform="translate(-316.174 -59.724)" fill="currentColor"></path>
                            </g>
                          </g>
                          <g id="Group_192" data-name="Group 192" transform="translate(22.228 4.243)">
                            <g id="Group_191" data-name="Group 191">
                              <path id="Path_119" data-name="Path 119" d="M249.922,47.187a19.08,19.08,0,0,0-3.2-.27.922.922,0,0,0,0,1.845,17.245,17.245,0,0,1,2.889.243.922.922,0,1,0,.31-1.818Z" transform="translate(-245.801 -46.917)" fill="currentColor"></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                      <span className="visually-hidden">Play</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about__content">
                <span className="about__content--subtitle text__secondary mb-20">Why Choose Us</span>
                <h2 className="about__content--maintitle mb-25">Premium Wooden Furniture Crafted with Indian Tradition</h2>
                <p className="about__content--desc mb-20">We take pride in offering handcrafted wooden furniture that blends timeless Indian craftsmanship with modern design. Every piece is carefully sourced from skilled artisans across India — from the cedar woods of Kashmir to the rosewood carvings of Saharanpur.</p>
                <p className="about__content--desc mb-25">Our commitment to quality means we personally oversee every stage — from raw timber selection to the final polish. We don't just sell furniture; we bring heritage, durability, and elegance to your home. All our products come with a 5-year warranty and free pan-India delivery.</p>
                <div className="about__author position__relative">
                  <h4 className="about__author--name">Arjun Mehta</h4>
                  <span className="about__author--rank">Founder & Master Craftsman</span>
                  <img className="about__author--signature" src="assets/img/icon/signature.webp" alt="signature" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="counterup__banner--section counterup__banner__bg2" id="funfactId">
        <div className="container">
          <div className="row row-cols-1 align-items-center">
            <div className="col">
              <div className="counterup__banner--inner position__relative d-flex align-items-center justify-content-between">
                {counters.map((item, idx) => (
                  <CounterItem key={idx} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="team__section section--padding">
        <div className="container">
          <div className="section__heading text-center mb-30">
            <h2 className="section__heading--maintitle">Our Team</h2>
          </div>
          <div className="team__container">
            <div className="row">
              {team.length === 0 ? (
                <div className="col-12 text-center" style={{ padding: '40px 0', color: '#999' }}>
                  <p>No team members found.</p>
                </div>
              ) : (
                team.filter(m => m.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0)).map(member => (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-6 custom-col" key={member._id}>
                    <div className="team__items text-center">
                      <div className="team__thumbnail">
                        <img className="team__thumbnail--img border-radius-50 display-block" src={getImageUrl(member.image, 'assets/img/other/team1.webp')} alt={member.name} />
                      </div>
                      <div className="team__content">
                        <h3 className="team__content--title">{member.name}</h3>
                        <span className="team__content--subtitle">{member.title}</span>
                        <ul className="team__social d-flex justify-content-center align-items-center">
                          {(member.socialLinks?.facebook || member.socialLinks?.twitter || member.socialLinks?.skype || member.socialLinks?.youtube) ? (
                            <>
                              {member.socialLinks.facebook && (
                                <li className="team__social--list">
                                  <a className="team__social--icon" target="_blank" href={member.socialLinks.facebook}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="7.667" height="16.524" viewBox="0 0 7.667 16.524">
                                      <path data-name="Path 237" d="M967.495,353.678h-2.3v8.253h-3.437v-8.253H960.13V350.77h1.624v-1.888a4.087,4.087,0,0,1,.264-1.492,2.9,2.9,0,0,1,1.039-1.379,3.626,3.626,0,0,1,2.153-.6l2.549.019v2.833h-1.851a.732.732,0,0,0-.472.151.8.8,0,0,0-.246.642v1.719H967.8Z" transform="translate(-960.13 -345.407)" fill="currentColor"/>
                                    </svg>
                                    <span className="visually-hidden">Facebook</span>
                                  </a>
                                </li>
                              )}
                              {member.socialLinks.twitter && (
                                <li className="team__social--list">
                                  <a className="team__social--icon" target="_blank" href={member.socialLinks.twitter}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16.489" height="13.384" viewBox="0 0 16.489 13.384">
                                      <path data-name="Path 303" d="M966.025,1144.2v.433a9.783,9.783,0,0,1-.621,3.388,10.1,10.1,0,0,1-1.845,3.087,9.153,9.153,0,0,1-3.012,2.259,9.825,9.825,0,0,1-4.122.866,9.632,9.632,0,0,1-2.748-.4,9.346,9.346,0,0,1-2.447-1.11q.4.038.809.038a6.723,6.723,0,0,0,2.24-.376,7.022,7.022,0,0,0,1.958-1.054,3.379,3.379,0,0,1-1.958-.687,3.259,3.259,0,0,1-1.186-1.666,3.364,3.364,0,0,0,.621.056,3.488,3.488,0,0,0,.885-.113,3.267,3.267,0,0,1-1.374-.631,3.356,3.356,0,0,1-.969-1.186,3.524,3.524,0,0,1-.367-1.5v-.057a3.172,3.172,0,0,0,1.544.433,3.407,3.407,0,0,1-1.1-1.214,3.308,3.308,0,0,1-.4-1.609,3.362,3.362,0,0,1,.452-1.694,9.652,9.652,0,0,0,6.964,3.538,3.911,3.911,0,0,1-.075-.772,3.293,3.293,0,0,1,.452-1.694,3.409,3.409,0,0,1,1.233-1.233,3.257,3.257,0,0,1,1.685-.461,3.351,3.351,0,0,1,2.466,1.073,6.572,6.572,0,0,0,2.146-.828,3.272,3.272,0,0,1-.574,1.083,3.477,3.477,0,0,1-.913.8,6.869,6.869,0,0,0,1.958-.546A7.074,7.074,0,0,1,966.025,1144.2Z" transform="translate(-951.23 -1140.849)" fill="currentColor"/>
                                    </svg>
                                    <span className="visually-hidden">Twitter</span>
                                  </a>
                                </li>
                              )}
                              {member.socialLinks.skype && (
                                <li className="team__social--list">
                                  <a className="team__social--icon" target="_blank" href={member.socialLinks.skype}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16.482" height="16.481" viewBox="0 0 16.482 16.481">
                                      <path data-name="Path 284" d="M879,926.615a4.479,4.479,0,0,1,.622-2.317,4.666,4.666,0,0,1,1.676-1.677,4.482,4.482,0,0,1,2.317-.622,4.577,4.577,0,0,1,2.43.678,7.58,7.58,0,0,1,5.048.961,7.561,7.561,0,0,1,3.786,6.593,8,8,0,0,1-.094,1.206,4.676,4.676,0,0,1,.7,2.411,4.53,4.53,0,0,1-.622,2.326,4.62,4.62,0,0,1-1.686,1.686,4.626,4.626,0,0,1-4.756-.075,7.7,7.7,0,0,1-1.187.094,7.623,7.623,0,0,1-7.647-7.647,7.46,7.46,0,0,1,.094-1.187A4.424,4.424,0,0,1,879,926.615Zm4.107,1.714a2.473,2.473,0,0,0,.282,1.234,2.41,2.41,0,0,0,.782.829,5.091,5.091,0,0,0,1.215.565,15.981,15.981,0,0,0,1.582.424q.678.151.979.235a3.091,3.091,0,0,1,.593.235,1.388,1.388,0,0,1,.452.348.738.738,0,0,1,.16.481.91.91,0,0,1-.48.753,2.254,2.254,0,0,1-1.271.321,2.105,2.105,0,0,1-1.253-.292,2.262,2.262,0,0,1-.65-.838,2.42,2.42,0,0,0-.414-.546.853.853,0,0,0-.584-.17.893.893,0,0,0-.669.283.919.919,0,0,0-.273.659,1.654,1.654,0,0,0,.217.782,2.456,2.456,0,0,0,.678.763,3.64,3.64,0,0,0,1.158.574,5.931,5.931,0,0,0,1.639.235,5.767,5.767,0,0,0,2.072-.339,2.982,2.982,0,0,0,1.356-.961,2.306,2.306,0,0,0,.471-1.431,2.161,2.161,0,0,0-.443-1.375,3.009,3.009,0,0,0-1.2-.894,10.118,10.118,0,0,0-1.865-.575,11.2,11.2,0,0,1-1.309-.311,2.011,2.011,0,0,1-.8-.452.992.992,0,0,1-.3-.744,1.143,1.143,0,0,1,.565-.97,2.59,2.59,0,0,1,1.488-.386,2.538,2.538,0,0,1,1.074.188,1.634,1.634,0,0,1,.622.49,3.477,3.477,0,0,1,.414.753,1.568,1.568,0,0,0,.4.594.866.866,0,0,0,.574.2,1,1,0,0,0,.706-.254.828.828,0,0,0,.273-.631,2.234,2.234,0,0,0-.443-1.253,3.321,3.321,0,0,0-1.158-1.046,5.375,5.375,0,0,0-2.524-.527,5.764,5.764,0,0,0-2.213.386,3.161,3.161,0,0,0-1.422,1.083A2.738,2.738,0,0,0,883.106,928.329Z" transform="translate(-878.999 -922)" fill="currentColor"/>
                                    </svg>
                                    <span className="visually-hidden">Skype</span>
                                  </a>
                                </li>
                              )}
                              {member.socialLinks.youtube && (
                                <li className="team__social--list">
                                  <a className="team__social--icon" target="_blank" href={member.socialLinks.youtube}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16.49" height="11.582" viewBox="0 0 16.49 11.582">
                                      <path data-name="Path 321" d="M967.759,1365.592q0,1.377-.019,1.717-.076,1.114-.151,1.622a3.981,3.981,0,0,1-.245.925,1.847,1.847,0,0,1-.453.717,2.171,2.171,0,0,1-1.151.6q-3.585.265-7.641.189-2.377-.038-3.387-.085a11.337,11.337,0,0,1-1.5-.142,2.206,2.206,0,0,1-1.113-.585,2.562,2.562,0,0,1-.528-1.037,3.523,3.523,0,0,1-.141-.585c-.032-.2-.06-.5-.085-.906a38.894,38.894,0,0,1,0-4.867l.113-.925a4.382,4.382,0,0,1,.208-.906,2.069,2.069,0,0,1,.491-.755,2.409,2.409,0,0,1,1.113-.566,19.2,19.2,0,0,1,2.292-.151q1.82-.056,3.953-.056t3.952.066q1.821.067,2.311.142a2.3,2.3,0,0,1,.726.283,1.865,1.865,0,0,1,.557.49,3.425,3.425,0,0,1,.434,1.019,5.72,5.72,0,0,1,.189,1.075q0,.095.057,1C967.752,1364.1,967.759,1364.677,967.759,1365.592Zm-7.6.925q1.49-.754,2.113-1.094l-4.434-2.339v4.66Q958.609,1367.311,960.156,1366.517Z" transform="translate(-951.269 -1359.8)" fill="currentColor"/>
                                    </svg>
                                    <span className="visually-hidden">Youtube</span>
                                  </a>
                                </li>
                              )}
                            </>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsletterBanner />
    </>
  )
}

export default About