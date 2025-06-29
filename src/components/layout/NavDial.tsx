'use client'

import { SpeedDial } from 'primereact/speeddial'
import { MenuItem } from 'primereact/menuitem'
import { useRouter } from 'next/navigation'
import { FaMagic } from 'react-icons/fa'

export default function NavDial() {
  const router = useRouter()

  const items: MenuItem[] = [
    {
      label: 'Stock Dashboard',
      icon: 'pi pi-chart-line',
      command: () => {
        router.push('/dashboard')
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
      label: 'Stock News',
      icon: 'pi pi-globe',
      command: () => {
        router.push('/news')
      },
    },
    {
      label: 'Crypto News',
      icon: 'pi pi-bolt',
      command: () => {
        router.push('/crypto/news')
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
      model={items}
      direction="up"
      showIcon={
        <FaMagic
          size={24}
          style={{ color: '#1E40AF', filter: 'drop-shadow(0 0 8px #1E40AF)' }}
        />
      }
      hideIcon="pi pi-times"
      className="fixed left-0 bottom-0 m-3 p-1 m-1rem"
    />
  )
}
