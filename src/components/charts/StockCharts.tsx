import React, { useMemo, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import BarChartIcon from '@mui/icons-material/BarChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { usePortfolioStore } from '../../store/usePortfolioStore'

export const StockCharts: React.FC = () => {
  const { stocks, selectedStockId, setSelectedStockId, historyMap } = usePortfolioStore()
  const [columnMetric, setColumnMetric] = useState<'volume' | 'gainLoss'>('volume')

  // Selected stock or default to first
  const currentStock = useMemo(() => {
    return stocks.find((s) => s.id === selectedStockId) || stocks[0] || null
  }, [stocks, selectedStockId])

  const history = useMemo(() => {
    if (!currentStock) return []
    return historyMap[currentStock.id] || []
  }, [currentStock, historyMap])

  // Price calculations
  const priceStats = useMemo(() => {
    if (!history.length) return { min: 0, max: 0, change: 0, changePercent: 0 }
    const prices = history.map((h) => h.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const firstPrice = history[0].price
    const lastPrice = history[history.length - 1].price
    const change = +(lastPrice - firstPrice).toFixed(2)
    const changePercent = +((change / firstPrice) * 100).toFixed(2)
    return { min, max, change, changePercent }
  }, [history])

  // Highcharts Line Chart Configuration (Stock Price Trend)
  const lineChartOptions: Highcharts.Options = useMemo(() => {
    const categories = history.map((h) => h.date)
    const prices = history.map((h) => h.price)
    const isPositive = priceStats.change >= 0

    return {
      chart: {
        type: 'spline',
        height: 320,
        backgroundColor: 'transparent',
        style: { fontFamily: 'inherit' },
      },
      title: {
        text: currentStock ? `${currentStock.ticker} - Price Trend (Last 30 Days)` : 'Stock Price Trend',
        align: 'left',
        style: { fontSize: '16px', fontWeight: '600' },
      },
      credits: { enabled: false },
      xAxis: {
        categories,
        labels: {
          style: { fontSize: '11px', color: '#666' },
          step: Math.ceil(categories.length / 6),
        },
        gridLineWidth: 0,
      },
      yAxis: {
        title: { text: 'Price (USD)', style: { color: '#666' } },
        labels: {
          format: '${value:.2f}',
          style: { color: '#666' },
        },
        gridLineDashStyle: 'Dash',
      },
      tooltip: {
        shared: true,
        useHTML: true,
        valuePrefix: '$',
        headerFormat: '<small style="color:#666">{point.key}</small><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b>{series.name}</b>: <b>${point.y:.2f}</b>',
      },
      legend: { enabled: false },
      plotOptions: {
        spline: {
          lineWidth: 3,
          color: isPositive ? '#10b981' : '#ef4444',
          marker: {
            enabled: false,
            radius: 4,
            states: {
              hover: { enabled: true },
            },
          },
        },
      },
      series: [
        {
          name: 'Closing Price',
          type: 'spline',
          data: prices,
        },
      ],
      responsive: {
        rules: [
          {
            condition: { maxWidth: 600 },
            chartOptions: {
              chart: { height: 260 },
              xAxis: {
                labels: { step: Math.ceil(categories.length / 3) },
              },
            },
          },
        ],
      },
    }
  }, [currentStock, history, priceStats])

  // Highcharts Column Chart Configuration (Volume / Daily Gain-Loss)
  const columnChartOptions: Highcharts.Options = useMemo(() => {
    const categories = history.map((h) => h.date)

    if (columnMetric === 'volume') {
      const volumes = history.map((h) => h.volume)
      return {
        chart: {
          type: 'column',
          height: 280,
          backgroundColor: 'transparent',
          style: { fontFamily: 'inherit' },
        },
        title: {
          text: currentStock ? `${currentStock.ticker} - Trading Volume Traded` : 'Volume Traded',
          align: 'left',
          style: { fontSize: '16px', fontWeight: '600' },
        },
        credits: { enabled: false },
        xAxis: {
          categories,
          labels: {
            style: { fontSize: '11px', color: '#666' },
            step: Math.ceil(categories.length / 6),
          },
        },
        yAxis: {
          title: { text: 'Volume (Shares)', style: { color: '#666' } },
          labels: {
            formatter: function () {
              return (Number(this.value) / 1000000).toFixed(1) + 'M'
            },
            style: { color: '#666' },
          },
          gridLineDashStyle: 'Dash',
        },
        tooltip: {
          headerFormat: '<small style="color:#666">{point.key}</small><br/>',
          pointFormatter: function () {
            return `<b>Volume:</b> ${this.y?.toLocaleString()} shares`
          },
        },
        legend: { enabled: false },
        plotOptions: {
          column: {
            color: '#3b82f6',
            borderRadius: 3,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: 'Volume',
            type: 'column',
            data: volumes,
          },
        ],
        responsive: {
          rules: [
            {
              condition: { maxWidth: 600 },
              chartOptions: {
                chart: { height: 230 },
              },
            },
          ],
        },
      }
    } else {
      // Daily Gain/Loss Column Chart
      const gainLossData = history.map((h) => ({
        y: h.dailyGainLoss,
        color: h.dailyGainLoss >= 0 ? '#10b981' : '#ef4444',
      }))

      return {
        chart: {
          type: 'column',
          height: 280,
          backgroundColor: 'transparent',
          style: { fontFamily: 'inherit' },
        },
        title: {
          text: currentStock ? `${currentStock.ticker} - Daily Gain / Loss` : 'Daily Gain / Loss',
          align: 'left',
          style: { fontSize: '16px', fontWeight: '600' },
        },
        credits: { enabled: false },
        xAxis: {
          categories,
          labels: {
            style: { fontSize: '11px', color: '#666' },
            step: Math.ceil(categories.length / 6),
          },
        },
        yAxis: {
          title: { text: 'Daily Change ($)', style: { color: '#666' } },
          labels: {
            format: '${value:.2f}',
            style: { color: '#666' },
          },
          gridLineDashStyle: 'Dash',
        },
        tooltip: {
          headerFormat: '<small style="color:#666">{point.key}</small><br/>',
          pointFormatter: function () {
            const prefix = (this.y || 0) >= 0 ? '+$' : '-$'
            return `<b>Daily Change:</b> ${prefix}${Math.abs(this.y || 0).toFixed(2)}`
          },
        },
        legend: { enabled: false },
        plotOptions: {
          column: {
            borderRadius: 3,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: 'Daily Gain/Loss',
            type: 'column',
            data: gainLossData,
          },
        ],
        responsive: {
          rules: [
            {
              condition: { maxWidth: 600 },
              chartOptions: {
                chart: { height: 230 },
              },
            },
          ],
        },
      }
    }
  }, [columnMetric, currentStock, history])

  if (stocks.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">
          No stocks in portfolio to visualize. Add a stock below to view performance charts.
        </Typography>
      </Card>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Top Header Controls */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel id="stock-select-label">Select Stock Chart</InputLabel>
            <Select
              labelId="stock-select-label"
              id="stock-select"
              value={currentStock?.id || ''}
              label="Select Stock Chart"
              onChange={(e) => setSelectedStockId(e.target.value)}
            >
              {stocks.map((stock) => (
                <MenuItem key={stock.id} value={stock.id}>
                  <strong>{stock.ticker}</strong> &nbsp;— {stock.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {currentStock && (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <Chip
                icon={<TrendingUpIcon fontSize="small" />}
                label={`Current: $${currentStock.currentPrice.toFixed(2)}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`30D Change: ${priceStats.change >= 0 ? '+' : ''}${priceStats.changePercent}%`}
                color={priceStats.change >= 0 ? 'success' : 'error'}
              />
            </Box>
          )}
        </Box>

        {/* Toggle between Volume and Daily Gain/Loss */}
        <ToggleButtonGroup
          value={columnMetric}
          exclusive
          size="small"
          onChange={(_, next) => {
            if (next) setColumnMetric(next)
          }}
          aria-label="column chart metric"
        >
          <ToggleButton value="volume" aria-label="trading volume">
            <BarChartIcon fontSize="small" sx={{ mr: 0.5 }} /> Volume Traded
          </ToggleButton>
          <ToggleButton value="gainLoss" aria-label="daily gain or loss">
            <ShowChartIcon fontSize="small" sx={{ mr: 0.5 }} /> Daily Gain/Loss
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Grid of Charts */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Line Chart */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ pb: 1 }}>
            <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
          </CardContent>
        </Card>

        {/* Column Chart */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ pb: 1 }}>
            <HighchartsReact highcharts={Highcharts} options={columnChartOptions} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
