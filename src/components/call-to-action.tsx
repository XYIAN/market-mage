'use client'

import Link from 'next/link'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

export const CallToAction = () => {
  return (
    <div className="text-center">
      <Card className="bg-gradient-to-r from-primary to-primary-foreground max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">
          Ready to Start Trading Smarter?
        </h3>
        <p className="mb-6">
          Join thousands of traders who use Market-Mage to make informed
          decisions
        </p>
        <Link href="/dashboard">
          <Button
            label="Get Started Now"
            icon="pi pi-rocket"
            className="p-button-outlined p-button-white"
            size="large"
          />
        </Link>
      </Card>
    </div>
  )
}
