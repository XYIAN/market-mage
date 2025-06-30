'use client'

import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'

export const CallToAction = () => {
  const router = useRouter()

  return (
    <div className="text-center mb-12">
      <div className="bg-gradient-to-r from-primary to-purple-600 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Trading?
        </h2>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Join thousands of traders using Market-Mage to make smarter investment
          decisions. Get started with your personalized dashboard today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            label="Create Dashboard"
            icon="pi pi-plus"
            size="large"
            onClick={() => router.push('/dashboard')}
            className="p-button-primary"
          />
          <Button
            label="Learn More"
            icon="pi pi-info-circle"
            size="large"
            onClick={() => router.push('/about')}
            className="p-button-outlined p-button-secondary"
          />
        </div>
      </div>
    </div>
  )
}
