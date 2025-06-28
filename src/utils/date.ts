export const dateUtils = {
	// Check if it's a new day (after midnight)
	isNewDay: (lastTimestamp: string): boolean => {
		const last = new Date(lastTimestamp)
		const now = new Date()
		
		return last.getDate() !== now.getDate() ||
			last.getMonth() !== now.getMonth() ||
			last.getFullYear() !== now.getFullYear()
	},

	// Get start of next day (midnight)
	getNextDayStart: (): Date => {
		const tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)
		tomorrow.setHours(0, 0, 0, 0)
		return tomorrow
	},

	// Format date for display
	formatDate: (date: string | Date): string => {
		const d = new Date(date)
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	},

	// Format relative time (e.g., "2 hours ago")
	formatRelativeTime: (date: string | Date): string => {
		const d = new Date(date)
		const now = new Date()
		const diffMs = now.getTime() - d.getTime()
		const diffMins = Math.floor(diffMs / (1000 * 60))
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

		if (diffMins < 1) return 'Just now'
		if (diffMins < 60) return `${diffMins}m ago`
		if (diffHours < 24) return `${diffHours}h ago`
		if (diffDays < 7) return `${diffDays}d ago`
		
		return dateUtils.formatDate(date)
	},

	// Check if date is today
	isToday: (date: string | Date): boolean => {
		const d = new Date(date)
		const today = new Date()
		
		return d.getDate() === today.getDate() &&
			d.getMonth() === today.getMonth() &&
			d.getFullYear() === today.getFullYear()
	}
} 