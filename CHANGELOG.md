# Changelog

All notable changes to this project will be documented in this file.

## [2.3.0] - 2024-12-30

### Added

- **Username System**: Unique username support with automatic profile creation
- **Games Section in Sidebar**: Dedicated navigation section for Trading Academy and Achievements
- **Achievement Points Display**: Shows user points and level after welcome message expires
- **5-Minute Welcome Timer**: Welcome message automatically changes to achievement display after 5 minutes
- **Username Hook**: useUsername hook for managing username functionality and availability checking
- **User Profile Database**: New user_profiles table with username and profile management
- **Database Migration Script**: Manual SQL script for fixing database issues

### Changed

- **Sidebar Layout**: Reduced padding and spacing for better content visibility
- **Welcome Message**: Smaller text size and tighter line height for compact design
- **Header Design**: Added username display under Market-Mage title when available
- **Navigation Structure**: Reorganized menu items with dedicated Games section
- **Achievement Integration**: Sidebar now shows real-time achievement points and level
- **Version Display**: Fixed visibility of version number and "Powered by AI Magic" text

### Fixed

- **Database Errors**: Fixed missing api_cache table causing 404 errors
- **Sidebar Padding**: Reduced excessive padding that was hiding footer content
- **Username Management**: Proper username validation and uniqueness checking
- **Game Integration**: Fixed sidebar to properly display game-related navigation
- **Layout Issues**: Improved spacing and visibility of all sidebar elements

### Technical

- **Database Schema**: Added user_profiles table with proper RLS policies
- **Username Validation**: Real-time username availability checking
- **Profile Management**: Automatic profile creation on user signup
- **Cache System**: Fixed API cache table and policies
- **Type Safety**: Added comprehensive username-related TypeScript types

## [2.2.0] - 2024-12-30

### Added

- **Wizard Trading Academy**: Complete educational game system with quest-based learning
- **Interactive Stock Trading Game**: Real-time stock trading simulation with buy/sell mechanics
- **Comprehensive Achievement System**: 50+ achievements across 6 categories (dashboard, trading, streak, exploration, mastery, social)
- **Mage Level Progression**: 15+ levels from Apprentice to Archmage with point-based progression
- **Quest System**: 2 basic quests (stocks/crypto) + 6 advanced quests requiring login
- **Avatar Unlock System**: New avatars unlocked every 2 mage levels
- **Dynamic Theme System**: Accent colors and themes change with mage level progression
- **Login Streak Tracking**: Automatic tracking of consecutive login days
- **Game Database Schema**: Complete Supabase tables for user progress, achievements, and quests

### Game Features

- **Basic Quests**: Stock Market Apprentice & Cryptocurrency Initiate (available to all users)
- **Advanced Quests**: Technical Analysis, Fundamental Analysis, DeFi Master, Options Trading, NFT Specialist, Portfolio Management
- **Achievement Categories**: Bronze (10 pts), Silver (25 pts), Gold (55 pts) difficulty levels
- **Mage Titles**: Apprentice → Sorcerer → Junior Mage → Master Mage → Grandmaster Mage → Battlemage → Grand Battlemage → Archmage
- **Interactive Trading Simulation**: Real-time stock price movements, portfolio management, and performance tracking
- **Quest Rewards**: Points, titles, and special unlocks for completing quests

### Technical Implementation

- **Game Types**: Comprehensive TypeScript interfaces for quests, achievements, mage levels, and themes
- **Game Data**: Centralized game configuration with quests, achievements, and progression data
- **Game Hooks**: useGame hook for managing game state, achievements, and user progress
- **Database Integration**: Supabase tables with RLS policies for secure user data
- **Achievement System Component**: Modal-based achievement tracking with progress indicators
- **Stock Trading Game Component**: Interactive simulation with charts, portfolio management, and scoring

### User Experience

- **Quest Selection**: Visual quest cards with difficulty indicators and login requirements
- **Progress Tracking**: Real-time progress bars and achievement completion tracking
- **Login Prompts**: Elegant dialogs for advanced quests requiring authentication
- **Game Navigation**: Integrated game access through sidebar navigation
- **Responsive Design**: Mobile-first design for all game components
- **Toast Notifications**: User feedback for game actions and achievements

