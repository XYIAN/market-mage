'use client'

import { Card } from 'primereact/card'
import { FEATURE_CARDS } from '@/data/cards'
import '@/styles/home/feature-cards.css'

export const FeatureCards = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          justifyItems: 'center',
          gap: '1.5rem',
          width: '85%',
          maxWidth: '80rem',
        }}
      >
        {FEATURE_CARDS.map((card) => (
          <Card
            key={card.id}
            className="feature-card transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              height: '320px',
              width: '300px',
              minWidth: '260px',
              maxWidth: '90vw',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: '100%',
                padding: '1rem',
              }}
            >
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i
                  className={`${card.icon} text-3xl md:text-4xl pulse-glow`}
                  style={{ color: '#1E40AF' }}
                ></i>
              </div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  color: 'white',
                  width: '100%',
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  color: '#D1D5DB',
                  lineHeight: '1.6',
                  flex: '1',
                  fontSize: '0.875rem',
                  width: '100%',
                }}
              >
                {card.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
