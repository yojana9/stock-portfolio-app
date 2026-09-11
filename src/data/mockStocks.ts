import type { Stock, StockHistoryPoint } from '../types/stock'

/**
 * Generate 30 days of realistic simulated stock history
 */
export const generateStockHistory = (
  basePrice: number,
  days = 30,
  volatility = 0.02
): StockHistoryPoint[] => {
  const history: StockHistoryPoint[] = []
  const now = new Date()
  let currentPrice = basePrice * (1 - (days * volatility) / 2) // Start from realistic historical starting point

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    d.setHours(16, 0, 0, 0) // Market close

    // Random walk with mean reversion towards basePrice
    const changePercent = (Math.random() - 0.48) * volatility
    const prevPrice = currentPrice
    currentPrice = Math.max(1, +(prevPrice * (1 + changePercent)).toFixed(2))

    // On the last day, ensure it matches basePrice closely
    if (i === 0) {
      currentPrice = basePrice
    }

    const dailyGainLoss = +(currentPrice - prevPrice).toFixed(2)
    const baseVolume = 1500000 + Math.floor(Math.random() * 2500000)

    history.push({
      timestamp: d.getTime(),
      date: d.toISOString().split('T')[0],
      price: currentPrice,
      volume: baseVolume,
      dailyGainLoss,
    })
  }

  return history
}

export const initialStocks: Stock[] = [
  {
    id: 'stock-1',
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    quantity: 25,
    purchasePrice: 195.5,
    currentPrice: 228.4,
    purchaseDate: '2024-03-15',
  },
  {
    id: 'stock-2',
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    quantity: 18,
    purchasePrice: 410.0,
    currentPrice: 442.8,
    purchaseDate: '2024-02-10',
  },
  {
    id: 'stock-3',
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    quantity: 35,
    purchasePrice: 110.2,
    currentPrice: 138.6,
    purchaseDate: '2024-05-20',
  },
  {
    id: 'stock-4',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    quantity: 20,
    purchasePrice: 172.4,
    currentPrice: 168.1,
    purchaseDate: '2024-04-12',
  },
  {
    id: 'stock-5',
    ticker: 'AMZN',
    companyName: 'Amazon.com Inc.',
    quantity: 15,
    purchasePrice: 182.0,
    currentPrice: 196.5,
    purchaseDate: '2024-06-01',
  },
]
