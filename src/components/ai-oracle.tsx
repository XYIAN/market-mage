'use client'

import { useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { AIInsight } from '@/types'
import { dateUtils } from '@/utils/date'

interface AIOracleProps {
	insight: AIInsight | null
	loading: boolean
	error: string | null
	canGenerate: boolean
	onGenerate: () => void
}

export const AIOracle = ({ 
	insight, 
	loading, 
	error, 
	canGenerate, 
	onGenerate 
}: AIOracleProps) => {
	const [showFullContent, setShowFullContent] = useState(false)

	const formatContent = (content: string) => {
		if (content.length <= 200 || showFullContent) {
			return content
		}
		return content.substring(0, 200) + '...'
	}

	const toggleContent = () => {
		setShowFullContent(!showFullContent)
	}

	return (
		<Card className="h-full">
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<i className="pi pi-magic text-orange-500 text-xl"></i>
						<h3 className="text-lg font-bold">AI Oracle</h3>
					</div>
					{insight && (
						<span className="text-xs text-gray-500">
							Generated: {dateUtils.formatRelativeTime(insight.generatedAt)}
						</span>
					)}
				</div>

				{loading && (
					<div className="flex flex-col items-center justify-center flex-1 py-8">
						<ProgressSpinner style={{ width: '50px', height: '50px' }} />
						<p className="mt-4 text-sm text-gray-600">Consulting the Oracle...</p>
					</div>
				)}

				{error && (
					<Message 
						severity="error" 
						text={error}
						className="mb-4"
					/>
				)}

				{!loading && !insight && !error && (
					<div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
						<i className="pi pi-eye text-4xl text-gray-400 mb-4"></i>
						<h4 className="text-lg font-semibold mb-2">No Insight Available</h4>
						<p className="text-sm text-gray-600 mb-4">
							Get your daily AI-powered trading insight to guide your investment decisions.
						</p>
						<Button
							label="Generate Insight"
							icon="pi pi-magic"
							onClick={onGenerate}
							className="p-button-primary"
						/>
					</div>
				)}

				{insight && !loading && (
					<div className="flex-1">
						<div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
							<div className="flex items-start gap-3">
								<i className="pi pi-lightbulb text-orange-500 text-lg mt-1"></i>
								<div className="flex-1">
									<p className="text-sm leading-relaxed whitespace-pre-wrap">
										{formatContent(insight.content)}
									</p>
									{insight.content.length > 200 && (
										<Button
											label={showFullContent ? 'Show Less' : 'Read More'}
											link
											className="p-0 mt-2 text-orange-600"
											onClick={toggleContent}
										/>
									)}
								</div>
							</div>
						</div>

						<div className="mt-4 flex flex-col sm:flex-row gap-2">
							{canGenerate && (
								<Button
									label="Generate New Insight"
									icon="pi pi-refresh"
									onClick={onGenerate}
									className="p-button-outlined p-button-sm"
								/>
							)}
							{!canGenerate && (
								<div className="flex items-center gap-2 text-sm text-gray-500">
									<i className="pi pi-clock"></i>
									<span>Next insight available tomorrow</span>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</Card>
	)
} 