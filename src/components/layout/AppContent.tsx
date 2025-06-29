'use client'

import { createContext, useContext, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { ToastMessage } from 'primereact/toast'
import NavDial from '@/components/layout/NavDial'
import { NewsTicker } from '@/components/layout/news-ticker'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { useNewsTicker } from '@/hooks/useNewsTicker'

interface AppContentProps {
  children: React.ReactNode
}

// Toast context
const ToastContext = createContext<
  { show: (options: ToastMessage) => void } | undefined
>(undefined)

export const useWizardToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useWizardToast must be used within AppContent')
  return ctx
}

export const AppContent = ({ children }: AppContentProps) => {
  const { news, loading } = useNewsTicker()
  const toastRef = useRef<Toast>(null)

  const show = (options: ToastMessage) => {
    toastRef.current?.show(options)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      <Toast ref={toastRef} position="top-right" />
      <NewsTicker news={news} loading={loading} />
      {children}
      <NavDial />
      <CookieBanner />
    </ToastContext.Provider>
  )
}
