'use client'

import { Card } from 'primereact/card'
import { FEATURE_CARDS } from '@/data/cards'

export const FeatureCards = () => {
  return (
    <div className="flex  justify-center gap-3 mb-8">
      {FEATURE_CARDS.map((card) => (
        <Card
          key={card.id}
          className="w-80 h-60"
          style={{
            padding: '2rem',
            height: '18rem',
            width: '26rem',
          }}
        >
          <div
            className="text-center"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="mb-4">
              <i className={`${card.icon} text-4xl dark-blue-glow`}></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="flex-1">{card.description}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
