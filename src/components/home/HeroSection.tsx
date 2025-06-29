'use client'

import '@/styles/components/hero.css'

export const HeroSection = () => {
  return (
    <div className="hero-section flex justify-center mb-8">
      <div className="text-center max-w-4xl">
        <div className="mb-6">
          <i className="pi pi-magic text-6xl mb-4 dark-blue-glow"></i>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="hero-title-glow">Market</span>
            <span> </span>
            <span className="hero-title-glow">Mage</span>
          </h1>
          <p className="text-xl mb-6">
            AI-powered trading insights and portfolio management
          </p>
        </div>
      </div>
    </div>
  )
}
