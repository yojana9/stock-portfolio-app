import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AddStockModal } from './AddStockModal'
import { usePortfolioStore } from '../../store/usePortfolioStore'

describe('AddStockModal', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    onClose.mockClear()
    usePortfolioStore.getState().resetToDefault()
  })

  it('renders modal when open', () => {
    render(<AddStockModal open={true} onClose={onClose} />)
    expect(screen.getByText('Add Stock to Portfolio')).toBeInTheDocument()
    expect(screen.getByLabelText(/Ticker Symbol/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Quantity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Purchase Price/i)).toBeInTheDocument()
  })

  it('validates required fields before submitting', () => {
    render(<AddStockModal open={true} onClose={onClose} />)

    const tickerInput = screen.getByLabelText(/Ticker Symbol/i)
    fireEvent.change(tickerInput, { target: { value: '' } })

    const submitButton = screen.getByRole('button', { name: /^Add Stock$/i })
    fireEvent.click(submitButton)

    expect(screen.getByText(/Ticker symbol is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Company name is required/i)).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('successfully adds stock and closes on valid submission', () => {
    render(<AddStockModal open={true} onClose={onClose} />)

    fireEvent.change(screen.getByLabelText(/Ticker Symbol/i), {
      target: { value: 'NFLX' },
    })
    fireEvent.change(screen.getByLabelText(/Company Name/i), {
      target: { value: 'Netflix Inc.' },
    })
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: '12' },
    })
    fireEvent.change(screen.getByLabelText(/Purchase Price/i), {
      target: { value: '620' },
    })

    const submitButton = screen.getByRole('button', { name: /^Add Stock$/i })
    fireEvent.click(submitButton)

    // Stock should be in store
    const added = usePortfolioStore
      .getState()
      .stocks.find((s) => s.ticker === 'NFLX')
    expect(added).toBeDefined()
    expect(added?.companyName).toBe('Netflix Inc.')
    expect(added?.quantity).toBe(12)
    expect(added?.purchasePrice).toBe(620)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
