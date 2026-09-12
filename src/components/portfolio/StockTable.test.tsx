import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StockTable } from './StockTable'
import { initialStocks } from '../../data/mockStocks'
import { usePortfolioStore } from '../../store/usePortfolioStore'

describe('StockTable', () => {
  const onEditStock = vi.fn()
  const onDeleteStock = vi.fn()
  const onAddStockClick = vi.fn()

  it('renders table headers and initial stock entries', () => {
    render(
      <StockTable
        onEditStock={onEditStock}
        onDeleteStock={onDeleteStock}
        onAddStockClick={onAddStockClick}
      />
    )

    expect(screen.getByText('Ticker')).toBeInTheDocument()
    expect(screen.getByText('Company Name')).toBeInTheDocument()
    expect(screen.getByText('Quantity')).toBeInTheDocument()
    expect(screen.getByText('Purchase Price')).toBeInTheDocument()
    expect(screen.getByText('Current Price')).toBeInTheDocument()
    expect(screen.getByText('Total Value')).toBeInTheDocument()

    // Verify first mock stock appears
    expect(screen.getByText(initialStocks[0].ticker)).toBeInTheDocument()
    expect(screen.getByText(initialStocks[0].companyName)).toBeInTheDocument()
  })

  it('filters stock list by search term', () => {
    render(
      <StockTable
        onEditStock={onEditStock}
        onDeleteStock={onDeleteStock}
        onAddStockClick={onAddStockClick}
      />
    )

    const searchInput = screen.getByPlaceholderText('Filter by ticker or company...')
    fireEvent.change(searchInput, { target: { value: 'Apple' } })

    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.queryByText('Microsoft Corporation')).not.toBeInTheDocument()
  })

  it('calls onAddStockClick when "+ Add Stock" button is clicked', () => {
    render(
      <StockTable
        onEditStock={onEditStock}
        onDeleteStock={onDeleteStock}
        onAddStockClick={onAddStockClick}
      />
    )

    const addButton = screen.getByRole('button', { name: /\+ Add Stock/i })
    fireEvent.click(addButton)
    expect(onAddStockClick).toHaveBeenCalledTimes(1)
  })

  it('calls onEditStock when edit button is clicked', () => {
    render(
      <StockTable
        onEditStock={onEditStock}
        onDeleteStock={onDeleteStock}
        onAddStockClick={onAddStockClick}
      />
    )

    const editButtons = screen.getAllByRole('button', { name: /edit/i })
    fireEvent.click(editButtons[0])
    expect(onEditStock).toHaveBeenCalled()
  })

  it('calls onDeleteStock when delete button is clicked', () => {
    render(
      <StockTable
        onEditStock={onEditStock}
        onDeleteStock={onDeleteStock}
        onAddStockClick={onAddStockClick}
      />
    )

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[0])
    expect(onDeleteStock).toHaveBeenCalled()
  })

  it('selects a stock on row or ticker click', () => {
    render(
      <StockTable
        onEditStock={onEditStock}
        onDeleteStock={onDeleteStock}
        onAddStockClick={onAddStockClick}
      />
    )

    const secondStock = initialStocks[1]
    const chip = screen.getByText(secondStock.ticker)
    fireEvent.click(chip)

    expect(usePortfolioStore.getState().selectedStockId).toBe(secondStock.id)
  })
})
