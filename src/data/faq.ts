export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'general' | 'features' | 'technical' | 'trading'
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'What is Market-Mage?',
    answer:
      'Market-Mage is an AI-powered stock dashboard that provides real-time market data, trading insights, and portfolio management tools. It combines advanced analytics with artificial intelligence to help traders make informed investment decisions.',
    category: 'general',
  },
  {
    id: '2',
    question: 'How does the AI Oracle work?',
    answer:
      "The AI Oracle uses OpenAI's advanced language models to analyze market conditions and provide daily trading insights. It considers market trends, technical indicators, and current events to generate actionable trading suggestions.",
    category: 'features',
  },
  {
    id: '3',
    question: 'Is my data secure?',
    answer:
      "Yes, all your data is stored locally in your browser using localStorage. We don't collect or store any personal information on our servers. Your portfolio data, notes, and preferences remain private and secure.",
    category: 'technical',
  },
  {
    id: '4',
    question: 'How often is stock data updated?',
    answer:
      'Stock data is updated in real-time using the Alpha Vantage API. Prices and market information are refreshed every few minutes to ensure you have the most current information for your trading decisions.',
    category: 'features',
  },
  {
    id: '5',
    question: 'Can I export my portfolio data?',
    answer:
      'Yes, you can export your portfolio data in CSV format. This includes all your tracked stocks, historical notes, and trading insights for backup or analysis purposes.',
    category: 'features',
  },
  {
    id: '6',
    question: 'What markets does Market-Mage support?',
    answer:
      "Market-Mage currently supports major US stock markets including NYSE and NASDAQ. We're continuously expanding to include international markets and additional asset classes.",
    category: 'general',
  },
  {
    id: '7',
    question: 'How accurate are the AI trading suggestions?',
    answer:
      'While our AI provides sophisticated market analysis, all trading decisions should be made with careful consideration. The AI suggestions are educational tools and should not be considered as financial advice. Always conduct your own research.',
    category: 'trading',
  },
  {
    id: '8',
    question: 'Do I need an API key to use Market-Mage?',
    answer:
      "For basic functionality, no API key is required. However, for AI insights, you'll need an OpenAI API key. For enhanced stock data, an Alpha Vantage API key is recommended but optional.",
    category: 'technical',
  },
  {
    id: '9',
    question: 'Can I use Market-Mage on mobile devices?',
    answer:
      'Yes, Market-Mage is fully responsive and works on all devices including smartphones and tablets. The interface automatically adapts to provide the best experience on any screen size.',
    category: 'technical',
  },
  {
    id: '10',
    question: 'How do I add stocks to my watchlist?',
    answer:
      'You can add stocks using the "Add Stock" button in the dashboard. Enter the stock symbol (like AAPL for Apple) and the company name. You can also use the search feature to find stocks by name or symbol.',
    category: 'features',
  },
  {
    id: '11',
    question: 'What are Historical Notes?',
    answer:
      'Historical Notes allow you to document your trading observations, strategies, and lessons learned. This feature helps you track your trading journey and learn from past decisions to improve future performance.',
    category: 'features',
  },
  {
    id: '12',
    question: 'Is Market-Mage free to use?',
    answer:
      'Market-Mage is completely free to use. However, you may need to provide your own API keys for certain features like AI insights (OpenAI) and enhanced stock data (Alpha Vantage).',
    category: 'general',
  },
]

export const getFAQsByCategory = (category: FAQItem['category']): FAQItem[] => {
  return FAQ_DATA.filter((faq) => faq.category === category)
}

export const getAllFAQs = (): FAQItem[] => {
  return FAQ_DATA
}
