import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">About Market-Mage</h1>
      <p className="mb-4 text-lg">
        <strong>Market-Mage</strong> is an AI-powered dashboard for tracking
        stocks and cryptocurrencies, providing real-time data, news, and
        actionable trading insights. Built for both new and experienced traders,
        it offers customizable dashboards, AI oracle suggestions, and a modern,
        responsive interface.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">How to Use</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Choose a dashboard (Crypto or Stock) and customize it to your needs.
        </li>
        <li>
          Add assets to track, enable features, and get AI-powered insights.
        </li>
        <li>Browse the latest news and sentiment for your chosen market.</li>
        <li>Access your dashboard and news from the sidebar at any time.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">About the Creator</h2>
      <p className="mb-4">
        <strong>Kyle Dilbeck</strong> is a passionate software engineer and
        entrepreneur focused on building innovative, user-friendly web
        applications. Market-Mage was created to empower traders with modern
        tools and AI-driven insights.
      </p>
      <div className="flex gap-6 mt-8 items-center">
        <Link
          href="https://github.com/kdilbeck"
          className="text-blue-400 hover:underline flex items-center gap-1"
          target="_blank"
        >
          <i className="pi pi-github" /> GitHub
        </Link>
        <Link
          href="https://linkedin.com/in/kyle-dilbeck"
          className="text-blue-400 hover:underline flex items-center gap-1"
          target="_blank"
        >
          <i className="pi pi-linkedin" /> LinkedIn
        </Link>
        <Link
          href="https://kyledilbeck.com"
          className="text-blue-400 hover:underline flex items-center gap-1"
          target="_blank"
        >
          <i className="pi pi-globe" /> Website
        </Link>
      </div>
    </div>
  )
}
