'use client'

/**
 * Feature Cards Component
 *
 * Displays a grid of feature cards showcasing the main capabilities of Market-Mage.
 * Each card highlights a different aspect of the platform with icons and descriptions.
 *
 * @component
 * @example
 * ```tsx
 * <FeatureCards />
 * ```
 *
 * @returns {JSX.Element} A responsive grid of feature cards
 */
export const FeatureCards = () => {
  const features = [
    {
      icon: 'pi pi-chart-line',
      title: 'Real-time Data',
      description: 'Live stock and cryptocurrency data with instant updates',
    },
    {
      icon: 'pi pi-magic',
      title: 'AI Oracle',
      description: 'Intelligent trading suggestions powered by advanced AI',
    },
    {
      icon: 'pi pi-cog',
      title: 'Customizable Dashboards',
      description: 'Build your perfect trading dashboard with drag-and-drop',
    },
    {
      icon: 'pi pi-gamepad',
      title: 'Trading Academy',
      description: 'Learn trading with our interactive educational game',
    },
    {
      icon: 'pi pi-globe',
      title: 'Market News',
      description: 'Stay updated with the latest market news and insights',
    },
    {
      icon: 'pi pi-trophy',
      title: 'Achievements',
      description: 'Earn points and unlock achievements as you trade',
    },
  ]

  return (
    <div className="mb-12 justify-content-center flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
      <div className="flex flex-col gap-6 w-full items-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors text-center max-w-[400px] w-full"
          >
            <div className="flex flex-col items-center justify-center h-full ">
              <i className={`${feature.icon} text-3xl text-primary mb-4`}></i>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
