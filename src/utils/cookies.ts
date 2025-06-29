export interface CookieConsent {
  analytics: boolean
  preferences: boolean
  marketing: boolean
  timestamp: string
}

const COOKIE_CONSENT_KEY = 'market-mage-cookie-consent'
const COOKIE_PREFERENCES_KEY = 'market-mage-preferences'

export const cookieUtils = {
  // Get cookie consent
  getCookieConsent: (): CookieConsent | null => {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },

  // Set cookie consent
  setCookieConsent: (consent: CookieConsent): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent))
    } catch (error) {
      console.error('Error saving cookie consent:', error)
    }
  },

  // Check if user has given consent
  hasConsent: (): boolean => {
    const consent = cookieUtils.getCookieConsent()
    return consent !== null
  },

  // Get user preferences
  getPreferences: (): Record<string, unknown> => {
    if (typeof window === 'undefined') return {}

    try {
      const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  },

  // Set user preferences
  setPreferences: (preferences: Record<string, unknown>): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  },

  // Clear all cookies and preferences
  clearAll: (): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY)
      localStorage.removeItem(COOKIE_PREFERENCES_KEY)
    } catch (error) {
      console.error('Error clearing cookies:', error)
    }
  },
}
