'use client'

import { Button } from 'primereact/button'

interface HamburgerMenuProps {
  onClick: () => void
  isOpen: boolean
}

export const HamburgerMenu = ({ onClick, isOpen }: HamburgerMenuProps) => {
  return (
    <Button
      icon={isOpen ? 'pi pi-times' : undefined}
      label={isOpen ? undefined : '🧙'}
      className="p-button-rounded p-button-text p-button-lg fixed bottom-4 left-4 z-50 bg-black/50 border border-blue-500/30 hover:bg-black/70 text-2xl"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open wizard menu'}
    />
  )
}
