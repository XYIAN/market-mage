'use client'

import { useState, useRef } from 'react'
import { Sidebar as PrimeSidebar } from 'primereact/sidebar'
import { PanelMenu } from 'primereact/panelmenu'
import { useRouter } from 'next/navigation'
import { HamburgerMenu } from './HamburgerMenu'
import packageJson from '../../../package.json'

export const Sidebar = () => {
  const [visible, setVisible] = useState(false)
  const menu = useRef<PanelMenu>(null)
  const router = useRouter()

  const menuItems = [
    {
      label: '🏠 Home',
      icon: 'pi pi-home',
      command: () => {
        router.push('/')
        setVisible(false)
      },
    },
    {
      label: '📊 Dashboards',
      icon: 'pi pi-chart-line',
      items: [
        {
          label: '⚡ Crypto Dashboard',
          icon: 'pi pi-bitcoin',
          command: () => {
            router.push('/crypto')
            setVisible(false)
          },
        },
        {
          label: '📈 Stock Dashboard',
          icon: 'pi pi-chart-bar',
          command: () => {
            router.push('/market')
            setVisible(false)
          },
        },
      ],
    },
    {
      label: '📰 News',
      icon: 'pi pi-globe',
      items: [
        {
          label: '⚡ Crypto News',
          icon: 'pi pi-bitcoin',
          command: () => {
            router.push('/crypto/news')
            setVisible(false)
          },
        },
        {
          label: '📈 Stock News',
          icon: 'pi pi-chart-bar',
          command: () => {
            router.push('/news?type=stocks')
            setVisible(false)
          },
        },
      ],
    },
    {
      label: '❓ FAQ',
      icon: 'pi pi-question-circle',
      command: () => {
        router.push('/faq')
        setVisible(false)
      },
    },
    {
      label: 'ℹ️ About',
      icon: 'pi pi-info-circle',
      command: () => {
        router.push('/about')
        setVisible(false)
      },
    },
    {
      label: '📄 Terms & Privacy',
      icon: 'pi pi-file',
      command: () => {
        router.push('/terms')
        setVisible(false)
      },
    },
  ]

  return (
    <>
      <HamburgerMenu onClick={() => setVisible(true)} isOpen={visible} />

      <PrimeSidebar
        visible={visible}
        position="left"
        onHide={() => setVisible(false)}
        className="w-80 bg-black/95 backdrop-blur-xl border-r border-blue-500/30"
        header={
          <div className="flex items-center gap-3 p-4">
            <span className="text-2xl">🧙</span>
            <h2 className="text-xl font-bold text-blue-200">Market-Mage</h2>
          </div>
        }
      >
        <div className="relative h-full w-64 bg-surface-900 shadow-lg flex flex-col sidebar-neon-glow">
          <div className="p-4 flex flex-col h-full">
            <PanelMenu
              ref={menu}
              model={menuItems}
              className="w-full bg-transparent border-none flex-1"
              multiple={false}
            />

            <div className="border-t border-blue-500/30 my-6"></div>

            <div className="w-full flex flex-col items-center pb-4">
              <p className="text-xs mt-1">Version {packageJson.version}</p>
              <p className="text-xs text-gray-400">Powered by AI Magic</p>
            </div>
          </div>
        </div>
      </PrimeSidebar>
    </>
  )
}
