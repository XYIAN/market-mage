'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { ProgressBar } from 'primereact/progressbar'
import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { Chart } from 'primereact/chart'

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
}

interface GameState {
  cash: number
  portfolio: { [symbol: string]: number }
  currentDay: number
  totalDays: number
  score: number
  stocks: StockData[]
  gameOver: boolean
}

export function StockTradingGame() {
  const [gameState, setGameState] = useState<GameState>({
    cash: 10000,
    portfolio: {},
    currentDay: 1,
    totalDays: 30,
    score: 0,
    stocks: [],
    gameOver: false,
  })
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null)
  const [buyAmount, setBuyAmount] = useState<number>(0)
  const [sellAmount, setSellAmount] = useState<number>(0)
  const [showGameOver, setShowGameOver] = useState(false)
  const [chartData, setChartData] = useState<any>(null)
  const toast = useRef<Toast>(null)

  // Initialize game with sample stocks
  useEffect(() => {
    const initialStocks: StockData[] = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 150.25,
        change: 2.15,
        changePercent: 1.45,
        volume: 45000000,
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 2800.5,
        change: -15.75,
        changePercent: -0.56,
        volume: 25000000,
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 320.75,
        change: 8.25,
        changePercent: 2.64,
        volume: 35000000,
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 850.0,
        change: 25.5,
        changePercent: 3.09,
        volume: 55000000,
      },
    ]

    setGameState((prev) => ({ ...prev, stocks: initialStocks }))
    updateChartData(initialStocks)
  }, [])

  const updateChartData = (stocks: StockData[]) => {
    setChartData({
      labels: stocks.map((s) => s.symbol),
      datasets: [
        {
          label: 'Stock Prices',
          data: stocks.map((s) => s.price),
          backgroundColor: stocks.map((s) =>
            s.change >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
          ),
          borderColor: stocks.map((s) =>
            s.change >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
          ),
          borderWidth: 2,
        },
      ],
    })
  }

  const simulateMarketMovement = () => {
    setGameState((prev) => {
      const updatedStocks = prev.stocks.map((stock) => {
        const volatility = 0.02 // 2% daily volatility
        const randomChange = (Math.random() - 0.5) * volatility
        const newPrice = stock.price * (1 + randomChange)
        const change = newPrice - stock.price
        const changePercent = (change / stock.price) * 100

        return {
          ...stock,
          price: Math.round(newPrice * 100) / 100,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4)),
        }
      })

      updateChartData(updatedStocks)

      const newDay = prev.currentDay + 1
      const gameOver = newDay > prev.totalDays

      return {
        ...prev,
        stocks: updatedStocks,
        currentDay: newDay,
        gameOver,
      }
    })
  }

  const buyStock = () => {
    if (!selectedStock || buyAmount <= 0) return

    const totalCost = selectedStock.price * buyAmount
    if (totalCost > gameState.cash) {
      toast.current?.show({
        severity: 'error',
        summary: 'Insufficient Funds',
        detail: "You don't have enough cash to make this purchase.",
        life: 3000,
      })
      return
    }

    setGameState((prev) => ({
      ...prev,
      cash: prev.cash - totalCost,
      portfolio: {
        ...prev.portfolio,
        [selectedStock.symbol]:
          (prev.portfolio[selectedStock.symbol] || 0) + buyAmount,
      },
    }))

    toast.current?.show({
      severity: 'success',
      summary: 'Purchase Successful',
      detail: `Bought ${buyAmount} shares of ${
        selectedStock.symbol
      } for $${totalCost.toFixed(2)}`,
      life: 3000,
    })

    setBuyAmount(0)
  }

  const sellStock = () => {
    if (!selectedStock || sellAmount <= 0) return

    const currentShares = gameState.portfolio[selectedStock.symbol] || 0
    if (sellAmount > currentShares) {
      toast.current?.show({
        severity: 'error',
        summary: 'Insufficient Shares',
        detail: `You only own ${currentShares} shares of ${selectedStock.symbol}`,
        life: 3000,
      })
      return
    }

    const totalValue = selectedStock.price * sellAmount

    setGameState((prev) => ({
      ...prev,
      cash: prev.cash + totalValue,
      portfolio: {
        ...prev.portfolio,
        [selectedStock.symbol]: currentShares - sellAmount,
      },
    }))

    toast.current?.show({
      severity: 'success',
      summary: 'Sale Successful',
      detail: `Sold ${sellAmount} shares of ${
        selectedStock.symbol
      } for $${totalValue.toFixed(2)}`,
      life: 3000,
    })

    setSellAmount(0)
  }

  const calculatePortfolioValue = () => {
    return Object.entries(gameState.portfolio).reduce(
      (total, [symbol, shares]) => {
        const stock = gameState.stocks.find((s) => s.symbol === symbol)
        return total + (stock ? stock.price * shares : 0)
      },
      0
    )
  }

  const calculateTotalValue = () => {
    return gameState.cash + calculatePortfolioValue()
  }

  const calculateScore = () => {
    const totalValue = calculateTotalValue()
    const initialValue = 10000
    const returnPercent = ((totalValue - initialValue) / initialValue) * 100
    return Math.round(returnPercent * 100)
  }

  const handleNextDay = () => {
    simulateMarketMovement()

    if (gameState.currentDay >= gameState.totalDays) {
      const finalScore = calculateScore()
      setGameState((prev) => ({ ...prev, score: finalScore }))
      setShowGameOver(true)
    }
  }

  const resetGame = () => {
    setGameState({
      cash: 10000,
      portfolio: {},
      currentDay: 1,
      totalDays: 30,
      score: 0,
      stocks: [],
      gameOver: false,
    })
    setShowGameOver(false)
    setSelectedStock(null)
    setBuyAmount(0)
    setSellAmount(0)
  }

  return (
    <>
      <Toast ref={toast} />

      <div className="space-y-6">
        {/* Game Header */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                Day {gameState.currentDay}/{gameState.totalDays}
              </div>
              <div className="text-sm text-gray-600">Current Day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                ${gameState.cash.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Cash</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                ${calculatePortfolioValue().toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Portfolio</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                ${calculateTotalValue().toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Game Progress</span>
              <span>
                {gameState.currentDay}/{gameState.totalDays}
              </span>
            </div>
            <ProgressBar
              value={(gameState.currentDay / gameState.totalDays) * 100}
              className="h-3"
            />
          </div>
        </Card>

        {/* Stock Chart */}
        {chartData && (
          <Card header="Market Overview">
            <Chart
              type="bar"
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                  },
                },
              }}
            />
          </Card>
        )}

        {/* Stock List */}
        <Card header="Available Stocks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameState.stocks.map((stock) => (
              <Card
                key={stock.symbol}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedStock?.symbol === stock.symbol
                    ? 'ring-2 ring-orange-500'
                    : ''
                }`}
                onClick={() => setSelectedStock(stock)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-sm ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stock.change >= 0 ? '+' : ''}
                      {stock.change.toFixed(2)} (
                      {stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Trading Interface */}
        {selectedStock && (
          <Card
            header={`Trade ${selectedStock.symbol} - ${selectedStock.name}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buy Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-600">
                  Buy Shares
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Number of Shares
                  </label>
                  <InputNumber
                    value={buyAmount}
                    onValueChange={(e) => setBuyAmount(e.value || 0)}
                    min={0}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    Total Cost: ${(selectedStock.price * buyAmount).toFixed(2)}
                  </p>
                </div>
                <Button
                  label="Buy Shares"
                  icon="pi pi-plus"
                  onClick={buyStock}
                  disabled={buyAmount <= 0}
                  className="w-full"
                />
              </div>

              {/* Sell Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-600">
                  Sell Shares
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Number of Shares
                  </label>
                  <InputNumber
                    value={sellAmount}
                    onValueChange={(e) => setSellAmount(e.value || 0)}
                    min={0}
                    max={gameState.portfolio[selectedStock.symbol] || 0}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">
                    Total Value: $
                    {(selectedStock.price * sellAmount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Owned: {gameState.portfolio[selectedStock.symbol] || 0}{' '}
                    shares
                  </p>
                </div>
                <Button
                  label="Sell Shares"
                  icon="pi pi-minus"
                  onClick={sellStock}
                  disabled={sellAmount <= 0}
                  className="w-full"
                  severity="secondary"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Portfolio */}
        <Card header="Your Portfolio">
          {Object.keys(gameState.portfolio).length === 0 ? (
            <div className="text-center py-8">
              <i className="pi pi-briefcase text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">
                No stocks in your portfolio yet. Start trading!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(gameState.portfolio).map(([symbol, shares]) => {
                const stock = gameState.stocks.find((s) => s.symbol === symbol)
                if (!stock) return null

                const value = stock.price * shares
                return (
                  <div
                    key={symbol}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{symbol}</h4>
                      <p className="text-sm text-gray-600">{shares} shares</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${value.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        ${stock.price.toFixed(2)} per share
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Game Controls */}
        <div className="flex justify-center">
          <Button
            label="Next Day"
            icon="pi pi-calendar-plus"
            onClick={handleNextDay}
            disabled={gameState.gameOver}
            className="p-button-lg"
          />
        </div>
      </div>

      {/* Game Over Dialog */}
      <Dialog
        visible={showGameOver}
        onHide={() => setShowGameOver(false)}
        header="Game Complete!"
        style={{ width: '500px' }}
        modal
        closable={false}
      >
        <div className="text-center space-y-6">
          <div className="text-6xl">🏆</div>
          <h2 className="text-2xl font-bold">Congratulations!</h2>
          <p className="text-gray-600">
            You've completed the stock trading simulation!
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {gameState.score}
              </div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">
                  ${gameState.cash.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Final Cash</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-semibold text-purple-600">
                  ${calculateTotalValue().toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            <Button
              label="Play Again"
              icon="pi pi-refresh"
              onClick={resetGame}
            />
            <Button
              label="Close"
              icon="pi pi-times"
              onClick={() => setShowGameOver(false)}
              className="p-button-outlined"
            />
          </div>
        </div>
      </Dialog>
    </>
  )
}
