'use client'

import { Card } from 'primereact/card'
import { FEATURE_CARDS } from '@/data/cards'

export const FeatureCards = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 mb-8">
      {FEATURE_CARDS.map((card) => (
        <Card key={card.id} className="w-80 h-64 text-center">
          <div className="flex flex-column h-full justify-content-center">
            <div className="mb-4">
              <i className={`${card.icon} text-4xl text-primary`}></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="flex-1">{card.description}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
