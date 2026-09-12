import { describe, it, expect, beforeEach } from 'vitest'
import { usePortfolioStore } from './usePortfolioStore'
import { initialStocks } from '../data/mockStocks'

describe('usePortfolioStore', () => {
  beforeEach(() => {
    usePortfolioStore.getState().resetToDefault()
  })

  it('initializes with default stocks and selected stock', () => {
    const state = usePortfolioStore.getState()
    expect(state.stocks.length).toBe(initialStocks.length)
    expect(state.selectedStockId).toBe(initialStocks[0].id)
  })

  it('calculates portfolio summary correctly', () => {
    const summary = usePortfolioStore.getState().getSummary()
    const expectedValue = initialStocks.reduce(
      (acc, s) => acc + s.quantity * s.currentPrice,
      0
    )
    const expectedInvested = initialStocks.reduce(
      (acc, s) => acc + s.quantity * s.purchasePrice,
      0
    )

    expect(summary.totalStocks).toBe(initialStocks.length)
    expect(summary.totalValue).toBeCloseTo(expectedValue, 2)
    expect(summary.totalInvested).toBeCloseTo(expectedInvested, 2)
    expect(summary.totalGainLoss).toBeCloseTo(expectedValue - expectedInvested, 2)
  })

  it('adds a new stock to the portfolio', () => {
    const newStockData = {
      ticker: 'TSLA',
      companyName: 'Tesla, Inc.',
      quantity: 10,
      purchasePrice: 200,
      purchaseDate: '2024-05-01',
    }

    usePortfolioStore.getState().addStock(newStockData)
    const state = usePortfolioStore.getState()

    const added = state.stocks.find((s) => s.ticker === 'TSLA')
    expect(added).toBeDefined()
    expect(added?.companyName).toBe('Tesla, Inc.')
    expect(added?.quantity).toBe(10)
    expect(added?.purchasePrice).toBe(200)
    expect(state.selectedStockId).toBe(added?.id)
    // History should also be generated for the new stock
    expect(state.historyMap[added!.id]).toBeDefined()
    expect(state.historyMap[added!.id].length).toBe(30)
  })

  it('edits an existing stock in the portfolio', () => {
    const targetStock = initialStocks[0]
    usePortfolioStore.getState().editStock(targetStock.id, {
      quantity: 50,
      currentPrice: 300,
    })

    const updated = usePortfolioStore
      .getState()
      .stocks.find((s) => s.id === targetStock.id)
    expect(updated?.quantity).toBe(50)
    expect(updated?.currentPrice).toBe(300)
    expect(updated?.ticker).toBe(targetStock.ticker) // Unchanged fields remain
  })

  it('deletes a stock from the portfolio', () => {
    const stockToDelete = initialStocks[0]
    usePortfolioStore.getState().deleteStock(stockToDelete.id)

    const state = usePortfolioStore.getState()
    const found = state.stocks.find((s) => s.id === stockToDelete.id)
    expect(found).toBeUndefined()
    expect(state.stocks.length).toBe(initialStocks.length - 1)
    // Deleted stock history should also be removed
    expect(state.historyMap[stockToDelete.id]).toBeUndefined()
    // Selected stock should update to the next available stock
    expect(state.selectedStockId).toBe(state.stocks[0].id)
  })
})
