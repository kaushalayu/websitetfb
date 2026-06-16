import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetails from './pages/BlogDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Compare from './pages/Compare'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Login from './pages/Login'
import MyAccount from './pages/MyAccount'
import MyAccount2 from './pages/MyAccount2'
import NotFound from './pages/NotFound'
import Portfolio from './pages/Portfolio'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ProductVariable from './pages/ProductVariable'
import Shop from './pages/Shop'
import Wishlist from './pages/Wishlist'

const Layout = () => (
  <ErrorBoundary>
    <Header />
    <Outlet />
    <Footer />
  </ErrorBoundary>
)

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog-details', element: <BlogDetails /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/compare', element: <Compare /> },
      { path: '/contact', element: <Contact /> },
      { path: '/faq', element: <Faq /> },
      { path: '/login', element: <Login /> },
      { path: '/my-account', element: <MyAccount /> },
      { path: '/my-account-2', element: <MyAccount2 /> },
      { path: '/portfolio', element: <Portfolio /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/product-variable', element: <ProductVariable /> },
      { path: '/shop-grid', element: <Navigate to="/shop" replace /> },
      { path: '/shop', element: <Shop /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

const App = () => <RouterProvider router={router} />

export default App
