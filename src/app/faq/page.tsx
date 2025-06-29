'use client'

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { TabView, TabPanel } from 'primereact/tabview'
import { Chip } from 'primereact/chip'
import { getFAQsByCategory, type FAQItem } from '@/data/faq'

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(0)

  const categories = [
    { key: 'general', label: 'General', icon: 'pi pi-info-circle' },
    { key: 'features', label: 'Features', icon: 'pi pi-star' },
    { key: 'technical', label: 'Technical', icon: 'pi pi-cog' },
    { key: 'trading', label: 'Trading', icon: 'pi pi-chart-line' },
  ] as const

  const getCategoryFAQs = (category: (typeof categories)[number]['key']) => {
    return getFAQsByCategory(category)
  }

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
              <TabPanel
                key={category.key}
                header={
                  <div className="flex items-center gap-2">
                    <i className={category.icon}></i>
                    <span>{category.label}</span>
                    <Chip
                      label={getCategoryFAQs(category.key).length.toString()}
                      className="text-xs"
                    />
                  </div>
                }
              >
                <Accordion>
                  {getCategoryFAQs(category.key).map((faq: FAQItem) => (
                    <AccordionTab
                      key={faq.id}
                      header={
                        <div className="flex items-center gap-2">
                          <i className="pi pi-question-circle text-primary"></i>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      }
                    >
                      <div className="p-4">
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </AccordionTab>
                  ))}
                </Accordion>
              </TabPanel>
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
