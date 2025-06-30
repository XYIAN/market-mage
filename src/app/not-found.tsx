'use client'

import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'

/**
 * Custom 404 Not Found Page
 *
 * A wizard-themed error page that provides a magical experience when users
 * encounter missing pages. Features animated elements and easy navigation back home.
 *
 * @component
 * @example
 * ```tsx
 * <NotFound />
 * ```
 *
 * @returns {JSX.Element} A styled 404 page with navigation options
 */
export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center max-w-2xl mx-auto p-8">
        {/* Wizard Icon */}
        <div className="mb-8">
          <img
            src="/icon-mm-1.png"
            alt="Market-Mage Wizard"
            className="w-32 h-32 mx-auto mb-4 animate-pulse"
          />
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Lost in the Magic Realm
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            The page you're seeking has vanished into the mystical void. Perhaps
            it was spirited away by mischievous market spirits?
          </p>
        </div>

        {/* Wizard Quote */}
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <i className="pi pi-magic text-2xl text-purple-400 mr-3"></i>
            <span className="text-purple-400 font-semibold">
              Wizard's Wisdom
            </span>
          </div>
          <p className="text-gray-300 italic">
            "Even the most powerful mages sometimes lose their way. The true
            magic lies in finding your path back to the trading realm."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            label="Return to Home"
            icon="pi pi-home"
            size="large"
            onClick={() => router.push('/')}
            className="p-button-primary p-button-lg"
          />
          <Button
            label="Explore Dashboard"
            icon="pi pi-chart-line"
            size="large"
            onClick={() => router.push('/dashboard')}
            className="p-button-outlined p-button-secondary p-button-lg"
          />
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
