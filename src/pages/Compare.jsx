import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NewsletterBanner from '../components/NewsletterBanner'
import { useCompare } from '../context/CompareContext'
import { useCart } from '../context/CartContext'

const Compare = () => {
  const { items, removeItem } = useCompare()
  const { addItem } = useCart()

  return <>
    <main className="main__content_wrapper">

        {/* Start breadcrumb section */}

        <section className="breadcrumb__section breadcrumb__bg">

            <div className="container">

                <div className="row row-cols-1">

                    <div className="col">

                        <div className="breadcrumb__content">

                            <h1 className="breadcrumb__content--title text-white mb-10">Compare</h1>

                            <ul className="breadcrumb__content--menu d-flex">

                                <li className="breadcrumb__content--menu__items"><Link to="/" className="text-white" >Home</Link></li>

                                <li className="breadcrumb__content--menu__items"><span className="text-white">Compare</span></li>

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        {/* End breadcrumb section */}

        {/* Start Compare section */}

        <section className="compare__section section--padding">

            <div className="container">

                <div className="row row-cols-1">

                    <div className="col">

                        <div className="section__heading text-center mb-40">

                            <h2 className="compare__heading--maintitle">COMPARE PRODUCT PAGE STYLE</h2>

                        </div>

                        <div className="compare__section--inner table-responsive">

                            <table className="compare__table">

                                <thead className="compare__table--header">

                                    <tr className="compare__table--items">

                                        {items.map((product) => (
                                        <td className="compare__table--items__child" key={product._id}>

                                            <button type="button" aria-label="compare remove btn" className="compare__remove" onClick={() => removeItem(product._id)}>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="24.732" viewBox="0 0 512 512"><path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M368 368L144 144M368 144L144 368"></path></svg>

                                            </button>

                                            <h4 className="compare__product--title">{product.title}</h4>

                                            <img className="compare__product--thumbnail" src={getImageUrl(product.images?.[0]?.url, 'assets/img/product/product1.webp')} alt="compare-image" onError={e=>{e.target.onerror=null;e.target.src='assets/img/product/product1.webp'}} />

                                        </td>
                                        ))}

                                    </tr>

                                </thead>

                                <tbody className="compare__table--body">

                                    <tr className="compare__table--items">

                                        {items.map((product) => (
                                        <td className="compare__table--items__child" key={product._id}>

                                            <span className="compare__product--price">₹{Number(product.salePrice || product.price).toLocaleString('en-IN')}</span>

                                        </td>
                                        ))}

                                    </tr>

                                    <tr className="compare__table--items">

                                        {items.map((product) => (
                                        <th className="compare__table--items__child--header" key={product._id}>Product Description</th>
                                        ))}

                                    </tr>

                                    <tr className="compare__table--items">

                                        {items.map((product) => (
                                        <td className="compare__table--items__child" key={product._id}>

                                            <p className="compare__description">{product.description || 'No description available.'}</p>

                                        </td>
                                        ))}

                                    </tr>

                                    <tr className="compare__table--items">

                                        {items.map((product) => (
                                        <th className="compare__table--items__child--header" key={product._id}>Availability</th>
                                        ))}

                                    </tr>

                                    <tr className="compare__table--items">

                                        {items.map((product) => (
                                        <td className="compare__table--items__child" key={product._id}>

                                            <p className="compare__instock text__secondary">In stock</p>

                                        </td>
                                        ))}

                                    </tr>

                                    <tr className="compare__table--items">

                                        {items.map((product) => (
                                        <td className="compare__table--items__child text-center" key={product._id}>

                                            <button className="compare__cart--btn primary__btn" onClick={() => addItem(product, 1)} >Add to Cart</button>

                                        </td>
                                        ))}

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        {/* End Compare section */}

        <NewsletterBanner />

    </main>

  </>;
};

export default Compare;
