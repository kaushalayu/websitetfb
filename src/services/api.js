import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'http://localhost:5001/api'
export const STATIC_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

/**
 * Converts a relative /uploads/... path to a full URL.
 * If already absolute (http/https), returns as-is.
 * If empty/null, returns the fallback.
 */
export const getImageUrl = (url, fallback = 'assets/img/product/product1.webp') => {
  if (!url) return fallback
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    return `${STATIC_BASE}/${url.replace(/^\//, '')}`
  }
  return url
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(err)
  }
)

const handle = (promise) =>
  promise.then((res) => res.data).catch((err) => {
    const msg = err.response?.data?.message || err.message || 'Something went wrong'
    throw new Error(msg)
  })

export const authAPI = {
  register: (data) => handle(api.post('/auth/register', data)),
  login: (data) => handle(api.post('/auth/login', data)),
  me: () => handle(api.get('/auth/me')),
  forgotPassword: (email) => handle(api.post('/auth/forgot-password', { email })),
  resetPassword: (data) => handle(api.post('/auth/reset-password', data)),
}

export const accountAPI = {
  getProfile: () => handle(api.get('/account/profile')),
  updateProfile: (data) => handle(api.put('/account/profile', data)),
  changePassword: (data) => handle(api.post('/account/change-password', data)),
  getAddresses: () => handle(api.get('/account/addresses')),
  updateAddresses: (data) => handle(api.put('/account/addresses', data)),
}

export const locationAPI = {
  getCountries: () => handle(api.get('/locations/countries')),
}

export const productAPI = {
  list: (params) => handle(api.get('/products', { params })),
  getBySlug: (slug) => handle(api.get(`/products/${slug}`)),
  getRelated: (slug) => handle(api.get(`/products/${slug}/related`)),
}

export const categoryAPI = {
  list: () => handle(api.get('/categories')),
  getBySlug: (slug) => handle(api.get(`/categories/${slug}`)),
}

export const blogAPI = {
  list: (params) => handle(api.get('/blog', { params })),
  getBySlug: (slug) => handle(api.get(`/blog/${slug}`)),
  categories: () => handle(api.get('/blog/categories')),
  tags: () => handle(api.get('/blog/tags')),
}

export const faqAPI = {
  list: (params) => handle(api.get('/faq', { params })),
}

export const contactAPI = {
  submit: (data) => handle(api.post('/contact', data)),
}

export const newsletterAPI = {
  subscribe: (email) => handle(api.post('/newsletter/subscribe', { email })),
  unsubscribe: (email) => handle(api.post('/newsletter/unsubscribe', { email })),
}

export const wishlistAPI = {
  get: () => handle(api.get('/wishlist')),
  add: (productId) => handle(api.post('/wishlist', { productId })),
  remove: (productId) => handle(api.delete(`/wishlist/${productId}`)),
}

export const compareAPI = {
  get: () => handle(api.get('/compare')),
  add: (productId) => handle(api.post('/compare', { productId })),
  remove: (productId) => handle(api.delete(`/compare/${productId}`)),
}

export const orderAPI = {
  create: (data) => handle(api.post('/orders', data)),
  list: () => handle(api.get('/orders')),
  getById: (id) => handle(api.get(`/orders/${id}`)),
  validateCoupon: (code) => handle(api.post('/orders/coupons/validate', { code })),
}

export const reviewAPI = {
  getProductReviews: (slug) => handle(api.get(`/products/${slug}/reviews`)),
  submit: (slug, data) => handle(api.post(`/products/${slug}/reviews`, data)),
}

export const brandAPI = {
  list: () => handle(api.get('/brands')),
}

export const cartAPI = {
  get: () => handle(api.get('/cart')),
  add: (data) => handle(api.post('/cart', data)),
  update: (itemId, data) => handle(api.put(`/cart/${itemId}`, data)),
  remove: (itemId) => handle(api.delete(`/cart/${itemId}`)),
  clear: () => handle(api.delete('/cart')),
}

export const bannerAPI = {
  list: () => handle(api.get('/banners')),
}

export const testimonialAPI = {
  list: () => handle(api.get('/testimonials')),
}

export const commentAPI = {
  list: (slug) => handle(api.get(`/blog/${slug}/comments`)),
  submit: (slug, data) => handle(api.post(`/blog/${slug}/comments`, data)),
}

export const teamAPI = {
  list: () => handle(api.get('/team')),
}

export const settingsAPI = {
  get: () => handle(api.get('/settings')),
}

export default api
