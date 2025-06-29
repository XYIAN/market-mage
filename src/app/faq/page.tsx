import type { Metadata } from 'next'
import { Card } from 'primereact/card'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { FAQ_DATA } from '@/data/faq'

export const metadata: Metadata = {
  title: 'FAQ - Market-Mage Trading Platform',
  description:
    'Frequently asked questions about Market-Mage, our AI-powered trading insights, and how to use the platform effectively.',
  keywords:
    'FAQ, trading questions, Market-Mage help, trading platform support, AI trading guide',
  openGraph: {
    title: 'FAQ - Market-Mage Trading Platform',
    description:
      'Get answers to common questions about Market-Mage trading platform.',
    type: 'website',
  },
}

export default function FAQPage() {
  // Group FAQs by category
  const categories = {
    general: FAQ_DATA.filter((faq) => faq.category === 'general'),
    features: FAQ_DATA.filter((faq) => faq.category === 'features'),
    technical: FAQ_DATA.filter((faq) => faq.category === 'technical'),
    trading: FAQ_DATA.filter((faq) => faq.category === 'trading'),
  }

  const categoryTitles = {
    general: 'General Questions',
    features: 'Features & Functionality',
    technical: 'Technical Support',
    trading: 'Trading & Investment',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Find answers to common questions about Market-Mage and our AI-powered
          trading platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {Object.entries(categories).map(([categoryKey, faqs]) => (
          <Card key={categoryKey} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {categoryTitles[categoryKey as keyof typeof categoryTitles]}
            </h2>
            <Accordion multiple>
              {faqs.map((faq) => (
                <AccordionTab key={faq.id} header={faq.question}>
                  <div className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionTab>
              ))}
            </Accordion>
          </Card>
        ))}
      </div>

      {/* Contact Section */}
      <Card className="mt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-4">
            Can&apos;t find what you&apos;re looking for? Contact our support
            team.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:support@market-mage.com"
              className="p-button p-button-primary"
            >
              Email Support
            </a>
            <a
              href="https://docs.market-mage.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-button p-button-outlined"
            >
              Documentation
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}
