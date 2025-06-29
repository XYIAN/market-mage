'use client'

import { SpeedDial } from 'primereact/speeddial'
import { MenuItem } from 'primereact/menuitem'
import { useRouter } from 'next/navigation'

export default function NavDial() {
  const router = useRouter()

  const items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-line',
      command: () => {
        router.push('/dashboard')
      },
    },
    {
      label: 'Learn More',
      icon: 'pi pi-question-circle',
      command: () => {
        router.push('/faq')
      },
    },
  ]

  return (
    <SpeedDial
      model={items}
      direction="up"
      showIcon="pi pi-bars"
      hideIcon="pi pi-times"
      className="fixed left-0 bottom-0 m-3 p-1 m-1rem"
    />
  )
}
