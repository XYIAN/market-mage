'use client'

import { AccordionTab } from 'primereact/accordion'
import { FAQItem } from '@/data/faq'

interface FAQItemProps {
  faq: FAQItem
}

export const FAQItemComponent = ({ faq }: FAQItemProps) => {
  return (
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
  )
}
