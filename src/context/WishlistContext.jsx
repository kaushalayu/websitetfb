import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { wishlistAPI } from '../services/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return }
    setLoading(true)
    try {
      const res = await wishlistAPI.get()
      setItems(res.wishlist?.items || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetchWishlist() }, [fetchWishlist])

  const addItem = useCallback(async (productId) => {
    if (!user) return
    try {
      const res = await wishlistAPI.add(productId)
      setItems(res.wishlist?.items || [])
    } catch (e) { throw e }
  }, [user])

  const removeItem = useCallback(async (productId) => {
    if (!user) return
    try {
      const res = await wishlistAPI.remove(productId)
      setItems(res.wishlist?.items || [])
    } catch (e) { throw e }
  }, [user])

  const isInWishlist = useCallback((productId) => {
    return items.some((i) => (i._id || i) === productId)
  }, [items])

  return (
    <WishlistContext.Provider value={{ items, loading, addItem, removeItem, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
