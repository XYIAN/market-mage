'use client'

import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { cookieUtils, CookieConsent } from '@/utils/cookies'

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    analytics: true,
    preferences: true,
    marketing: false,
    timestamp: new Date().toISOString(),
  })

  useEffect(() => {
    // Only show banner if user hasn't given consent
    if (!cookieUtils.hasConsent()) {
      setVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const fullConsent: CookieConsent = {
      analytics: true,
      preferences: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    cookieUtils.setCookieConsent(fullConsent)
    setVisible(false)
  }

  const handleAcceptSelected = () => {
    cookieUtils.setCookieConsent(consent)
    setVisible(false)
  }

  const handleDecline = () => {
    const minimalConsent: CookieConsent = {
      analytics: false,
      preferences: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    cookieUtils.setCookieConsent(minimalConsent)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="w-full max-w-4xl mx-auto bg-black/90 border border-blue-500/30">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧙</span>
              <h3 className="text-lg font-bold text-blue-200">
                The Wizard&apos;s Cookie Spell
              </h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              This mystical realm uses cookies to enhance your trading
              experience. Choose which magical enhancements you&apos;d like to
              accept.
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent({ ...consent, analytics: e.checked ?? true })
                  }
                />
                <label className="text-sm text-gray-300">
                  <span className="font-semibold text-blue-200">
                    Analytics Spells
                  </span>{' '}
                  - Help us improve the magical experience
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={consent.preferences}
                  onChange={(e) =>
                    setConsent({ ...consent, preferences: e.checked ?? true })
                  }
                />
                <label className="text-sm text-gray-300">
                  <span className="font-semibold text-blue-200">
                    Preference Charms
                  </span>{' '}
                  - Remember your magical settings
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent({ ...consent, marketing: e.checked ?? false })
                  }
                />
                <label className="text-sm text-gray-300">
                  <span className="font-semibold text-blue-200">
                    Marketing Portals
                  </span>{' '}
                  - Receive updates about new spells and features
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-fit">
            <Button
              label="Accept All Spells"
              icon="pi pi-check"
              className="p-button-primary p-button-sm"
              onClick={handleAcceptAll}
            />
            <Button
              label="Accept Selected"
              icon="pi pi-check-circle"
              className="p-button-secondary p-button-sm"
              onClick={handleAcceptSelected}
            />
            <Button
              label="Decline All"
              icon="pi pi-times"
              className="p-button-text p-button-sm"
              onClick={handleDecline}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
