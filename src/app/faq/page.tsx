'use client'

import { useState } from 'react'
import { Card } from 'primereact/card'
import { TabView } from 'primereact/tabview'
import { Chip } from 'primereact/chip'
import { FAQCategory } from '@/components/faq/FAQCategory'

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  const categories = [
    { key: 'general', label: 'General', icon: 'pi pi-info-circle' },
    { key: 'features', label: 'Features', icon: 'pi pi-star' },
    { key: 'technical', label: 'Technical', icon: 'pi pi-cog' },
    { key: 'trading', label: 'Trading', icon: 'pi pi-chart-line' },
  ] as const

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              Frequently Asked Questions
            </h1>
            <p className="text-lg">
              Find answers to common questions about Market-Mage
            </p>
          </div>
        </Card>

        {/* FAQ Content */}
        <Card>
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            {categories.map((category) => (
              <FAQCategory key={category.key} category={category} />
            ))}
          </TabView>
        </Card>

        {/* Contact Section */}
        <Card className="mt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              Still Have Questions?
            </h3>
            <p className="mb-4">
              If you couldn&apos;t find the answer you&apos;re looking for, feel
              free to reach out to us.
            </p>
            <div className="flex justify-center gap-4">
              <Chip
                label="GitHub Issues"
                icon="pi pi-github"
                className="cursor-pointer"
                onClick={() =>
                  window.open('https://github.com/your-repo/issues', '_blank')
                }
              />
              <Chip
                label="Documentation"
                icon="pi pi-book"
                className="cursor-pointer"
                onClick={() =>
                  window.open('https://github.com/your-repo/wiki', '_blank')
                }
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
