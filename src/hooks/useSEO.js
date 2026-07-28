import { useEffect } from 'react'

const SITE = 'https://thefurnitureboutique.in'
const SITE_NAME = 'The Furniture Boutique'
const DEFAULT_IMG = `${SITE}/assets/img/banner/banner1.webp`

/**
 * useSEO — sets document.title, meta description, canonical, og/twitter tags,
 * and optionally injects a JSON-LD schema script into <head>.
 *
 * @param {object} options
 * @param {string} options.title        — page title (without site name suffix)
 * @param {string} options.description  — meta description (max ~160 chars)
 * @param {string} [options.canonical]  — canonical URL path e.g. '/shop'
 * @param {string} [options.image]      — og:image absolute URL
 * @param {string} [options.type]       — og:type, defaults to 'website'
 * @param {object} [options.schema]     — JSON-LD object to inject
 * @param {boolean}[options.noindex]    — set true for noindex pages
 */
const useSEO = ({ title, description, canonical, image, type = 'website', schema, noindex = false }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Premium Furniture Store in Lucknow`

    // Ensure image is always an absolute URL
    const toAbsolute = (url) => {
      if (!url) return DEFAULT_IMG
      if (url.startsWith('http://') || url.startsWith('https://')) return url
      return `${SITE}/${url.replace(/^\//, '')}`
    }
    const img = toAbsolute(image)

    const canonicalUrl = canonical ? `${SITE}${canonical}` : null

    // --- Title ---
    document.title = fullTitle

    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        // parse out the attribute key/value from the selector
        const match = selector.match(/\[([^\]]+)="([^\]]+)"\]/)
        if (match) el.setAttribute(match[1], match[2])
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    // --- Meta description ---
    setMeta('meta[name="description"]', 'content', description || '')

    // --- Robots ---
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow')

    // --- Canonical ---
    if (canonicalUrl) setLink('canonical', canonicalUrl)

    // --- Open Graph ---
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', description || '')
    setMeta('meta[property="og:image"]', 'content', img)
    setMeta('meta[property="og:type"]', 'content', type)
    if (canonicalUrl) setMeta('meta[property="og:url"]', 'content', canonicalUrl)

    // --- Twitter ---
    setMeta('meta[name="twitter:title"]', 'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', description || '')
    setMeta('meta[name="twitter:image"]', 'content', img)

    // --- JSON-LD Schema ---
    const SCHEMA_ID = 'page-schema-ld'
    let schemaEl = document.getElementById(SCHEMA_ID)
    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script')
        schemaEl.id = SCHEMA_ID
        schemaEl.type = 'application/ld+json'
        document.head.appendChild(schemaEl)
      }
      schemaEl.textContent = JSON.stringify(schema)
    } else if (schemaEl) {
      schemaEl.remove()
    }

    // Cleanup on unmount — restore defaults
    return () => {
      document.title = `${SITE_NAME} - Premium Furniture Store in Lucknow`
    }
  }, [title, description, canonical, image, type, schema, noindex])
}

export default useSEO
export { SITE, SITE_NAME }
