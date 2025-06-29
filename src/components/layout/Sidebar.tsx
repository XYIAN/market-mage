'use client'

import { useState } from 'react'
import { Sidebar as PrimeSidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'
import { HamburgerMenu } from './HamburgerMenu'

export const Sidebar = () => {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  const navigationItems = [
    {
      label: '🏠 Home',
      icon: 'pi pi-home',
      command: () => {
        router.push('/')
        setVisible(false)
      },
    },
    {
      label: '📊 Dashboard',
      icon: 'pi pi-chart-line',
      command: () => {
        router.push('/dashboard')
        setVisible(false)
      },
    },
    {
      label: '📰 News',
      icon: 'pi pi-globe',
      command: () => {
        router.push('/news')
        setVisible(false)
      },
    },
    {
      label: '⚡ Crypto',
      icon: 'pi pi-bitcoin',
      command: () => {
        router.push('/crypto')
        setVisible(false)
      },
    },
    {
      label: '📈 Market',
      icon: 'pi pi-chart-bar',
      command: () => {
        router.push('/market')
        setVisible(false)
      },
    },
    {
      label: '❓ FAQ',
      icon: 'pi pi-question-circle',
      command: () => {
        router.push('/faq')
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
        <div className="flex flex-col gap-2 p-4">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              label={item.label}
              icon={item.icon}
              className="p-button-text p-button-lg justify-start text-left h-12 bg-transparent hover:bg-blue-500/20 border border-transparent hover:border-blue-500/30"
              onClick={item.command}
            />
          ))}

          <div className="border-t border-blue-500/30 my-4"></div>

          <div className="text-center text-sm text-gray-400 p-4">
            <p>🧙 Powered by AI Magic</p>
            <p className="text-xs mt-1">Version 1.2.1</p>
          </div>
        </div>
      </PrimeSidebar>
    </>
  )
}
