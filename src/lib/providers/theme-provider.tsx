'use client'

import { createContext, useContext, ReactNode } from 'react'

interface ThemeContextType {
	theme: string
	setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

interface ThemeProviderProps {
	children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const theme = 'lara-dark-orange'

	return (
		<ThemeContext.Provider value={{ theme, setTheme: () => {} }}>
			{children}
		</ThemeContext.Provider>
	)
} 