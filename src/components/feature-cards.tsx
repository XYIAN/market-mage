'use client'

import { Card } from 'primereact/card'
import { FEATURE_CARDS } from '@/data/cards'

export const FeatureCards = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {FEATURE_CARDS.map((card) => (
        <Card
          key={card.id}
          style={{
            width: 320,
            minHeight: 240,
            flex: '1 1 320px',
            maxWidth: 340,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <i className={`${card.icon} text-4xl text-primary`}></i>
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ textAlign: 'center' }}
            >
              {card.title}
            </h3>
            <p style={{ flex: 1, textAlign: 'center' }}>{card.description}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
