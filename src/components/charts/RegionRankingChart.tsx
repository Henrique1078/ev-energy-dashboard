import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { Card } from '../ui/Card'
import type { RegionData } from '../../types'

interface Props {
  data: RegionData[]
  year: number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
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
      <p style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ color: 'var(--color-chart-1)', margin: 0 }}>
        {payload[0].value >= 1_000_000 ? `${(payload[0].value/1_000_000).toFixed(1)}M` : `${(payload[0].value/1_000).toFixed(0)}K`} vehicles sold
      </p>
    </div>
  )
}

export function RegionRankingChart({ data, year }: Props) {
  return (
    <Card
      title="Top 10 Markets"
      subtitle={`EV car sales ranking · ${year}`}
      delay={0.3}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 60, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickFormatter={v => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v/1_000).toFixed(0)}K` : `${v}`}
          />
          <YAxis
            type="category"
            dataKey="region"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={index === 0
                  ? 'var(--color-chart-1)'
                  : index === 1
                  ? 'var(--color-chart-2)'
                  : 'var(--color-chart-3)'
                }
                opacity={1 - index * 0.06}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
