import { ToastMessage } from 'primereact/toast'

export interface WizardToastOptions {
  action: 'news' | 'crypto' | 'stock' | 'ai' | 'notes' | 'watchlist' | 'general'
  success?: boolean
  customMessage?: string
}

const wizardMessages = {
  news: {
    success: '🧙 News spell casted! Market insights updated.',
    error: '🔮 The crystal ball is cloudy. News fetch failed.',
  },
  crypto: {
    success: '⚡ Crypto magic summoned! Digital assets updated.',
    error: '🌙 The blockchain spirits are restless. Crypto data unavailable.',
  },
  stock: {
    success: '📈 Stock prophecy revealed! Market data updated.',
    error: '📉 The market oracle is silent. Stock data unavailable.',
  },
  ai: {
    success: '🤖 AI wisdom channeled! Oracle insights updated.',
    error: '🔮 The AI crystal is dim. Oracle insights unavailable.',
  },
  notes: {
    success: '📜 Ancient knowledge preserved! Notes saved.',
    error: '📚 The scrolls are damaged. Notes save failed.',
  },
  watchlist: {
    success: '👁️ Watchful eye activated! Watchlist updated.',
    error: '👁️ The all-seeing eye is blind. Watchlist update failed.',
  },
  general: {
    success: '✨ Magic successful! Action completed.',
    error: '💫 The spell fizzled. Action failed.',
  },
}

export const createWizardToast = (
  options: WizardToastOptions
): ToastMessage => {
  const { action, success = true, customMessage } = options
  const messages = wizardMessages[action]

  const message = customMessage || (success ? messages.success : messages.error)
  const severity = success ? 'success' : 'error'

  return {
    severity,
    summary: 'Market-Mage',
    detail: message,
    life: 4000,
    closable: true,
  }
}
