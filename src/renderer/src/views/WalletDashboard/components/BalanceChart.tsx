import { useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import { ChartContainer, type ChartConfig } from '@renderer/components/ui/chart'

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'rgb(139, 92, 246)'
  }
} satisfies ChartConfig

export function generateChartData(currentBalance: number) {
  const points = 24
  const data: { time: number; balance: number }[] = []
  let value = currentBalance * 0.7

  for (let i = 0; i < points; i++) {
    const volatility = value * 0.08
    const change = (Math.random() - 0.4) * volatility
    value = Math.max(value + change, value * 0.9)
    if (i === points - 1) value = currentBalance
    data.push({ time: i, balance: value })
  }
  return data
}

interface BalanceChartProps {
  currentBalance: number
}

export function BalanceChart({ currentBalance }: BalanceChartProps) {
  const chartData = useMemo(() => generateChartData(currentBalance), [currentBalance])

  return (
    <ChartContainer config={chartConfig} className="h-screen w-screen absolute top-[40%] left-0 opacity-40">
      <AreaChart
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="balance"
          stroke="rgb(139, 92, 246)"
          strokeWidth={2}
          fill="url(#balanceGradient)"
          isAnimationActive={true}
          animationDuration={1500}
        />
      </AreaChart>
    </ChartContainer>
  )
}
