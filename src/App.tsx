import React, { useState } from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Tooltip,
} from '@mui/material'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { PortfolioSummaryCards } from './components/portfolio/PortfolioSummaryCards'
import { StockCharts } from './components/charts/StockCharts'
import { StockTable } from './components/portfolio/StockTable'
import { AddStockModal } from './components/portfolio/AddStockModal'
import { EditStockModal } from './components/portfolio/EditStockModal'
import { DeleteStockDialog } from './components/portfolio/DeleteStockDialog'
import { usePortfolioStore } from './store/usePortfolioStore'
import type { Stock } from './types/stock'

// ---------------------------------------------------------------------------
// Design System & Theme: Material-UI (MUI v6)
// ---------------------------------------------------------------------------
// Configured with a modern financial palette:
// - Primary: Trustworthy indigo blue (#2563eb)
// - Success: Vibrant emerald green (#10b981) for positive gains
// - Error: Crisp crimson red (#ef4444) for losses
// - Typography: Inter font family for high legibility in financial data tables
// ---------------------------------------------------------------------------
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
      light: '#60a5fa',
    },
    secondary: {
      main: '#8b5cf6',
    },
    success: {
      main: '#10b981',
      dark: '#059669',
      light: '#d1fae5',
    },
    error: {
      main: '#ef4444',
      dark: '#dc2626',
      light: '#fee2e2',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export const App: React.FC = () => {
  const { resetToDefault } = usePortfolioStore()

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [stockToEdit, setStockToEdit] = useState<Stock | null>(null)
  const [stockToDelete, setStockToDelete] = useState<Stock | null>(null)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        {/* App Bar */}
        <AppBar position="static" color="inherit" elevation={1} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #e2e8f0' }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShowChartIcon fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h6" color="text.primary" sx={{ lineHeight: 1.2 }}>
                    Stock Portfolio Manager
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Real-time Performance & Holdings
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                  label="Market Active"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 600, display: { xs: 'none', sm: 'inline-flex' } }}
                />
                <Tooltip title="Reset Portfolio to Sample Data">
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<RestartAltIcon />}
                    onClick={resetToDefault}
                  >
                    Reset Data
                  </Button>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main Content Area */}
        <Container maxWidth="xl" sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1 }}>
          {/* Section 1: Portfolio Summary Overview */}
          <PortfolioSummaryCards />

          {/* Section 2: Stock Performance Charts (Highcharts Line & Column) */}
          <Box component="section">
            <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
              Stock Performance & Analytics
            </Typography>
            <StockCharts />
          </Box>

          {/* Section 3: Portfolio Management Table (TanStack Table) */}
          <Box component="section">
            <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
              Personal Stock Portfolio Holdings
            </Typography>
            <StockTable
              onAddStockClick={() => setIsAddOpen(true)}
              onEditStock={(stock) => setStockToEdit(stock)}
              onDeleteStock={(stock) => setStockToDelete(stock)}
            />
          </Box>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            bgcolor: 'background.paper',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Stock Portfolio Manager • 2026
          </Typography>
        </Box>

        {/* Modals & Dialogs */}
        <AddStockModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
        <EditStockModal open={Boolean(stockToEdit)} stock={stockToEdit} onClose={() => setStockToEdit(null)} />
        <DeleteStockDialog
          open={Boolean(stockToDelete)}
          stock={stockToDelete}
          onClose={() => setStockToDelete(null)}
        />
      </Box>
    </ThemeProvider>
  )
}

export default App
