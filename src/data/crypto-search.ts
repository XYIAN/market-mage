export interface CryptoSearchItem {
  symbol: string
  name: string
  category: string
  description: string
}

export const popularCryptos: CryptoSearchItem[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'Store of Value',
    description:
      'The first and most well-known cryptocurrency, often referred to as digital gold.',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'Smart Contracts',
    description:
      'A decentralized platform that enables smart contracts and decentralized applications.',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    category: 'Smart Contracts',
    description:
      'A blockchain platform for smart contracts with a focus on security and scalability.',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    category: 'Smart Contracts',
    description:
      'High-performance blockchain supporting thousands of transactions per second.',
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    category: 'Interoperability',
    description:
      'A multi-chain network that enables different blockchains to transfer messages and value.',
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    category: 'Scaling',
    description:
      'A layer-2 scaling solution for Ethereum that provides faster and cheaper transactions.',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    category: 'Oracle',
    description:
      'A decentralized oracle network that connects smart contracts with real-world data.',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    category: 'DeFi',
    description:
      'A decentralized exchange protocol built on Ethereum for automated token trading.',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    category: 'Smart Contracts',
    description:
      'A high-performance blockchain platform for decentralized applications and custom blockchain networks.',
  },
  {
    symbol: 'ATOM',
    name: 'Cosmos',
    category: 'Interoperability',
    description:
      'An ecosystem of blockchains designed to scale and interoperate with each other.',
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    category: 'Payment',
    description:
      'A peer-to-peer cryptocurrency that enables instant, near-zero cost payments.',
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    category: 'Payment',
    description:
      'A digital payment protocol that enables fast, low-cost international money transfers.',
  },
  {
    symbol: 'BCH',
    name: 'Bitcoin Cash',
    category: 'Payment',
    description:
      'A cryptocurrency that is a fork of Bitcoin, designed to be used as a peer-to-peer electronic cash system.',
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    category: 'Meme',
    description:
      'A cryptocurrency that started as a joke but has gained significant popularity and community support.',
  },
  {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    category: 'Meme',
    description:
      'A decentralized meme token that has evolved into a vibrant ecosystem.',
  },
  {
    symbol: 'TRX',
    name: 'TRON',
    category: 'Smart Contracts',
    description:
      'A blockchain-based decentralized platform focused on the entertainment industry.',
  },
  {
    symbol: 'EOS',
    name: 'EOS',
    category: 'Smart Contracts',
    description:
      'A blockchain platform designed for decentralized applications and smart contracts.',
  },
  {
    symbol: 'NEO',
    name: 'NEO',
    category: 'Smart Contracts',
    description:
      'A blockchain platform and cryptocurrency designed to build a scalable network of decentralized applications.',
  },
  {
    symbol: 'VET',
    name: 'VeChain',
    category: 'Supply Chain',
    description:
      'A blockchain platform designed to enhance supply chain management and business processes.',
  },
  {
    symbol: 'ALGO',
    name: 'Algorand',
    category: 'Smart Contracts',
    description:
      'A blockchain platform that aims to deliver decentralization, scalability, and security.',
  },
]

export const searchCryptos = (query: string): CryptoSearchItem[] => {
  const lowercaseQuery = query.toLowerCase()
  return popularCryptos.filter(
    (crypto) =>
      crypto.symbol.toLowerCase().includes(lowercaseQuery) ||
      crypto.name.toLowerCase().includes(lowercaseQuery) ||
      crypto.description.toLowerCase().includes(lowercaseQuery)
  )
}

export const getCryptoBySymbol = (
  symbol: string
): CryptoSearchItem | undefined => {
  return popularCryptos.find(
    (crypto) => crypto.symbol.toLowerCase() === symbol.toLowerCase()
  )
}