### Database Schema

- **user_game_progress**: User level, points, title, avatars, achievements, quests, login streak
- **game_achievements**: Individual achievement tracking with progress and unlock dates
- **game_quests**: Quest progress tracking with step completion
- **game_sessions**: Game play session data for analytics
- **Automatic Triggers**: Login streak tracking and user progress initialization

### Security & Performance

- **Row Level Security**: All game tables protected with RLS policies
- **User Isolation**: Users can only access their own game data
- **Automatic Initialization**: New users automatically get game progress records
- **Optimized Queries**: Indexed database tables for fast game data access
- **Error Handling**: Comprehensive error handling for all game operations

## [2.1.2] - 2024-12-30

### Added

- **Comprehensive Toast Notifications**: Added toast notifications for all user actions across the application
- **Dashboard Action Feedback**: Success/error toasts for dashboard creation, editing, and saving
- **Stock Management Toasts**: Confirmation dialogs and toast notifications for stock removal
- **Enhanced Stepper Dialog**: Added close button and improved header design with dark space theme
- **User Action Feedback**: Toast notifications for login, logout, and all dashboard operations

### Changed

- **Stepper Dialog Design**: Added close button in header with proper icon and styling
- **Dialog Header Enhancement**: Custom header with dashboard type icon and close functionality
- **Toast Integration**: Replaced local state feedback with global toast notifications
- **User Experience**: Improved feedback for all user interactions with consistent messaging

### Fixed

- **Stepper Dialog Accessibility**: Added proper close functionality and keyboard navigation
- **Toast Consistency**: Unified toast notification system across all components
- **Dialog State Management**: Proper dialog state reset when closing stepper
- **Build Process**: Ensured successful builds with all new toast integrations

### Technical

- **Toast Provider Integration**: Added Toast components to all dashboard components
- **Error Handling**: Enhanced error handling with user-friendly toast messages
- **State Management**: Improved dialog state management with proper cleanup
- **Component Architecture**: Better separation of concerns with toast notifications

## [2.1.1] - 2024-12-30

### Added

- **Professional Email Templates**: Updated all Supabase email templates with branded Market-Mage design
- **App Icon Integration**: Added `icon-1.png` to email templates with proper sizing (60x60px)
- **Centralized API Caching System**: Implemented shared caching across all users for optimal performance
- **User Metrics Tracking**: Added real-time user statistics and API call monitoring
- **Database Schema Enhancement**: Added API cache and user metrics tables with proper RLS policies

### Changed

- **Background Fix**: Fixed parallax background to use `bg-4.png` without stretching/zooming
- **Email Template Styling**: Reduced icon size from 80x80px to 60x60px for better email proportions
- **Caching Architecture**: Refactored all services (crypto, stock, news, historical) to use centralized Supabase cache
- **Performance Optimization**: Implemented shared cache with automatic expiration and metrics tracking

### Fixed

- **Background Zoom Issue**: Removed `background-size: cover` that caused background stretching
- **Email Template Sizing**: Added `object-fit: cover` and proper CSS for icon scaling
- **Cache Management**: Replaced old cache utilities with centralized Supabase-based system
- **Type Safety**: Fixed all TypeScript errors in services and components

### Technical

- **Database Migrations**: Added comprehensive SQL setup for API cache and user metrics
- **Environment Configuration**: Updated README with complete deployment instructions for both localhost and Netlify
- **Email Template Management**: Created reference migration file with all email template HTML
- **Cross-Environment Compatibility**: Ensured app works seamlessly on localhost:3000 and production

### Documentation

- **Deployment Guide**: Added comprehensive Netlify deployment instructions
- **Environment Variables**: Documented all required and optional API keys
- **Database Setup**: Provided both CLI and manual setup instructions
- **Email Template Setup**: Added step-by-step guide for updating Supabase email templates

## [2.1.0] - 2024-12-30

### Added

- **User Authentication System**: Complete Supabase Auth integration with email/password
- **Persistent User Data**: User-specific watchlists and dashboard customizations
- **Enhanced Signup Experience**: Optional user info fields and 14 magic-themed avatars
- **Personalized Sidebar**: Dynamic welcome messages and user-specific content
- **User Metrics Display**: Homepage section showing current user count and platform statistics
- **Custom Email Templates**: Branded confirmation emails with dark space theme
- **Confirmation Page**: Professional account confirmation experience

