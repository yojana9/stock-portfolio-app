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

// Zustand Store for Centralized Portfolio State Management
// ---------------------------------------------------------------------------
// Why Zustand?
// 1. Minimal boilerplate compared to Redux (no action creators, reducers, or dispatchers).
// 2. High performance: components only re-render when the specific state they select changes.
// 3. Built-in 'persist' middleware automatically synchronizes our portfolio state to localStorage.
// ---------------------------------------------------------------------------

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      // Initial state populated with sample stocks and their simulated 30-day price history
      stocks: initialStocks,
      selectedStockId: initialStocks[0]?.id ?? null,
      historyMap: initialHistoryMap,

      /**
       * addStock:
       * Creates a new stock entry and prepends it to the portfolio list.
       * Also generates 30 days of realistic price history so charts work immediately.
       */
      addStock: (data: StockFormData) => {
        // Generate a unique identifier combining current timestamp and a random string
        const id = `stock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

        // Simulate a realistic current market price slightly fluctuating (-3% to +5%) from purchase price
        const priceVariance = (Math.random() * 0.08 - 0.03)
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

        // Generate 30 days of historical data for the new stock
        const newHistory = generateStockHistory(currentPrice, 30)

        // Update state immutably: new stock goes to the top, and selection focuses on it
        set((state) => ({
          stocks: [newStock, ...state.stocks],
          selectedStockId: newStock.id,
          historyMap: {
            ...state.historyMap,
            [newStock.id]: newHistory,
          },
        }))
      },

      /**
       * editStock:
       * Updates an existing stock position by ID.
       * Uses immutable array mapping to prevent unnecessary re-renders.
       */
      editStock: (id: string, data: Partial<StockFormData & { currentPrice?: number }>) => {
        set((state) => {
          const updatedStocks = state.stocks.map((stock) => {
            if (stock.id !== id) return stock

            // Merge updated fields with existing stock data
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

      /**
       * deleteStock:
       * Removes a stock and cleans up its associated historical chart data.
       * If the deleted stock was currently selected in the charts, auto-selects another stock.
       */
      deleteStock: (id: string) => {
        set((state) => {
          const updatedStocks = state.stocks.filter((stock) => stock.id !== id)
          const updatedHistoryMap = { ...state.historyMap }
          delete updatedHistoryMap[id]

          // Gracefully fallback selectedStockId if active stock was removed
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

      // Changes the active stock shown in the chart view
      setSelectedStockId: (id: string | null) => {
        set({ selectedStockId: id })
      },

      // Re-seeds the store with the default sample stocks
      resetToDefault: () => {
        set({
          stocks: initialStocks,
          selectedStockId: initialStocks[0]?.id ?? null,
          historyMap: initialHistoryMap,
        })
      },

      /**
       * getSummary:
       * Computes high-level financial metrics across the entire portfolio:
       * - Total Market Value = sum(quantity * currentPrice)
       * - Total Cost Basis (Invested) = sum(quantity * purchasePrice)
       * - Total Unrealized Gain/Loss ($) = Total Value - Total Invested
       * - Total Gain/Loss (%) = (Total Gain/Loss / Total Invested) * 100
       */
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
      // LocalStorage configuration: persists data under 'stock-portfolio-storage'
      name: 'stock-portfolio-storage',
      partialize: (state) => ({
        stocks: state.stocks,
        selectedStockId: state.selectedStockId,
        historyMap: state.historyMap,
      }),
    }
  )
)
