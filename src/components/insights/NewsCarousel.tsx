import { Carousel, CarouselResponsiveOption } from 'primereact/carousel'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'
import { Skeleton } from 'primereact/skeleton'
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
          <div className="flex-grow-1 flex flex-column">
            <h3 className="text-lg font-semibold mb-3 line-height-1-4">
              {item.title}
            </h3>
            <p className="text-sm text-blue-200 flex-grow-1 line-height-1-6">
              {item.description}
            </p>
          </div>
          <div className="mt-auto">
            <div className="flex justify-content-between align-items-center mb-3">
              <span className="text-xs text-blue-200">{item.source}</span>
              <span className="text-xs text-blue-200">
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

  const skeletonTemplate = () => {
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
        <div className="flex flex-column h-full p-3">
          <div className="flex justify-content-between align-items-start mb-3">
            <Skeleton width="60px" height="24px" />
          </div>
          <Skeleton width="100%" height="24px" className="mb-2" />
          <Skeleton width="90%" height="20px" className="mb-2" />
          <Skeleton width="95%" height="20px" className="mb-2" />
          <div className="flex-grow-1">
            <Skeleton width="100%" height="16px" className="mb-2" />
            <Skeleton width="100%" height="16px" className="mb-2" />
            <Skeleton width="100%" height="16px" className="mb-2" />
            <Skeleton width="80%" height="16px" className="mb-2" />
            <Skeleton width="90%" height="16px" className="mb-2" />
            <Skeleton width="70%" height="16px" className="mb-2" />
          </div>
          <div className="mt-auto">
            <div className="flex justify-content-between align-items-center mb-3">
              <Skeleton width="80px" height="16px" />
              <Skeleton width="60px" height="16px" />
            </div>
            <Skeleton width="100%" height="36px" />
          </div>
        </div>
      </Card>
    )
  }

  const skeletonData = Array.from({ length: 6 }, (_, index) => ({
    id: `skeleton-${index}`,
  }))

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <Carousel
        value={loading ? skeletonData : news}
        numScroll={1}
        numVisible={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={loading ? skeletonTemplate : newsTemplate}
        className="w-full"
        circular={!loading}
        autoplayInterval={loading ? 0 : 5000}
      />
    </div>
  )
}
