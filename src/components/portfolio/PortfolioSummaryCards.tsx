import React from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import PaidIcon from '@mui/icons-material/Paid'
import PieChartIcon from '@mui/icons-material/PieChart'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export const PortfolioSummaryCards: React.FC = () => {
  const { getSummary } = usePortfolioStore()
  const summary = getSummary()

  const isProfit = summary.totalGainLoss >= 0

  const cards = [
    {
      label: 'Portfolio Value',
      value: `$${summary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <AccountBalanceWalletIcon sx={{ color: 'primary.main', fontSize: 28 }} />,
      subtitle: 'Current market worth',
    },
    {
      label: 'Total Profit / Loss',
      value: `${isProfit ? '+' : ''}$${summary.totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: isProfit ? (
        <TrendingUpIcon sx={{ color: 'success.main', fontSize: 28 }} />
      ) : (
        <TrendingDownIcon sx={{ color: 'error.main', fontSize: 28 }} />
      ),
      subtitle: `${isProfit ? '+' : ''}${summary.totalGainLossPercentage}% return`,
      color: isProfit ? 'success.main' : 'error.main',
    },
    {
      label: 'Total Invested',
      value: `$${summary.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <PaidIcon sx={{ color: 'info.main', fontSize: 28 }} />,
      subtitle: 'Total principal cost',
    },
    {
      label: 'Active Holdings',
      value: `${summary.totalStocks} Stocks`,
      icon: <PieChartIcon sx={{ color: 'secondary.main', fontSize: 28 }} />,
      subtitle: 'Diversified assets',
    },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: 2.5,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.label}
          sx={{
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {card.label}
              </Typography>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 1.5,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: card.color || 'text.primary',
                letterSpacing: '-0.02em',
                mb: 0.5,
              }}
            >
              {card.value}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {card.subtitle}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
