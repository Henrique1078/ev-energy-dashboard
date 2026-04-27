import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface KPICardProps {
  label: string
  yearValue: number
  totalValue: number
  unit?: string
  growth?: number
  icon: string
  glowColor: string
  delay?: number
  format?: "number" | "percent" | "decimal"
  subtitle?: string
  selectedYear: number
}

function fmt(value: number, format: string): string {
  if (format === "percent") return `${value.toFixed(1)}%`
  if (format === "decimal") return value.toFixed(2)
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toLocaleString()
}

function AnimatedNumber({ value, format }: { value: number; format: string }) {
  const count = useMotionValue(0)
  const display = useTransform(count, v => fmt(v, format))
  useEffect(() => {
    const c = animate(count, value, { duration: 1.8, ease: "easeOut" })
    return c.stop
  }, [value])
  return <motion.span>{display}</motion.span>
}

export function KPICard({
  label, yearValue, totalValue, unit, growth, icon,
  glowColor, delay = 0, format = "number", subtitle, selectedYear
}: KPICardProps) {
  const isPositive = growth !== undefined && growth >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      style={{
        background: "rgba(10,22,40,0.8)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${glowColor}25`,
        borderRadius: 16,
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        minWidth: 0,
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `linear-gradient(225deg, ${glowColor}20, transparent)`,
        borderBottomLeftRadius: 80,
      }} />

      {/* Bottom glow orb */}
      <div style={{
        position: "absolute", bottom: -40, left: -20,
        width: 100, height: 100, borderRadius: "50%",
        background: glowColor, opacity: 0.04, filter: "blur(25px)",
      }} />

      {/* Label + icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{
          fontFamily: "var(--font-data)", fontSize: 9,
          color: "var(--color-text-muted)", letterSpacing: "2px", textTransform: "uppercase",
        }}>
          {label}
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${glowColor}15`, border: `1px solid ${glowColor}30`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>
          {icon}
        </div>
      </div>

      {/* Main value — selected year */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700,
          color: glowColor, lineHeight: 1,
          textShadow: `0 0 25px ${glowColor}50`, letterSpacing: "-0.5px",
        }}>
          <AnimatedNumber value={yearValue} format={format} />
        </span>
        {unit && (
          <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)" }}>
            {unit}
          </span>
        )}
      </div>

      {/* Year badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "1px 7px", borderRadius: 4, marginBottom: 8,
        background: `${glowColor}12`, border: `1px solid ${glowColor}25`,
      }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: glowColor, letterSpacing: "1px" }}>
          {selectedYear}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />

      {/* Total — smaller */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 8, color: "var(--color-text-muted)", letterSpacing: "1.5px", marginBottom: 2 }}>
            ALL-TIME TOTAL
          </div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 500 }}>
            <AnimatedNumber value={totalValue} format={format} />
            {unit && <span style={{ fontSize: 10, color: "var(--color-text-muted)", marginLeft: 3 }}>{unit}</span>}
          </div>
        </div>

        {/* Growth badge */}
        {growth !== undefined && (
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 6,
            background: isPositive ? "rgba(57,255,143,0.08)" : "rgba(255,61,90,0.08)",
            border: `1px solid ${isPositive ? "rgba(57,255,143,0.2)" : "rgba(255,61,90,0.2)"}`,
          }}>
            <span style={{
              fontFamily: "var(--font-data)", fontSize: 11, fontWeight: 600,
              color: isPositive ? "var(--color-acid)" : "var(--color-danger)",
            }}>
              {isPositive ? "▲" : "▼"} {Math.abs(growth).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: delay + 0.3 }}
        style={{
          position: "absolute", bottom: 0, left: 0,
          height: 2, width: "100%",
          background: `linear-gradient(90deg, ${glowColor}, transparent)`,
          transformOrigin: "left",
        }}
      />
    </motion.div>
  )
}
