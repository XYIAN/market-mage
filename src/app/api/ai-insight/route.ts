import { NextResponse } from 'next/server'

export async function POST() {
	try {
		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json(
				{ error: 'OpenAI API key not configured' },
				{ status: 500 }
			)
		}

		// Only import OpenAI if API key is available
		const { default: OpenAI } = await import('openai')
		
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY
		})

		const prompt = `You are a financial analyst and trading expert. Provide a concise, actionable trading insight for today's market. Focus on:

1. Current market sentiment and key trends
2. Potential opportunities or risks to watch
3. Specific actionable advice for retail investors
4. Keep it under 200 words and make it engaging

Format your response as a clear, professional trading insight that would be valuable for daily trading decisions.`

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: 'You are a professional financial analyst providing daily trading insights. Be concise, actionable, and avoid making specific price predictions or financial advice disclaimers.'
				},
				{
					role: 'user',
					content: prompt
				}
			],
			max_tokens: 300,
			temperature: 0.7
		})

		const insight = completion.choices[0]?.message?.content || 'Unable to generate insight at this time.'

		return NextResponse.json({ insight })
	} catch (error) {
		console.error('Error generating AI insight:', error)
		return NextResponse.json(
			{ error: 'Failed to generate AI insight' },
			{ status: 500 }
		)
	}
} 