# Changelog

All notable changes to this project will be documented in this file.

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
