'use client'

import { TabPanel } from 'primereact/tabview'
import { Accordion } from 'primereact/accordion'
import { Chip } from 'primereact/chip'
import { FAQItemComponent } from './faq-item'
import { getFAQsByCategory, type FAQItem } from '@/data/faq'

interface FAQCategoryProps {
  category: {
    key: 'general' | 'features' | 'technical' | 'trading'
    label: string
    icon: string
  }
}

export const FAQCategory = ({ category }: FAQCategoryProps) => {
  const faqs = getFAQsByCategory(category.key)

  return (
    <TabPanel
      key={category.key}
      header={
        <div className="flex items-center gap-2">
          <i className={category.icon}></i>
          <span>{category.label}</span>
          <Chip label={faqs.length.toString()} className="text-xs" />
        </div>
      }
    >
      <Accordion>
        {faqs.map((faq: FAQItem) => (
          <FAQItemComponent key={faq.id} faq={faq} />
        ))}
      </Accordion>
    </TabPanel>
  )
}
