import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { faqAPI } from '../services/api'
import NewsletterBanner from '../components/NewsletterBanner'

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item ${open ? 'active' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)} type="button">
        <span>{question}</span>
        <svg className="faq-icon" viewBox="0 0 24 24" width="20" height="20">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  )
}

const categories = [
  { key: 'shipping', title: 'Shipping Information' },
  { key: 'payment', title: 'Payment Information' },
  { key: 'orders', title: 'Orders & Returns' },
  { key: 'general', title: 'General Information' },
]

const Faq = () => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    faqAPI.list()
      .then((res) => {
        if (res.success) {
          setFaqs(res.data.filter((f) => f.isActive))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getByCategory = (key) =>
    faqs.filter((f) => f.category === key)

  const visibleCategories = categories.filter(({ key }) =>
    faqs.some((f) => f.category === key)
  )

  return (
    <main className="main__content_wrapper">
      <section className="breadcrumb__section breadcrumb__bg">
        <div className="container">
          <div className="row row-cols-1">
            <div className="col">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title text-white mb-10">Frequently Asked Questions</h1>
                <ul className="breadcrumb__content--menu d-flex">
                  <li className="breadcrumb__content--menu__items">
                    <Link className="text-white" to="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span className="text-white">FAQ</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq__section section--padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-40">
                <h2 className="faq-section-title">Have Questions? We've Got Answers</h2>
                <p className="faq-section-subtitle">Everything you need to know about shopping at The Furniture Boutique</p>
              </div>

              {loading ? (
                <div className="faq-loading">Loading FAQs...</div>
              ) : visibleCategories.length === 0 ? (
                <div className="faq-empty">No FAQs available yet.</div>
              ) : (
                visibleCategories.map(({ key, title }) => {
                  const items = getByCategory(key)
                  return (
                    <div className="faq-category" key={key}>
                      <h3 className="faq-category-title">{title}</h3>
                      {items.map((item) => (
                        <FaqItem key={item._id} question={item.question} answer={item.answer} />
                      ))}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsletterBanner />
    </main>
  )
}

export default Faq
