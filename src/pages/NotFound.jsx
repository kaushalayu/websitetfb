import { Link } from 'react-router-dom'
import NewsletterBanner from '../components/NewsletterBanner'

const NotFound = () => {
  return (
    <>
<section className="error__section section--padding">

            <div className="container">

                <div className="row row-cols-1">

                    <div className="col">

                        <div className="error__content text-center">

                            <img className="error__content--img mb-50" src="assets/img/other/404-thumb.webp" alt="error-img" />

                            <h2 className="error__content--title">Opps ! We're not found this page  </h2>

                            <p className="error__content--desc">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi animi aliquid minima assumenda.</p>

                            <Link to="/" className="error__content--btn primary__btn">Back To Home</Link>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        

        

        <NewsletterBanner noGapTop />
    </>
  )
}

export default NotFound
