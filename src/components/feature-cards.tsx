'use client'

import { Card } from 'primereact/card'
import { FeatureCard } from '@/data/cards'

interface FeatureCardsProps {
  cards: FeatureCard[]
}

export const FeatureCards = ({ cards }: FeatureCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-items-center">
      {cards.map((card) => (
        <Card key={card.id} className="w-full max-w-sm text-center">
          <div className="mb-4">
            <i className={`${card.icon} text-4xl text-primary`}></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          <p>{card.description}</p>
        </Card>
      ))}
    </div>
  )
}
