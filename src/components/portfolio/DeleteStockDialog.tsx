import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { usePortfolioStore } from '../../store/usePortfolioStore'
import type { Stock } from '../../types/stock'

interface DeleteStockDialogProps {
  open: boolean
  stock: Stock | null
  onClose: () => void
}

export const DeleteStockDialog: React.FC<DeleteStockDialogProps> = ({
  open,
  stock,
  onClose,
}) => {
  const { deleteStock } = usePortfolioStore()

  const handleDelete = () => {
    if (stock) {
      deleteStock(stock.id)
      onClose()
    }
  }

  if (!stock) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color="error" />
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          Delete Stock
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove{' '}
          <Box component="strong" sx={{ color: 'text.primary' }}>
            {stock.ticker} ({stock.companyName})
          </Box>{' '}
          from your portfolio?
        </DialogContentText>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          This will delete the {stock.quantity} shares position and its historical chart data.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete Position
        </Button>
      </DialogActions>
    </Dialog>
  )
}
