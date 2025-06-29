# Market-Mage 🧙‍♂️

A modern, AI-powered stock dashboard built with Next.js 15, TypeScript, and PrimeReact. Get real-time market data, AI-generated trading insights, and portfolio management tools.

## ✨ Features

- **📊 Real-Time Stock Data**: Live prices updated every 5 minutes
- **🤖 AI Oracle**: Daily AI-powered trading insights (1 per day limit)
- **📰 Live News Ticker**: Scrolling financial news banner
- **📝 Historical Notes**: Track your trading observations
- **📱 Mobile-First Design**: Fully responsive interface
- **🎨 Viva Dark Theme**: Beautiful PrimeReact Viva Dark theme
- **💾 Local Storage**: All data stored locally for privacy
- **📈 CSV Export**: Export your portfolio data

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + PrimeReact
- **UI Components**: PrimeReact (Viva Dark theme)
- **AI**: OpenAI GPT-3.5/4 API
- **Stock Data**: Alpha Vantage API (free tier)
- **News**: NewsAPI (free tier)
- **Deployment**: Netlify ready

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd market-mage
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # OpenAI API Key (required for AI insights)
   OPENAI_API_KEY=your_openai_api_key

   # Alpha Vantage API Key (optional, uses demo key if not provided)
   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

   # News API Key (optional, uses mock data if not provided)
   NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 API Keys Setup

### OpenAI API Key (Required for AI Insights)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add it to `.env.local` as `OPENAI_API_KEY`

### Alpha Vantage API Key (Optional)

1. Go to [Alpha Vantage](https://www.alphavantage.co/)
2. Get a free API key
3. Add it to `.env.local` as `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY`

### News API Key (Optional)

1. Go to [NewsAPI](https://newsapi.org/)
2. Get a free API key
3. Add it to `.env.local` as `NEXT_PUBLIC_NEWS_API_KEY`

## 📱 Usage

### Homepage (`/`)

- Sticky news ticker with live financial news
- Quick stats overview of your portfolio
- Navigation to the main dashboard

### Dashboard (`/dashboard`)

- **Watchlist Tab**: View and manage your stock portfolio
- **AI Oracle Tab**: Get daily AI-generated trading insights
- **Historical Notes Tab**: Track your trading observations

### Adding Stocks

1. Click "Add Stock" button
2. Enter stock symbol (e.g., AAPL, MSFT)
3. Enter company name
4. Stock will be added to your watchlist

### AI Insights

- Generate one insight per day
- Insights reset at midnight
- Manual refresh available after daily limit

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
│   ├── add-stock.tsx      # Add stock dialog
│   ├── ai-oracle.tsx      # AI insights component
│   ├── call-to-action.tsx # CTA section
│   ├── feature-cards.tsx  # Feature cards grid
│   ├── hero-section.tsx   # Hero section
│   ├── historical-notes.tsx # Notes management
│   ├── news-ticker.tsx    # Scrolling news ticker
│   ├── stats-section.tsx  # Statistics display
│   └── stock-table.tsx    # Stock data table
├── data/                  # Static data files
│   └── cards.ts           # Feature cards configuration
├── hooks/                 # Custom React hooks
│   ├── useAIInsight.ts    # AI insights hook
│   ├── useNewsTicker.ts   # News data hook
│   └── useStockData.ts    # Stock data hook
├── lib/                   # Library configurations
│   └── providers/         # React providers
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
    ├── api.ts             # API utilities
    ├── date.ts            # Date formatting
    └── storage.ts         # Local storage utilities
```

## 🎨 Customization

### Theme

The app uses PrimeReact's Viva Dark theme. To customize:

1. Modify `src/app/globals.css`
2. Update theme imports
3. Adjust Tailwind classes

### Styling

- Uses TailwindCSS for utility-first styling
- PrimeReact components for UI elements
- Custom CSS for animations and scrollbars

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📊 Data Storage

All data is stored in the browser's localStorage:

- **Watchlist**: Stock symbols and company names
- **AI Insights**: Daily generated insights with expiration
- **Historical Notes**: Trading observations and notes

## 🔒 Privacy

- No data is sent to external servers except for API calls
- All personal data stays in your browser
- No user accounts or authentication required

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your API keys are correct
3. Ensure all dependencies are installed
4. Create an issue on GitHub

## 🔮 Future Features

- [ ] Real-time price alerts
- [ ] Technical indicators
- [ ] Portfolio performance charts
- [ ] Social trading features
- [ ] Multiple watchlists
- [ ] Advanced AI insights
- [ ] Market sentiment analysis

---

**Built with ❤️ using Next.js, TypeScript, and PrimeReact**
