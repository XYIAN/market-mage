'use client'

import { createContext, useContext, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { ToastMessage } from 'primereact/toast'

interface WizardToastProviderProps {
  children: React.ReactNode
}

const ToastContext = createContext<
  { show: (options: ToastMessage) => void } | undefined
>(undefined)

export const useWizardToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx)
    throw new Error('useWizardToast must be used within WizardToastProvider')
  return ctx
}

export function WizardToastProvider({ children }: WizardToastProviderProps) {
  const toastRef = useRef<Toast>(null)

  const show = (options: ToastMessage) => {
    toastRef.current?.show(options)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  )
}
