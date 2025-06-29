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
      className="hamburger-menu-button p-button-rounded p-button-text p-button-lg text-2xl"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open wizard menu'}
    />
  )
}
