# Market-Mage 🧙‍♂️

**AI-Powered Stock Dashboard with Real-Time Market Insights**

Market-Mage is a modern, responsive stock dashboard that combines real-time market data with AI-powered trading insights. Built with a focus on user experience and professional design, it provides traders and investors with the tools they need to make informed decisions.

![Market-Mage Dashboard](https://img.shields.io/badge/Version-2.0.0-blue) ![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![PrimeReact](https://img.shields.io/badge/PrimeReact-10.7.0-purple) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)

## ✨ What Market-Mage Does

Market-Mage transforms how you interact with financial markets by providing:

- **Real-time stock tracking** with live price updates and performance metrics
- **AI-powered trading insights** that help you make informed decisions
- **Live market news** delivered through a smooth scrolling ticker
- **Portfolio management** tools to track your investments
- **Professional analytics** with charts and historical data
- **User authentication** with persistent watchlists and preferences
- **Personalized dashboards** that save your customizations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- OpenAI API key (optional, for AI insights)
- Alpha Vantage API key (optional, for enhanced stock data)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd market-mage
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Supabase Configuration (Required)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # OpenAI Configuration (Optional)
   OPENAI_API_KEY=your-openai-api-key

   # Alpha Vantage Configuration (Optional)
   ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
   ```

4. **Set up Supabase**

   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Get your project URL and anon key from Settings > API
   - Add them to your `.env.local` file

5. **Create the database table**
   In your Supabase SQL editor, run:

   ```sql
   -- Create watchlists table
   CREATE TABLE watchlists (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     symbol TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view their own watchlist" ON watchlists
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert into their own watchlist" ON watchlists
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can delete from their own watchlist" ON watchlists
     FOR DELETE USING (auth.uid() = user_id);
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### First Steps

1. **Sign Up/Login**: Click "Sign In" in the sidebar to create an account
2. **Access Dashboard**: Use the "Dashboard" menu item for your personalized view
3. **Add Your Stocks**: Use the "Add Stock" feature to track your favorite companies
4. **Get AI Insights**: Check the AI Oracle for daily trading suggestions
5. **Monitor News**: Watch the live news ticker for market updates
6. **Analyze Performance**: Use charts and historical data to track trends

### Key Features Explained

#### 🔐 **User Authentication**

- Secure email/password authentication
- Persistent sessions across browser sessions
- Protected dashboard with user-specific data
- Automatic logout and session management

#### 📊 **Personalized Dashboard**

- Save your favorite stocks and crypto
- Customizable dashboard layouts
- Persistent watchlists across sessions
- User-specific AI insights and notes

#### 📊 **Stock Dashboard**

- View real-time stock prices, changes, and percentages
- Sort and filter your watchlist
- Track portfolio gains and losses
- Export your data to CSV

#### 🤖 **AI Oracle**

- Receive daily AI-powered trading insights
- Get market analysis and trend predictions
- Track historical notes and learn from past decisions
- Generate new insights when needed

#### 📰 **Live News Feed**

- Real-time financial news updates
- Smooth infinite scrolling display
- Source attribution and timestamps
- Always visible at the top of the screen

#### 📈 **Analytics & Charts**

- Interactive stock performance charts
- Technical analysis indicators
- Historical data visualization
- Responsive design for all devices

## 🎨 User Experience

### Design Highlights

- **Dark Professional Theme**: Easy on the eyes for extended use
- **Mobile-First Design**: Works perfectly on phones, tablets, and desktops
- **Intuitive Navigation**: SpeedDial provides quick access to all features
- **Smooth Animations**: Polished interactions and transitions
- **Fast Performance**: Optimized for quick loading and responsiveness

### Navigation Guide

- **🏠 Home**: Overview of features and capabilities
- **📊 Dashboard**: Main stock tracking and management (requires login)
- **📊 Markets**: Public market dashboards
- **📰 News**: Detailed news with charts and analysis
- **🪙 Crypto**: Cryptocurrency tracking and news
- **❓ FAQ**: Help and frequently asked questions

## 🎯 Perfect For

### Individual Traders

- Track personal stock portfolios
- Get AI-powered trading suggestions
- Monitor market news and trends
- Analyze historical performance

### Investors

- Research potential investments
- Monitor market conditions
- Track portfolio performance
- Access professional insights

### Financial Enthusiasts

- Learn about market dynamics
- Practice portfolio management
- Stay informed with real-time news
- Explore AI-powered analysis

## 🔮 What's Coming Next

- Real-time portfolio alerts and notifications
- Advanced charting tools and indicators
- Social trading features and community insights
- Mobile app for iOS and Android
- Enhanced AI insights with more detailed analysis
- API rate limit optimizations for better performance
- Data caching and scheduled updates

## 🔧 Technical Stack

### Frontend

- **Next.js 15.3.4** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **PrimeReact 10.7.0** - Professional UI components
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization

### Backend & APIs

- **Supabase** - Authentication and database
- **OpenAI API** - AI-powered insights
- **Alpha Vantage** - Real-time stock data
- **Next.js API Routes** - Server-side functionality

### Development Tools

- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Turbopack** - Fast development builds

## 👨‍💻 Developer

**Kyle** - Full-Stack Developer & Financial Technology Enthusiast

### Connect With Me

- 🌐 **Website**: [Your Website URL]
- 💼 **LinkedIn**: [Your LinkedIn Profile]
- 🐙 **GitHub**: [Your GitHub Profile]
- 📧 **Email**: [Your Email]

### Support & Contribution

If you find Market-Mage helpful, consider:

- ⭐ Starring this repository
- 🐛 Reporting bugs or issues
- 💡 Suggesting new features
- 🤝 Contributing to the project

---

**Disclaimer**: Market-Mage is for educational and informational purposes only. It does not constitute financial advice. Always conduct your own research and consult with financial professionals before making investment decisions.

_Built with ❤️ using modern web technologies_
