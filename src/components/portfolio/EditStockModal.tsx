import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import type { Stock } from '../../types/stock'

interface EditStockModalProps {
  open: boolean
  stock: Stock | null
  onClose: () => void
}

export const EditStockModal: React.FC<EditStockModalProps> = ({ open, stock, onClose }) => {
  const { editStock } = usePortfolioStore()

  const [formData, setFormData] = useState({
    ticker: '',
    companyName: '',
    quantity: 1,
    purchasePrice: 100,
    currentPrice: 100,
    purchaseDate: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (stock) {
      setFormData({
        ticker: stock.ticker,
        companyName: stock.companyName,
        quantity: stock.quantity,
        purchasePrice: stock.purchasePrice,
        currentPrice: stock.currentPrice,
        purchaseDate: stock.purchaseDate,
      })
      setErrors({})
    }
  }, [stock])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.ticker.trim()) {
      newErrors.ticker = 'Ticker symbol is required.'
    } else if (!/^[A-Za-z.]{1,8}$/.test(formData.ticker.trim())) {
      newErrors.ticker = 'Enter a valid ticker (e.g. AAPL, MSFT).'
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required.'
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0.'
    }

    if (!formData.purchasePrice || formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0.'
    }

    if (!formData.currentPrice || formData.currentPrice <= 0) {
      newErrors.currentPrice = 'Current price must be greater than 0.'
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required.'
    } else if (new Date(formData.purchaseDate) > new Date()) {
      newErrors.purchaseDate = 'Purchase date cannot be in the future.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!stock || !validate()) return

    editStock(stock.id, {
      ticker: formData.ticker.trim().toUpperCase(),
      companyName: formData.companyName.trim(),
      quantity: Number(formData.quantity),
      purchasePrice: Number(formData.purchasePrice),
      currentPrice: Number(formData.currentPrice),
      purchaseDate: formData.purchaseDate,
    })

    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <EditIcon color="primary" />
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          Edit Stock — {stock?.ticker}
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' }, gap: 2 }}>
            <TextField
              label="Ticker Symbol"
              required
              fullWidth
              value={formData.ticker}
              onChange={(e) => {
                setFormData({ ...formData, ticker: e.target.value.toUpperCase() })
                if (errors.ticker) setErrors({ ...errors, ticker: '' })
              }}
              error={Boolean(errors.ticker)}
              helperText={errors.ticker}
              slotProps={{
                htmlInput: { maxLength: 8 },
              }}
            />

            <TextField
              label="Company Name"
              required
              fullWidth
              value={formData.companyName}
              onChange={(e) => {
                setFormData({ ...formData, companyName: e.target.value })
                if (errors.companyName) setErrors({ ...errors, companyName: '' })
              }}
              error={Boolean(errors.companyName)}
              helperText={errors.companyName}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              required
              fullWidth
              value={formData.quantity || ''}
              onChange={(e) => {
                setFormData({ ...formData, quantity: parseFloat(e.target.value) })
                if (errors.quantity) setErrors({ ...errors, quantity: '' })
              }}
              error={Boolean(errors.quantity)}
              helperText={errors.quantity}
              slotProps={{
                htmlInput: { min: 1, step: 'any' },
              }}
            />

            <TextField
              label="Purchase Price"
              type="number"
              required
              fullWidth
              value={formData.purchasePrice || ''}
              onChange={(e) => {
                setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })
                if (errors.purchasePrice) setErrors({ ...errors, purchasePrice: '' })
              }}
              error={Boolean(errors.purchasePrice)}
              helperText={errors.purchasePrice}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
                htmlInput: {
                  min: 0.01,
                  step: '0.01',
                },
              }}
            />

            <TextField
              label="Current Price"
              type="number"
              required
              fullWidth
              value={formData.currentPrice || ''}
              onChange={(e) => {
                setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })
                if (errors.currentPrice) setErrors({ ...errors, currentPrice: '' })
              }}
              error={Boolean(errors.currentPrice)}
              helperText={errors.currentPrice}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
                htmlInput: {
                  min: 0.01,
                  step: '0.01',
                },
              }}
            />
          </Box>

          <TextField
            label="Date of Purchase"
            type="date"
            required
            fullWidth
            value={formData.purchaseDate}
            onChange={(e) => {
              setFormData({ ...formData, purchaseDate: e.target.value })
              if (errors.purchaseDate) setErrors({ ...errors, purchaseDate: '' })
            }}
            error={Boolean(errors.purchaseDate)}
            helperText={errors.purchaseDate}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ px: 3 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
