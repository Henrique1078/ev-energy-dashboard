import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card } from '../ui/Card'
import type { EVDataRow } from '../../types'

interface Props {
  data: EVDataRow[]
  year: number
}

const POWERTRAINS: Record<string, string> = {
  BEV: 'var(--color-chart-1)',
  PHEV: 'var(--color-chart-2)',
  FCEV: 'var(--color-chart-5)',
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { percent: number } }>
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div style={{
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
    }}>
      <p style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: 4 }}>
        {item.name}
      </p>
      <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
        {(item.value / 1000).toFixed(0)}K vehicles
      </p>
      <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
        {(item.payload.percent * 100).toFixed(1)}% of total
      </p>
    </div>
  )
}

export function PowertrainShareChart({ data, year }: Props) {
  const chartData = Object.entries(POWERTRAINS).map(([pt]) => ({
    name: pt,
    value: data
      .filter(d =>
        d.parameter === 'EV sales' &&
        d.mode === 'Cars' &&
        d.powertrain === pt &&
        d.year === year &&
        d.region === 'World'
      )
      .reduce((sum, d) => sum + d.value, 0),
  })).filter(d => d.value > 0)

  return (
    <Card
      title="Powertrain Share"
      subtitle={`BEV vs PHEV vs FCEV · ${year}`}
      delay={0.4}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={Object.values(POWERTRAINS)[index]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: 'var(--color-text-secondary)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
