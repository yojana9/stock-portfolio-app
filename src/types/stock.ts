export interface Stock {
  id: string
  ticker: string
  companyName: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  purchaseDate: string
}

export interface StockFormData {
  ticker: string
  companyName: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
}

export interface StockHistoryPoint {
  timestamp: number
  date: string
  price: number
  volume: number
  dailyGainLoss: number
}

export interface StockWithHistory extends Stock {
  history: StockHistoryPoint[]
}

export interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  totalGainLossPercentage: number
  totalStocks: number
}
