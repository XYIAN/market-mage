'use client'

import Link from 'next/link'
import { Button } from 'primereact/button'

export const HeroSection = () => {
  return (
    <div className="text-center mb-8">
      <div className="mb-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-primary">Market</span>
          <span>-</span>
          <span className="text-primary">Mage</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Your AI-powered companion for intelligent trading decisions. Get
          real-time market insights, track your portfolio, and receive daily
          AI-generated trading recommendations.
        </p>
        <Link href="/dashboard">
          <Button
            label="Launch Dashboard"
            icon="pi pi-chart-line"
            className="p-button-lg"
            size="large"
          />
        </Link>
      </div>
    </div>
  )
}
