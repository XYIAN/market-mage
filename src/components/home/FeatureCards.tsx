'use client'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { FEATURE_CARDS } from '@/data/cards'
import { useRouter } from 'next/navigation'
import '@/styles/home/feature-cards.css'

export const FeatureCards = () => {
  const router = useRouter()

  const handleCardClick = (url: string) => {
    router.push(url)
  }

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
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
              height: '380px',
              width: '320px',
              minWidth: '280px',
              maxWidth: '90vw',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: '1rem',
              }}
            >
              {/* Header with image/icon */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i
                      className={`${card.icon} text-2xl pulse-glow`}
                      style={{ color: '#1E40AF' }}
                    ></i>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'white',
                  textAlign: 'center',
                  margin: '0 0 1rem 0',
                }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: '#D1D5DB',
                  lineHeight: '1.6',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  margin: '0',
                  flex: '1',
                }}
              >
                {card.description}
              </p>

              {/* Footer with button */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Button
                  label="Explore"
                  icon="pi pi-arrow-right"
                  className="p-button-primary p-button-sm"
                  onClick={() => handleCardClick(card.url)}
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