### Changed

- **Dashboard Protection**: All dashboard pages now require authentication
- **Sidebar Navigation**: Simplified menu structure with proper user context
- **Version Display**: Dynamic version number in sidebar footer
- **Stepper Design**: Enhanced with dark space theme and better component styling

### Fixed

- **Sidebar Scrollbar**: Fixed 100vh height and proper scrolling behavior
- **Navigation Structure**: Removed duplicate dashboard links and improved organization
- **User Experience**: Enhanced onboarding flow with personalized elements

### Technical

- **Supabase Integration**: Complete auth and database setup with proper RLS policies
- **Protected Routes**: Implemented authentication guards for sensitive pages
- **User State Management**: Persistent user sessions and data across browser sessions
- **Email Confirmation Flow**: Custom confirmation page with proper error handling

## [2.0.0] - 2024-12-30

### Added

- **Unified Dashboard System**: Single customizable dashboard for both stocks and crypto
- **Stepper Setup Wizard**: Guided initial dashboard configuration with React Hook Form
- **Edit Dialog**: In-place dashboard customization with feature toggles
- **Component Registry**: Dynamic component loading based on user preferences
- **Dashboard Presets**: Quick start templates for common configurations
- **About & Terms Pages**: Professional legal and information pages
- **Enhanced Navigation**: SpeedDial with proper menu structure and neon glow effects

### Changed

- **Version Management**: Updated to 2.0.0 with comprehensive changelog
- **Sidebar Design**: Added neon glow effects and improved visual hierarchy
- **Menu Structure**: Simplified navigation with logical grouping
- **Component Architecture**: Unified dashboard components with props-based configuration

### Fixed

- **Navigation Issues**: Resolved nested button problems and improved accessibility
- **Dialog Functionality**: Fixed customization dialog rendering and state management
- **Type Safety**: Resolved all TypeScript errors in unified components
- **Build Process**: Ensured successful builds with all new features

### Technical

- **Unified Types**: Created shared dashboard configuration types
- **Component Reusability**: Implemented props-based component configuration
- **State Management**: Enhanced localStorage integration for user preferences
- **Form Validation**: Added comprehensive form validation with React Hook Form

## [1.2.0] - 2024-12-19

### Added

- Consolidated barrel imports for cleaner component organization
- Unified NewsItem type across the application
- Enhanced component modularization with proper index files
- Improved TypeScript type safety and consistency

### Changed

- Refactored all component imports to use consolidated `@/components` barrel exports
- Updated NewsItem interface to include sentiment, category, and image fields
- Improved API service mapping with proper type compliance
- Enhanced build process with better module resolution

### Fixed

- Type conflicts between different NewsItem interfaces
- Module resolution issues with component barrel exports
- API service type mismatches for news data
- Build errors related to missing component exports

### Technical

- Implemented proper barrel export pattern across all component folders
- Unified type definitions for better consistency
- Enhanced TypeScript configuration and type checking
- Improved development experience with cleaner imports

## [1.2.1] - 2024-06-13

### Added

- Wizardly toast notifications for news, crypto, and stock API calls with themed messages
- Global Toast context and utility for consistent notifications
- Cookie consent banner with wizard/space theme and user preferences
- Improved error handling and user feedback in all major API hooks

## [1.2.2] - 2024-06-13

### Fixed

- Toast text visibility issues with improved contrast and styling
- Enhanced toast readability on dark theme

### Changed

- Replaced SpeedDial navigation with hamburger menu and sidebar
- Added wizard-themed sidebar navigation with all major pages
- Improved mobile navigation experience
- Kept SpeedDial component code for future use

### Added

- HamburgerMenu component with animated toggle
- Sidebar navigation with PrimeReact Sidebar
- Enhanced navigation UX with proper icons and labels

## [1.2.3] - 2024-06-13

### Enhanced

