export interface CryptoAsset {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
}

export interface CryptoDashboardConfig {
  id: string
  name: string
  assets: CryptoAsset[]
  sections: DashboardSection[]
  aiOracleRefreshCount: number
  lastAiOracleRefresh?: Date
}

export interface DashboardSection {
  id: string
  type: 'asset-tracker' | 'ai-oracle' | 'insights' | 'market-overview'
  title: string
  enabled: boolean
  position: number
  config?: Record<string, unknown>
}

export interface DashboardCustomizationDialogProps {
  visible: boolean
  onHide: () => void
  mode: 'create' | 'edit'
  initialConfig?: CryptoDashboardConfig
  onSave: (config: CryptoDashboardConfig) => void
}
