'use client'

import { AccordionTab } from 'primereact/accordion'
import { FAQItem as FAQItemType } from '@/data/faq'

interface FAQItemProps {
  faq: FAQItemType
}

export const FAQItem = ({ faq }: FAQItemProps) => {
  return (
    <AccordionTab
      key={faq.id}
      header={
        <div className="flex items-center gap-2">
          <i className="pi pi-question-circle dark-blue-glow"></i>
          <span className="font-medium">{faq.question}</span>
        </div>
      }
    >
      <div className="p-4">
        <p className="leading-relaxed">{faq.answer}</p>
      </div>
    </AccordionTab>
  )
}
