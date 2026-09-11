import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/react-table'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import type { Stock } from '../../types/stock'
import { usePortfolioStore } from '../../store/usePortfolioStore'

interface StockTableProps {
  onEditStock: (stock: Stock) => void
  onDeleteStock: (stock: Stock) => void
  onAddStockClick: () => void
}

const columnHelper = createColumnHelper<Stock>()

export const StockTable: React.FC<StockTableProps> = ({
  onEditStock,
  onDeleteStock,
  onAddStockClick,
}) => {
  const { stocks, selectedStockId, setSelectedStockId } = usePortfolioStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('ticker', {
        header: 'Ticker',
        cell: (info) => {
          const isSelected = info.row.original.id === selectedStockId
          return (
            <Chip
              label={info.getValue()}
              size="small"
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedStockId(info.row.original.id)
              }}
            />
          )
        },
      }),
      columnHelper.accessor('companyName', {
        header: 'Company Name',
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: (info) => (
          <Typography variant="body2" sx={{ textAlign: 'right' }}>
            {info.getValue().toLocaleString()}
          </Typography>
        ),
      }),
      columnHelper.accessor('purchasePrice', {
        header: 'Purchase Price',
        cell: (info) => (
          <Typography variant="body2" sx={{ textAlign: 'right' }}>
            ${info.getValue().toFixed(2)}
          </Typography>
        ),
      }),
      columnHelper.accessor('currentPrice', {
        header: 'Current Price',
        cell: (info) => (
          <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 600 }}>
            ${info.getValue().toFixed(2)}
          </Typography>
        ),
      }),
      columnHelper.accessor(
        (row) => row.quantity * row.currentPrice,
        {
          id: 'totalValue',
          header: 'Total Value',
          cell: (info) => (
            <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 600 }}>
              ${info.getValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          ),
        }
      ),
      columnHelper.accessor(
        (row) => {
          const invested = row.quantity * row.purchasePrice
          const current = row.quantity * row.currentPrice
          return current - invested
        },
        {
          id: 'gainLoss',
          header: 'Gain / Loss',
          cell: (info) => {
            const gainLoss = info.getValue()
            const stock = info.row.original
            const invested = stock.quantity * stock.purchasePrice
            const percent = invested > 0 ? (gainLoss / invested) * 100 : 0
            const isProfit = gainLoss >= 0
            const color = isProfit ? 'success.main' : 'error.main'
            return (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
                  {isProfit ? '+' : ''}${gainLoss.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ color }}>
                  ({isProfit ? '+' : ''}{percent.toFixed(2)}%)
                </Typography>
              </Box>
            )
          },
        }
      ),
      columnHelper.accessor('purchaseDate', {
        header: 'Purchase Date',
        cell: (info) => (
          <Typography variant="body2" color="text.secondary">
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <Box sx={{ textAlign: 'center' }}>Actions</Box>,
        cell: (info) => {
          const stock = info.row.original
          const isSelected = stock.id === selectedStockId

          return (
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
              <Tooltip title="View Stock Chart">
                <IconButton
                  size="small"
                  color={isSelected ? 'primary' : 'default'}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedStockId(stock.id)
                  }}
                  aria-label={`view chart for ${stock.ticker}`}
                >
                  <ShowChartIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Stock">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditStock(stock)
                  }}
                  aria-label={`edit ${stock.ticker}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Stock">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteStock(stock)
                  }}
                  aria-label={`delete ${stock.ticker}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )
        },
      }),
    ],
    [selectedStockId, setSelectedStockId, onEditStock, onDeleteStock]
  )

  const table = useReactTable({
    data: stocks,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _, filterValue: string) => {
      const query = (filterValue || '').toLowerCase().trim()
      const ticker = row.original.ticker.toLowerCase()
      const company = row.original.companyName.toLowerCase()
      return ticker.includes(query) || company.includes(query)
    },
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Search and Table Top Actions */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Filter by ticker or company..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ maxWidth: { sm: 320 } }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={onAddStockClick}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          + Add Stock
        </Button>
      </Box>

      {/* TanStack Table Container */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 750 }} size="medium" aria-label="stock portfolio table">
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const isSorted = header.column.getIsSorted()

                  return (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{
                        fontWeight: 700,
                        cursor: canSort ? 'pointer' : 'default',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <Box component="span" sx={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                            {isSorted === 'asc' ? (
                              <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                            ) : isSorted === 'desc' ? (
                              <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <SwapVertIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {stocks.length === 0
                      ? 'No stocks in your portfolio yet. Click "Add Stock" to get started.'
                      : 'No stocks matched your filter.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const isSelected = row.original.id === selectedStockId

                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isSelected}
                    onClick={() => setSelectedStockId(row.original.id)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: isSelected ? 'action.selected' : 'inherit',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
