# Stock Portfolio Frontend Application

A personal stock portfolio management and analytics dashboard built with **React**, **TypeScript**, **Highcharts**, **TanStack Table**, and **Zustand**.

---

## Features

### 1. Stock Data Visualization
- **Line Graph (Price Trend)**: Displays 30-day historical closing price trends with tooltips, dynamic colors (green for gains, red for losses), and responsive layouts powered by Highcharts.
- **Column Chart (Volume & Gain/Loss)**: Interactive column chart toggling between:
  - **Volume Traded**: Daily share trading volume.
  - **Daily Gain/Loss**: Day-to-day dollar gain or loss with conditional green/red coloring.
- **Stock Selection**: Select any stock from the portfolio dropdown or directly from table rows to inspect its detailed performance.

### 2. Portfolio Management UI
- **Summary Metrics**: High-level portfolio overview cards displaying Total Portfolio Value, Total Profit/Loss (amount & percentage), Total Invested Capital, and Active Holdings count.
- **Tabular Layout with TanStack Table**:
  - Columns: Ticker symbol, Company name, Quantity, Purchase price, Current price, Total value, Gain/Loss, Purchase date, and Actions.
  - Interactive chip selection to focus chart on a specific stock.
  - Formatted currency values and colored gain/loss badges.

### 3. Add Stock to Portfolio
- Modal dialog with comprehensive basic form validation:
  - **Ticker**: Valid ticker format (1-8 alphabetic characters), automatically uppercase.
  - **Company Name**: Required non-empty string.
  - **Quantity**: Positive numerical value (> 0).
  - **Purchase Price**: Positive currency value (> $0.00).
  - **Date of Purchase**: Valid date picker (cannot select future dates).
- Automatically simulates realistic historical price trend and trading volume upon addition.

### 4. Edit & Delete Stock
- **Edit Stock**: Pre-populates stock details in an edit modal to modify quantity, purchase price, current price, and dates with instant optimistic state updates.
- **Delete Stock**: Modal confirmation dialog preventing accidental deletion, immediately removing the holding and updating chart selection.

### 5. Bonus Capabilities
- **Local Persistence**: Automatically persists portfolio holdings and historical time-series data in browser `localStorage` via Zustand `persist` middleware.
- **Sorting**: Multi-column sorting powered by TanStack Table (click any column header to toggle ascending/descending order).
- **Search & Filtering**: Real-time global text filter to quickly locate stocks by ticker symbol or company name.

---

## Tech Stack

| Technology | Role |
| :--- | :--- |
| **React 19** | Functional UI components with hooks |
| **TypeScript** | Strict static typing and data modeling |
| **Vite** | Fast modern frontend bundler and dev server |
| **Highcharts** & **highcharts-react-official** | Interactive, responsive financial charts |
| **@tanstack/react-table** | Headless tabular data, sorting, and filtering |
| **Zustand** | Lightweight state management with `persist` middleware |
| **Material-UI (MUI)** | Component library and styling |
| **Vitest** & **React Testing Library** | Automated unit and integration testing |

---

## Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd stock-portfolio-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Running Tests

Run the Vitest test suite:
```bash
npm test
```

### Building for Production

To build the production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## Project Structure

```
stock-portfolio-app/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   └── StockCharts.tsx            # Highcharts price line & volume/gain-loss column charts
│   │   └── portfolio/
│   │       ├── AddStockModal.tsx          # Modal dialog with validation to add stocks
│   │       ├── AddStockModal.test.tsx     # Add modal form validation tests
│   │       ├── DeleteStockDialog.tsx      # Deletion confirmation dialog
│   │       ├── EditStockModal.tsx         # Modal dialog to edit stock holdings
│   │       ├── PortfolioSummaryCards.tsx  # Top overview cards (Value, P&L, Invested)
│   │       ├── StockTable.tsx             # TanStack Table component with sort/filter
│   │       └── StockTable.test.tsx        # Table rendering, sorting, & filter tests
│   ├── data/
│   │   └── mockStocks.ts                  # Mock portfolio positions and history simulation
│   ├── store/
│   │   ├── usePortfolioStore.ts           # Zustand store with localStorage persistence
│   │   └── usePortfolioStore.test.ts      # Store action & portfolio math unit tests
│   ├── test/
│   │   └── setup.ts                       # Test environment setup with jest-dom matchers
│   ├── types/
│   │   └── stock.ts                       # TypeScript interfaces and data types
│   ├── App.tsx                            # Root application component
│   ├── index.css                          # Clean base typography and reset
│   └── main.tsx                           # Application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```
