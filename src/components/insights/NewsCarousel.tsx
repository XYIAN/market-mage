import { Carousel, CarouselResponsiveOption } from 'primereact/carousel'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { NewsItem } from '@/types'

interface NewsCarouselProps {
  news: NewsItem[]
  loading?: boolean
  title?: string
}

export const NewsCarousel = ({
  news,
  loading = false,
  title = 'Latest News',
}: NewsCarouselProps) => {
  const responsiveOptions: CarouselResponsiveOption[] = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ]

  const getSentimentSeverity = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success'
      case 'negative':
        return 'danger'
      default:
        return 'info'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const newsTemplate = (item: NewsItem) => {
    return (
      <Card
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="m-2"
      >
        <div className="flex flex-column h-full">
          <div className="flex justify-content-between align-items-start mb-3">
            {item.sentiment && (
              <Tag
                value={item.sentiment}
                severity={getSentimentSeverity(item.sentiment)}
                className="text-xs"
              />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-3 line-height-1-4">
            {item.title}
          </h3>
          <p className="text-sm text-gray-300 mb-4 flex-grow-1 line-height-1-6">
            {item.description}
          </p>
          <div className="mt-auto">
            <div className="flex justify-content-between align-items-center mb-3">
              <span className="text-xs text-gray-400">{item.source}</span>
              <span className="text-xs text-gray-400">
                {formatDate(item.publishedAt)}
              </span>
            </div>
            <Button
              label="Read More"
              icon="pi pi-external-link"
              className="p-button-sm w-full"
              onClick={() => window.open(item.url, '_blank')}
            />
          </div>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: '400px',
              }}
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <Carousel
        value={news}
        numScroll={1}
        numVisible={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={newsTemplate}
        className="w-full"
        circular
        autoplayInterval={5000}
      />
    </div>
  )
}
