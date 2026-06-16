import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { cartAPI } from '../services/api'

const CartContext = createContext(null)

const CART_KEY = 'furniture_cart'

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const getToken = () => localStorage.getItem('token')

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    const token = getToken()
    if (!token) return
    cartAPI.get().then((data) => {
      const serverItems = Array.isArray(data) ? data : data?.data?.items || data?.items || []
      if (!serverItems.length) return
      const mapped = serverItems.map((si) => {
        const prod = si.product || si.productId || {}
        const prodId = prod._id || prod
        return {
          product: typeof prod === 'object' && prod !== null ? prod : { _id: prodId },
          quantity: si.quantity,
          selectedColor: si.selectedColor || '',
          selectedSize: si.selectedSize || '',
          variantKey: `${prodId}_${si.selectedColor || ''}_${si.selectedSize || ''}`,
          _id: si._id,
          image: si.image || '',
        }
      })
      setItems((prev) => {
        const merged = [...mapped]
        for (const local of prev) {
          if (!merged.find((m) => m.variantKey === local.variantKey)) {
            merged.push(local)
          }
        }
        return merged
      })
    }).catch(() => {})
  }, [])

  const addItem = useCallback((product, quantity = 1, selectedColor = '', selectedSize = '') => {
    setItems((prev) => {
      const variantKey = `${product._id || product._id}_${selectedColor}_${selectedSize}`
      const existing = prev.find(
        (i) => i.product._id === product._id && i.selectedColor === selectedColor && i.selectedSize === selectedSize
      )
      const token = getToken()
      if (token) {
        cartAPI.add({ productId: product._id, quantity, selectedColor, selectedSize }).catch(() => {})
      }
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id && i.selectedColor === selectedColor && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { product, quantity, selectedColor, selectedSize, variantKey }]
    })
  }, [])

  const removeItem = useCallback((variantKey) => {
    setItems((prev) => {
      const token = getToken()
      if (token) {
        const item = prev.find((i) => i.variantKey === variantKey)
        if (item?._id) cartAPI.remove(item._id).catch(() => {})
      }
      return prev.filter((i) => i.variantKey !== variantKey)
    })
  }, [])

  const updateQuantity = useCallback((variantKey, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => {
        const token = getToken()
        if (token) {
          const item = prev.find((i) => i.variantKey === variantKey)
          if (item?._id) cartAPI.remove(item._id)
        }
        return prev.filter((i) => i.variantKey !== variantKey)
      })
      return
    }
    setItems((prev) => {
      const token = getToken()
      if (token) {
        const item = prev.find((i) => i.variantKey === variantKey)
        if (item?._id) cartAPI.update(item._id, { quantity }).catch(() => {})
      }
      return prev.map((i) => (i.variantKey === variantKey ? { ...i, quantity } : i))
    })
  }, [])

  const clearCart = useCallback(() => {
    const token = getToken()
    if (token) cartAPI.clear()
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + (i.product.salePrice || i.product.price || 0) * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
