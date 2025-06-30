'use client'

import { useState, useRef } from 'react'
import { Sidebar as PrimeSidebar } from 'primereact/sidebar'
import { PanelMenu } from 'primereact/panelmenu'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useRouter } from 'next/navigation'
import { HamburgerMenu } from './HamburgerMenu'
import { useSupabase } from '@/lib/providers/SupabaseProvider'
import { createClient } from '@/lib/supabase/client'
import { useWizardToast } from './WizardToastProvider'

export const Sidebar = () => {
  const [visible, setVisible] = useState(false)
  const menu = useRef<PanelMenu>(null)
  const router = useRouter()
  const { user } = useSupabase()
  const supabase = createClient()
  const { show } = useWizardToast()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      show({
        severity: 'success',
        summary: 'Logged Out',
        detail: `Goodbye, ${
          user?.user_metadata?.full_name || user?.email
        }! You have been successfully logged out.`,
        life: 4000,
        closable: true,
      })
      router.push('/')
      setVisible(false)
    } catch {
      show({
        severity: 'error',
        summary: 'Logout Failed',
        detail: 'There was an error logging you out. Please try again.',
        life: 4000,
        closable: true,
      })
    }
  }

  const confirmLogout = () => {
    confirmDialog({
      message: 'Are you sure you want to sign out?',
      header: 'Confirm Sign Out',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: handleLogout,
      reject: () => {
        show({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Sign out was cancelled.',
          life: 3000,
          closable: true,
        })
      },
    })
  }

  const menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => {
        router.push('/')
        setVisible(false)
        show({
          severity: 'info',
          summary: 'Navigation',
          detail: 'Welcome to Market-Mage Home!',
          life: 3000,
          closable: true,
        })
      },
    },
    {
      label: 'Markets',
      icon: 'pi pi-chart-line',
      items: [
        {
          label: 'Crypto Dashboard',
          icon: 'pi pi-bitcoin',
          command: () => {
            router.push('/crypto')
            setVisible(false)
            show({
              severity: 'info',
              summary: 'Navigation',
              detail: 'Opening Crypto Dashboard...',
              life: 3000,
              closable: true,
            })
          },
        },
        {
          label: 'Stock Dashboard',
          icon: 'pi pi-chart-bar',
          command: () => {
            router.push('/market')
            setVisible(false)
            show({
              severity: 'info',
              summary: 'Navigation',
              detail: 'Opening Stock Dashboard...',
              life: 3000,
              closable: true,
            })
          },
        },
      ],
    },
    {
      label: 'News',
      icon: 'pi pi-globe',
      items: [
        {
          label: 'Crypto News',
          icon: 'pi pi-bitcoin',
          command: () => {
            router.push('/crypto/news')
            setVisible(false)
            show({
              severity: 'info',
              summary: 'Navigation',
              detail: 'Loading Crypto News...',
              life: 3000,
              closable: true,
            })
          },
        },
        {
          label: 'Stock News',
          icon: 'pi pi-chart-bar',
          command: () => {
            router.push('/news?type=stocks')
            setVisible(false)
            show({
              severity: 'info',
              summary: 'Navigation',
              detail: 'Loading Stock News...',
              life: 3000,
              closable: true,
            })
          },
        },
      ],
    },
    {
      label: 'FAQ',
      icon: 'pi pi-question-circle',
      command: () => {
        router.push('/faq')
        setVisible(false)
        show({
          severity: 'info',
          summary: 'Navigation',
          detail: 'Opening FAQ...',
          life: 3000,
          closable: true,
        })
      },
    },
    {
      label: 'About',
      icon: 'pi pi-info-circle',
      command: () => {
        router.push('/about')
        setVisible(false)
        show({
          severity: 'info',
          summary: 'Navigation',
          detail: 'Opening About page...',
          life: 3000,
          closable: true,
        })
      },
    },
    {
      label: 'Terms & Privacy',
      icon: 'pi pi-file',
      command: () => {
        router.push('/terms')
        setVisible(false)
        show({
          severity: 'info',
          summary: 'Navigation',
          detail: 'Opening Terms & Privacy...',
          life: 3000,
          closable: true,
        })
      },
    },
  ]

  return (
    <>
      <ConfirmDialog />
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
        <div className="relative h-screen w-64 bg-surface-900 shadow-lg flex flex-col sidebar-neon-glow overflow-hidden">
          <div className="p-4 flex flex-col h-full">
            {user && (
              <div className="mb-4 p-3 bg-surface-800 rounded-lg">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="text-sm font-medium truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
              </div>
            )}

            <PanelMenu
              ref={menu}
              model={menuItems}
              className="w-full bg-transparent border-none flex-1"
              multiple={false}
            />

            <div className="border-t border-blue-500/30 my-6"></div>

            <div className="w-full flex flex-col items-center pb-4 space-y-3">
              {user ? (
                <Button
                  label="Sign Out"
                  icon="pi pi-sign-out"
                  onClick={confirmLogout}
                  className="w-full"
                  severity="secondary"
                  size="small"
                />
              ) : (
                <Button
                  label="Sign In"
                  icon="pi pi-sign-in"
                  onClick={() => {
                    router.push('/login')
                    setVisible(false)
                    show({
                      severity: 'info',
                      summary: 'Navigation',
                      detail: 'Opening Login page...',
                      life: 3000,
                      closable: true,
                    })
                  }}
                  className="w-full"
                  size="small"
                />
              )}
              <p className="text-xs mt-1">Version 2.1.1</p>
              <p className="text-xs text-gray-400">Powered by AI Magic</p>
            </div>
          </div>
        </div>
      </PrimeSidebar>
    </>
  )
}
