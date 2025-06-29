'use client'

import { useState, useRef } from 'react'
import { Sidebar as PrimeSidebar } from 'primereact/sidebar'
import { TieredMenu } from 'primereact/tieredmenu'
import { useRouter } from 'next/navigation'
import { HamburgerMenu } from './HamburgerMenu'

export const Sidebar = () => {
  const [visible, setVisible] = useState(false)
  const menu = useRef<TieredMenu>(null)
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
      label: '📊 Dashboard',
      icon: 'pi pi-chart-line',
      items: [
        {
          label: '📈 Market Dashboard',
          icon: 'pi pi-chart-line',
          command: () => {
            router.push('/market')
            setVisible(false)
          },
        },
        {
          label: '⚡ Crypto Dashboard',
          icon: 'pi pi-bitcoin',
          command: () => {
            router.push('/crypto')
            setVisible(false)
          },
        },
        {
          label: '📊 Portfolio Overview',
          icon: 'pi pi-briefcase',
          command: () => {
            router.push('/market?view=portfolio')
            setVisible(false)
          },
        },
        {
          label: '🤖 AI Oracle',
          icon: 'pi pi-robot',
          command: () => {
            router.push('/market?view=oracle')
            setVisible(false)
          },
        },
        {
          label: '📜 Historical Notes',
          icon: 'pi pi-book',
          command: () => {
            router.push('/market?view=notes')
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
          label: '📰 General News',
          icon: 'pi pi-globe',
          command: () => {
            router.push('/news')
            setVisible(false)
          },
        },
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
        {
          label: '🌍 Market News',
          icon: 'pi pi-globe',
          command: () => {
            router.push('/news?type=markets')
            setVisible(false)
          },
        },
      ],
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
        <div className="p-4">
          <TieredMenu
            ref={menu}
            model={menuItems}
            className="w-full bg-transparent border-none"
            popup={false}
          />

          <div className="border-t border-blue-500/30 my-6"></div>

          <div className="text-center text-sm text-gray-400">
            <p>🧙 Powered by AI Magic</p>
            <p className="text-xs mt-1">Version 1.2.3</p>
          </div>
        </div>
      </PrimeSidebar>
    </>
  )
}
