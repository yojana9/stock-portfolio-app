import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateStockHistory, initialStocks } from '../data/mockStocks'
import type { PortfolioSummary, Stock, StockFormData, StockHistoryPoint } from '../types/stock'

interface PortfolioState {
  stocks: Stock[]
  selectedStockId: string | null
  historyMap: Record<string, StockHistoryPoint[]>

  // Actions
  addStock: (data: StockFormData) => void
  editStock: (id: string, data: Partial<StockFormData & { currentPrice?: number }>) => void
  deleteStock: (id: string) => void
  setSelectedStockId: (id: string | null) => void
  resetToDefault: () => void

  // Computed helper
  getSummary: () => PortfolioSummary
}

// Generate initial history for default stocks
const initialHistoryMap: Record<string, StockHistoryPoint[]> = initialStocks.reduce(
  (acc, stock) => {
    acc[stock.id] = generateStockHistory(stock.currentPrice, 30)
    return acc
  },
  {} as Record<string, StockHistoryPoint[]>
)

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      stocks: initialStocks,
      selectedStockId: initialStocks[0]?.id ?? null,
      historyMap: initialHistoryMap,

      addStock: (data: StockFormData) => {
        const id = `stock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        // Set realistic currentPrice around purchase price
        const priceVariance = (Math.random() * 0.08 - 0.03) // -3% to +5%
        const currentPrice = +(data.purchasePrice * (1 + priceVariance)).toFixed(2)

        const newStock: Stock = {
          id,
          ticker: data.ticker.trim().toUpperCase(),
          companyName: data.companyName.trim(),
          quantity: Number(data.quantity),
          purchasePrice: Number(data.purchasePrice),
          currentPrice,
          purchaseDate: data.purchaseDate,
        }

        const newHistory = generateStockHistory(currentPrice, 30)

        set((state) => ({
          stocks: [newStock, ...state.stocks],
          selectedStockId: newStock.id,
          historyMap: {
            ...state.historyMap,
            [newStock.id]: newHistory,
          },
        }))
      },

      editStock: (id: string, data: Partial<StockFormData & { currentPrice?: number }>) => {
        set((state) => {
          const updatedStocks = state.stocks.map((stock) => {
            if (stock.id !== id) return stock

            const updated: Stock = {
              ...stock,
              ticker: data.ticker !== undefined ? data.ticker.trim().toUpperCase() : stock.ticker,
              companyName: data.companyName !== undefined ? data.companyName.trim() : stock.companyName,
              quantity: data.quantity !== undefined ? Number(data.quantity) : stock.quantity,
              purchasePrice: data.purchasePrice !== undefined ? Number(data.purchasePrice) : stock.purchasePrice,
              currentPrice: data.currentPrice !== undefined ? Number(data.currentPrice) : stock.currentPrice,
              purchaseDate: data.purchaseDate !== undefined ? data.purchaseDate : stock.purchaseDate,
            }
            return updated
          })

          return { stocks: updatedStocks }
        })
      },

      deleteStock: (id: string) => {
        set((state) => {
          const updatedStocks = state.stocks.filter((stock) => stock.id !== id)
          const updatedHistoryMap = { ...state.historyMap }
          delete updatedHistoryMap[id]

          let nextSelectedId = state.selectedStockId
          if (state.selectedStockId === id) {
            nextSelectedId = updatedStocks.length > 0 ? updatedStocks[0].id : null
          }

          return {
            stocks: updatedStocks,
            historyMap: updatedHistoryMap,
            selectedStockId: nextSelectedId,
          }
        })
      },

      setSelectedStockId: (id: string | null) => {
        set({ selectedStockId: id })
      },

      resetToDefault: () => {
        set({
          stocks: initialStocks,
          selectedStockId: initialStocks[0]?.id ?? null,
          historyMap: initialHistoryMap,
        })
      },

      getSummary: () => {
        const { stocks } = get()
        const totalValue = stocks.reduce((acc, stock) => acc + stock.quantity * stock.currentPrice, 0)
        const totalInvested = stocks.reduce((acc, stock) => acc + stock.quantity * stock.purchasePrice, 0)
        const totalGainLoss = totalValue - totalInvested
        const totalGainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

        return {
          totalValue: +totalValue.toFixed(2),
          totalInvested: +totalInvested.toFixed(2),
          totalGainLoss: +totalGainLoss.toFixed(2),
          totalGainLossPercentage: +totalGainLossPercentage.toFixed(2),
          totalStocks: stocks.length,
        }
      },
    }),
    {
      name: 'stock-portfolio-storage',
      partialize: (state) => ({
        stocks: state.stocks,
        selectedStockId: state.selectedStockId,
        historyMap: state.historyMap,
      }),
    }
  )
)
