'use client'

import Link from 'next/link'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

export const CallToAction = () => {
  return (
    <div className="flex justify-center mb-8">
      <Card
        className="max-w-4xl w-[85%] md:w-[65%] lg:w-[50%]"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
        }}
      >
        <div className="text-center p-4 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">
            Deploy Advanced Trading Intelligence
          </h3>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
            Leverage cutting-edge AI algorithms and real-time market analytics
            to execute data-driven trading strategies with institutional-grade
            precision.
          </p>
          <Link href="/dashboard">
            <Button
              label="Initialize Dashboard"
              icon="pi pi-rocket"
              className="space-button"
              size="large"
            />
          </Link>
        </div>
      </Card>
    </div>
  )
}
