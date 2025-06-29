'use client'

import { SpeedDial } from 'primereact/speeddial'

export const NavigationSpeedDial = () => {
  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-line',
      command: () => (window.location.href = '/dashboard'),
    },
    {
      label: 'Learn More',
      icon: 'pi pi-question-circle',
      command: () => console.log('Learn More clicked'),
    },
  ]

  return (
    <SpeedDial
      model={items}
      direction="up"
      className="fixed bottom-4 right-4 z-50"
      buttonClassName="p-button-primary"
      showIcon="pi pi-bars"
      hideIcon="pi pi-times"
    />
  )
}