- Replaced simple button navigation with PrimeReact TieredMenu
- Added cascading sub-menus for better organization
- Dashboard sub-menu: Main Dashboard, Portfolio Overview, AI Oracle, Historical Notes
- News sub-menu: General News, Crypto News, Stock News, Market News
- Improved navigation UX with hover effects and proper styling

### Styling

- Enhanced TieredMenu styling to match wizard theme
- Added proper hover effects and transitions
- Improved submenu appearance with backdrop blur
- Better visual hierarchy in navigation

## [1.2.4] - 2024-06-13

### Fixed

- Removed text truncation (ellipsis) from news ticker to show full text
- Fixed news ticker text overflow issues for better readability

### Changed

- Removed old `/dashboard` route completely
- Updated all dashboard references to use `/market` and `/crypto` routes
- Updated navigation menu to point to correct dashboard routes
- Updated "Initialize Dashboard" button to link to Market Dashboard
- Updated AI Insight preview to link to Market Dashboard
- Improved CallToAction component with separate Market and Crypto dashboard buttons

### Removed

- Deleted `/dashboard` page and route
- Cleaned up old dashboard references throughout the app

## [1.0.1] - 2024-12-19

### Added

- Sticky SpeedDial navigation in bottom-right corner
- Enhanced hero section with larger, responsive title
- Dark blue theme integration for hero title glow effect
- Improved component modularization and separation

### Changed

- Removed hardcoded styles from SpeedDial component
- Cleaned up global CSS to remove PrimeReact component overrides
- Updated hero section padding and typography
- Replaced dash with space in "Market Mage" title
- Moved SpeedDial to separate component for better maintainability

### Fixed

- SpeedDial visibility issues caused by global CSS overrides
- Component styling conflicts with PrimeReact theme
- Responsive design improvements for mobile and tablet

### Technical

- Separated SpeedDial into dedicated NavigationSpeedDial component
- Removed all PrimeReact component style overrides from global CSS
- Improved component architecture and maintainability
- Enhanced build process and dependency management

## [1.0.0] - 2024-12-19

### Added

- Initial release of Market-Mage
- AI-powered stock dashboard with real-time market data
- PrimeReact Viva Dark theme integration
- Responsive design with mobile-first approach
- News ticker with infinite scrolling
- Stock management with add/remove functionality
- AI Oracle for trading insights
- Historical notes tracking
- Chart.js integration for data visualization
- SpeedDial navigation system
- Modular component architecture

### Features

- Real-time stock data integration
- OpenAI-powered trading insights
- Portfolio tracking and management
- News aggregation and display
- Responsive UI with modern design
- Dark theme with professional styling
- TypeScript for type safety
- Next.js 15+ with App Router

## [0.1.0] - Initial Release

### Added

- Next.js 15+ App Router project with TypeScript and TailwindCSS
- PrimeReact (Lara Dark Amber theme) and PrimeIcons integration
- Responsive, mobile-first layout and design
- Sticky bottom news ticker with right-to-left scrolling financial news
- Main dashboard with:
  - PrimeReact DataTable for tracked stocks (auto-refresh every 5 min)
  - TabView for Watchlist, AI Oracle Suggestions, and Historical Notes
- Daily AI trading suggestion (OpenAI, 1 per day, stored in localStorage)
- Manual refresh for AI insight after daily threshold
- Add/remove stocks to watchlist (localStorage)
- Export portfolio to CSV
- Historical notes management (add, edit, delete)
- Utility hooks and helpers for API, date, and storage
- API route for OpenAI Chat API integration
- Environment variable support for API keys
- README with setup and usage instructions

## [1.2.5] - 2024-06-13

### Enhanced

- Updated feature cards to reflect actual app routes and functionality
- Added navigation buttons to each feature card for direct access
- Improved card layout with proper header, content, and footer sections

### Added

- Market Dashboard card with navigation to /market
- Crypto Dashboard card with navigation to /crypto
- Market News card with navigation to /news
- Crypto News card with navigation to /crypto/news
- AI Oracle card with navigation to /market?view=oracle
- FAQ & Help card with navigation to /faq

### Styling

- Added support for card images (icon-mm-1.png, icon-ph-1.png)
- Improved card dimensions and responsive layout
- Enhanced button styling with gradient backgrounds
- Better visual hierarchy in feature cards
