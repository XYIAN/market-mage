# Changelog

All notable changes to this project will be documented in this file.

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
