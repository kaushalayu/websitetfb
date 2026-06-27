import { createContext, useContext, useState, useEffect } from 'react'
import { settingsAPI } from '../services/api'

const SettingsContext = createContext(null)

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'The Furniture Boutique',
    siteLogo: '',
    favicon: '',
    address: '',
    email: '',
    phone: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    whatsapp: '',
    dealEndDate: null,
    dealTitle: 'Teakwood Dining Showcase',
    dealDesc: 'Premium Teakwood Dining set — high durability, hand-varnished polish.',
    dealImage: '',
    bannerVideoUrl: '',
    instagramPosts: [],
    instagramHandle: '@wooden_furniture_lucknow',
  })

  useEffect(() => {
    settingsAPI.get()
      .then(data => {
        if (data && typeof data === 'object') {
          setSettings(prev => ({ ...prev, ...(data.data || data) }))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
