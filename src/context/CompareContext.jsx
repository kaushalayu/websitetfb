import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { compareAPI } from '../services/api'
import { useAuth } from './AuthContext'

const CompareContext = createContext(null)

export const CompareProvider = ({ children }) => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCompare = useCallback(async () => {
    if (!user) { setItems([]); return }
    setLoading(true)
    try {
      const res = await compareAPI.get()
      setItems(res.compare?.items || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetchCompare() }, [fetchCompare])

  const addItem = useCallback(async (productId) => {
    if (!user) return
    try {
      const res = await compareAPI.add(productId)
      setItems(res.compare?.items || [])
    } catch (e) { throw e }
  }, [user])

  const removeItem = useCallback(async (productId) => {
    if (!user) return
    try {
      const res = await compareAPI.remove(productId)
      setItems(res.compare?.items || [])
    } catch (e) { throw e }
  }, [user])

  const isInCompare = useCallback((productId) => {
    return items.some((i) => (i._id || i) === productId)
  }, [items])

  return (
    <CompareContext.Provider value={{ items, loading, addItem, removeItem, isInCompare, fetchCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
