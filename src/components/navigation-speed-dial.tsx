'use client'

import { SpeedDial } from 'primereact/speeddial'
import { useRouter } from 'next/navigation'

export const NavigationSpeedDial = () => {
  const router = useRouter()

  const items = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-line',
      command: () => router.push('/dashboard'),
    },
    {
      label: 'News',
      icon: 'pi pi-globe',
      command: () => router.push('/news'),
    },
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => router.push('/'),
    },
  ]

  return (
    <SpeedDial
      model={items}
      direction="up"
      style={{ right: '2rem', bottom: '2rem' }}
      buttonClassName="p-button-primary"
      showIcon="pi pi-bars"
      hideIcon="pi pi-times"
    />
  )
}
