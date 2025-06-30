# Market-Mage 🧙‍♂️

**AI-Powered Stock Dashboard with Real-Time Market Insights**

Market-Mage is a modern, responsive stock dashboard that combines real-time market data with AI-powered trading insights. Built with a focus on user experience and professional design, it provides traders and investors with the tools they need to make informed decisions.

![Market-Mage Dashboard](https://img.shields.io/badge/Version-2.3.0-blue) ![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![PrimeReact](https://img.shields.io/badge/PrimeReact-10.7.0-purple) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)

**🌐 Live Demo**: [https://market-mage.netlify.app/](https://market-mage.netlify.app/)

## ✨ What Market-Mage Does

Market-Mage transforms how you interact with financial markets by providing:

- **Real-time stock tracking** with live price updates and performance metrics
- **AI-powered trading insights** that help you make informed decisions
- **Live market news** delivered through a smooth scrolling ticker
- **Portfolio management** tools to track your investments
- **Professional analytics** with charts and historical data
- **User authentication** with persistent watchlists and preferences
- **Personalized dashboards** that save your customizations
- **Centralized API caching** for optimal performance across all users
- **Username system** with unique profile management
- **Achievement points display** with 5-minute welcome timer
- **Games section** with Trading Academy and Achievements

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

   # OpenAI Configuration (Optional - for AI insights)
   OPENAI_API_KEY=your-openai-api-key

   # Stock Data APIs (Optional - for enhanced data)
   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
   NEXT_PUBLIC_FINNHUB_API_KEY=your-finnhub-api-key
   NEXT_PUBLIC_POLYGON_API_KEY=your-polygon-api-key
   NEXT_PUBLIC_NEWS_API_KEY=your-news-api-key
   ```

4. **Set up Supabase**

   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Get your project URL and anon key from Settings > API
   - Add them to your `.env.local` file

5. **Create the database tables**

   **Option A: Using Supabase CLI (Recommended)**

   ```bash
   # Install Supabase CLI (if not already installed)
   brew install supabase/tap/supabase

   # Run the setup script with your project reference ID
   ./scripts/supabase-setup.sh YOUR_PROJECT_REF
   ```

   **Option B: Manual setup in Supabase Dashboard**

   In your Supabase SQL editor, run the complete setup script:

   ```sql
   -- Run the complete database setup script
   -- Copy and paste the contents of scripts/fix-database.sql
   ```

   **Or run the individual commands:**

   ```sql
   -- Create watchlists table
   CREATE TABLE watchlists (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     symbol TEXT NOT NULL,
     name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create API cache table for shared caching
   CREATE TABLE api_cache (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     cache_key TEXT UNIQUE NOT NULL,
     data JSONB NOT NULL,
     expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create user metrics table
   CREATE TABLE user_metrics (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     metric_key TEXT UNIQUE NOT NULL,
     metric_value INTEGER NOT NULL DEFAULT 0,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create user profiles table for username management
   CREATE TABLE user_profiles (
     id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
     username TEXT UNIQUE,
     display_name TEXT,
     avatar_url TEXT,
     bio TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
   ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies for watchlists
   CREATE POLICY "Users can view their own watchlist" ON watchlists
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert into their own watchlist" ON watchlists
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can delete from their own watchlist" ON watchlists
     FOR DELETE USING (auth.uid() = user_id);

   -- Create policies for API cache
   CREATE POLICY "Allow read access to api_cache" ON api_cache
     FOR SELECT USING (true);

   CREATE POLICY "Allow insert/update to api_cache" ON api_cache
     FOR ALL USING (auth.role() = 'service_role');

   -- Create policies for user metrics
   CREATE POLICY "Allow read access to user_metrics" ON user_metrics
     FOR SELECT USING (true);

   CREATE POLICY "Allow update to user_metrics" ON user_metrics
     FOR UPDATE USING (auth.role() = 'service_role');

   -- Create policies for user profiles
   CREATE POLICY "Users can view their own profile" ON user_profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update their own profile" ON user_profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can insert their own profile" ON user_profiles
     FOR INSERT WITH CHECK (auth.uid() = id);

   -- Create function to automatically create profile on user signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.user_profiles (id, username, display_name)
     VALUES (
       NEW.id,
       NEW.raw_user_meta_data->>'username',
       COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create trigger for new user signup
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

   -- Insert initial metrics
   INSERT INTO user_metrics (metric_key, metric_value) VALUES
     ('total_users', 0),
     ('active_dashboards', 0),
     ('total_api_calls', 0),
     ('cached_responses', 0)
   ON CONFLICT (metric_key) DO NOTHING;
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Local Development

The app is configured to work seamlessly on `localhost:3000`:

```bash
npm run dev
```

### Netlify Deployment

1. **Connect your repository to Netlify**

   - Push your code to GitHub/GitLab
   - Connect your repository in Netlify dashboard

2. **Configure environment variables in Netlify**
   Go to Site settings > Environment variables and add:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
   NEXT_PUBLIC_FINNHUB_API_KEY=your-finnhub-api-key
   NEXT_PUBLIC_POLYGON_API_KEY=your-polygon-api-key
   NEXT_PUBLIC_NEWS_API_KEY=your-news-api-key
   ```

3. **Build settings**

   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18 (or higher)

4. **Deploy**
   - Netlify will automatically deploy on every push to your main branch
   - Your app will be available at your Netlify URL

### Environment Variables Reference

| Variable                            | Required | Description                    | Example                                   |
| ----------------------------------- | -------- | ------------------------------ | ----------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`          | ✅       | Your Supabase project URL      | `https://xyz.supabase.co`                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | ✅       | Your Supabase anonymous key    | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `OPENAI_API_KEY`                    | ❌       | OpenAI API key for AI insights | `sk-...`                                  |
| `NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY` | ❌       | Alpha Vantage API key          | `demo`                                    |
| `NEXT_PUBLIC_FINNHUB_API_KEY`       | ❌       | Finnhub API key                | `demo`                                    |
| `NEXT_PUBLIC_POLYGON_API_KEY`       | ❌       | Polygon.io API key             | `demo`                                    |
| `NEXT_PUBLIC_NEWS_API_KEY`          | ❌       | News API key                   | `demo`                                    |

**Note**: The app works with demo data if API keys are not provided, but real-time data requires valid API keys.

### Useful Supabase CLI Commands

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to remote database
supabase db push

# Pull latest schema from remote database
supabase db pull

# Generate a new migration
supabase migration new add_new_feature

# Reset local database (for development)
supabase db reset

# View database logs
supabase logs

# Start local development environment
supabase start

# Stop local development environment
supabase stop
```

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
- Custom email templates with app branding

#### 📊 **Personalized Dashboard**

- Save your favorite stocks and crypto
- Customizable dashboard layouts with stepper setup
- Persistent watchlists across sessions
- User-specific AI insights and notes
- Unified dashboard system for both stocks and crypto

#### 📊 **Stock Dashboard**

- View real-time stock prices, changes, and percentages
- Sort and filter your watchlist
- Track portfolio gains and losses
- Export your data to CSV
- Multiple ways to add stocks (search, picklist, popular)

#### 🪙 **Crypto Dashboard**

- Real-time cryptocurrency tracking
- Customizable dashboard sections
- AI oracle with daily insights
- Market distribution charts
- Asset tracking with multiple data sources

#### 🤖 **AI Oracle**

- Receive daily AI-powered trading insights
- Get market analysis and trend predictions
- Track historical notes and learn from past decisions
- Generate new insights when needed
- Limited to 5 refreshes daily for cost control

#### 📰 **Live News Feed**

- Real-time financial news updates
- Smooth infinite scrolling display
- Source attribution and timestamps
- Always visible at the top of the screen
- Separate crypto and stock news sections

#### 📈 **Analytics & Charts**

- Interactive stock performance charts
- Technical analysis indicators
- Historical data visualization
- Responsive design for all devices
- PrimeReact Chart.js integration

#### ⚡ **Performance Optimizations**

- Centralized API caching system
- Shared cache across all users
- Automatic cache expiration
- User metrics tracking
- Optimized API calls with fallbacks

## 🎨 User Experience

### Design Highlights

- **Dark Professional Theme**: Easy on the eyes for extended use
- **Mobile-First Design**: Works perfectly on phones, tablets, and desktops
- **Intuitive Navigation**: SpeedDial provides quick access to all features
- **Smooth Animations**: Polished interactions and transitions
- **Fast Performance**: Optimized for quick loading and responsiveness
- **Parallax Backgrounds**: Immersive visual experience

### Navigation Guide

- **🏠 Home**: Overview of features and capabilities
- **📊 Dashboards**: Stock and crypto dashboards (requires login)
- **📰 News**: Detailed news with charts and analysis
- **❓ FAQ**: Help and frequently asked questions
- **ℹ️ About**: Information about Market-Mage
- **📄 Terms**: Terms of service and privacy policy

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
- **React Hook Form** - Form management

### Backend & APIs

- **Supabase** - Authentication and database
- **OpenAI API** - AI-powered insights
- **Alpha Vantage** - Real-time stock data
- **Next.js API Routes** - Server-side functionality
- **Centralized Caching** - Shared API cache system

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
