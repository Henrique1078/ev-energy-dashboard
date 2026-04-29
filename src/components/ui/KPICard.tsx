import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface KPICardProps {
  label: string
  yearValue: number
  totalValue: number
  unit?: string
  growth?: number
  accentColor: string
  dimColor: string
  selectedYear: number
  delay?: number
  format?: "number" | "decimal"
  description: string
}

function fmt(v: number, f: string) {
  if (f === "decimal") return v.toFixed(2)
  if (v >= 1_000_000_000) return `${(v/1e9).toFixed(1)}B`
  if (v >= 1_000_000) return `${(v/1e6).toFixed(1)}M`
  if (v >= 1_000) return `${(v/1e3).toFixed(0)}K`
  return v.toLocaleString()
}

function Count({ value, format }: { value: number; format: string }) {
  const c = useMotionValue(0)
  const d = useTransform(c, v => fmt(v, format))
  useEffect(() => { const x = animate(c, value, { duration: 1.6, ease: "easeOut" }); return x.stop }, [value])
  return <motion.span>{d}</motion.span>
}

export function KPICard({ label, yearValue, totalValue, unit, growth, accentColor, dimColor, selectedYear, delay = 0, format = "number", description }: KPICardProps) {
  const pos = growth === undefined || growth >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: "var(--ink-2)",
        border: "1px solid var(--border)",
        borderTop: `3px solid ${accentColor}`,
        padding: "18px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <div style={{
        fontFamily: "var(--font-data)",
        fontSize: 9,
        color: "var(--text-3)",
        letterSpacing: "1.8px",
        textTransform: "uppercase",
        marginBottom: 14,
      }}>
        {label}
      </div>

      {/* Main value */}
      <div style={{ marginBottom: 4 }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: 38,
          fontWeight: 700,
          color: "var(--text-1)",
          lineHeight: 1,
          letterSpacing: "-0.5px",
        }}>
          <Count value={yearValue} format={format} />
        </span>
        {unit && (
          <span style={{
            fontFamily: "var(--font-data)",
            fontSize: 11,
            color: "var(--text-3)",
            marginLeft: 6,
          }}>
            {unit}
          </span>
        )}
      </div>

      {/* Year tag + growth in same row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{
          fontFamily: "var(--font-data)",
          fontSize: 9,
          color: accentColor,
          background: dimColor,
          border: `1px solid ${accentColor}40`,
          padding: "2px 6px",
          borderRadius: 2,
          letterSpacing: "1px",
        }}>
          {selectedYear}
        </span>
        {growth !== undefined && (
          <span style={{
            fontFamily: "var(--font-data)",
            fontSize: 11,
            fontWeight: 600,
            color: pos ? "var(--green)" : "var(--red)",
          }}>
            {pos ? "+" : ""}{growth.toFixed(1)}% YoY
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", marginBottom: 12 }} />

      {/* All-time total */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 8, color: "var(--text-3)", letterSpacing: "1.5px", marginBottom: 3 }}>
            ALL-TIME TOTAL
          </div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>
            <Count value={totalValue} format={format} />
            {unit && <span style={{ fontSize: 10, color: "var(--text-3)", marginLeft: 4 }}>{unit}</span>}
          </div>
        </div>
        <div style={{
          fontFamily: "var(--font-body)",
          fontSize: 10,
          color: "var(--text-3)",
          textAlign: "right",
          maxWidth: 100,
          lineHeight: 1.3,
        }}>
          {description}
        </div>
      </div>
    </motion.div>
  )
}
