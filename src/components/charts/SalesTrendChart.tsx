import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { Card } from '../ui/Card'
import type { ChartDataPoint } from '../../types'

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
]

interface Props {
  data: ChartDataPoint[]
  regions: string[]
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function formatAxis(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return `${v}`
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 6, fontWeight: 600 }}>
        {label}
      </p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: <strong>{formatAxis(p.value)}</strong> vehicles
        </p>
      ))}
    </div>
  )
}

export function SalesTrendChart({ data, regions }: Props) {
  const byYear = data.reduce<Record<number, Record<string, number>>>((acc, d) => {
    if (!acc[d.year]) acc[d.year] = {}
    acc[d.year][d.region!] = (acc[d.year][d.region!] || 0) + d.value
    return acc
  }, {})

  const chartData = Object.entries(byYear)
    .map(([year, values]) => ({ year: parseInt(year), ...values }))
    .sort((a, b) => a.year - b.year)

  return (
    <Card
      title="EV Sales Trend"
      subtitle="Battery Electric Vehicles (BEV) · Historical data by region"
      delay={0.2}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="year"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <YAxis
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickFormatter={formatAxis}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: 'var(--color-text-secondary)' }}
          />
          {regions.map((region, i) => (
            <Line
              key={region}
              type="monotone"
              dataKey={region}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
