'use client'

import Link from 'next/link'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

export const CallToAction = () => {
  return (
    <div className="flex justify-center mb-8">
      <Card className="w-full max-w-2xl">
        <div className="p-1rem text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🧙</span>
            <h3 className="text-xl font-semibold">
              Ready to Start Trading Smarter?
            </h3>
          </div>
          <p className="mb-6 text-gray-300">
            Access your personalized market dashboard with AI-powered insights,
            real-time data, and advanced portfolio management tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/market">
              <Button
                label="Open Market Dashboard"
                icon="pi pi-chart-line"
                className="p-button-primary"
              />
            </Link>
            <Link href="/crypto">
              <Button
                label="Open Crypto Dashboard"
                icon="pi pi-bitcoin"
                className="p-button-secondary"
              />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
