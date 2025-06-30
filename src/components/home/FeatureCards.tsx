'use client'

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
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card p-6 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="text-center">
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
