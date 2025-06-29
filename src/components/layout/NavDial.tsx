'use client'

import { SpeedDial } from 'primereact/speeddial'
import { MenuItem } from 'primereact/menuitem'
import { useRouter } from 'next/navigation'
import { FaMagic } from 'react-icons/fa'

export default function NavDial() {
  const router = useRouter()

  const items: MenuItem[] = [
    {
      label: 'Market Dashboard',
      icon: 'pi pi-chart-line',
      command: () => {
        router.push('/market')
      },
    },
    {
      label: 'Crypto Dashboard',
      icon: 'pi pi-bitcoin',
      command: () => {
        router.push('/crypto')
      },
    },
    {
      label: 'News',
      icon: 'pi pi-globe',
      command: () => {
        router.push('/news')
      },
    },
    {
      label: 'FAQ',
      icon: 'pi pi-question-circle',
      command: () => {
        router.push('/faq')
      },
    },
  ]

  return (
    <SpeedDial
      className="fixed left-0 bottom-0 m-3 p-1 m-1rem"
      model={items}
      direction="up"
      showIcon={
        <FaMagic
          size={24}
          style={{ color: '#1E40AF', filter: 'drop-shadow(0 0 8px #1E40AF)' }}
        />
      }
      hideIcon="pi pi-times"
      pt={{
        menuitem: { className: 'gap-2' },
        action: { className: 'gap-2' },
      }}
    />
  )
}
