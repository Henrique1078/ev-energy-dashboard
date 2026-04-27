import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { EVDataRow } from "../../types"

interface Props {
  data: EVDataRow[]
}

const COLORS: Record<string, string> = {
  China: "#00d4ff",
  USA: "#39ff8f",
  Germany: "#ff9500",
  France: "#a855f7",
  "United Kingdom": "#ff3d5a",
  Norway: "#ffd700",
  Netherlands: "#00ff9d",
  Sweden: "#ff6b9d",
  Japan: "#c0ff00",
  India: "#ff8c42",
  Korea: "#7dd3fc",
  Canada: "#fb923c",
  Italy: "#4ade80",
  Spain: "#f472b6",
  Belgium: "#38bdf8",
}

function getColor(region: string): string {
  return COLORS[region] || "#7eb8d4"
}

export function BarRaceChart({ data }: Props) {
  const excluded = ["World", "Europe", "EU27", "Rest of the world", "Other Europe", "EV"]
  const years = Array.from(new Set(
    data.filter(d => d.parameter === "EV sales" && d.mode === "Cars" && d.category === "Historical" && d.powertrain === "BEV")
      .map(d => d.year)
  )).sort()

  const [yearIndex, setYearIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentYear = years[yearIndex] ?? 2023

  const rankingData = data
    .filter(d =>
      d.parameter === "EV sales" &&
      d.mode === "Cars" &&
      d.powertrain === "BEV" &&
      d.year === currentYear &&
      !excluded.includes(d.region)
    )
    .reduce<Record<string, number>>((acc, d) => {
      acc[d.region] = (acc[d.region] || 0) + d.value
      return acc
    }, {})

  const sorted = Object.entries(rankingData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)

  const maxVal = sorted[0]?.[1] ?? 1

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setYearIndex(prev => {
          if (prev >= years.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 900)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, years.length])

  return (
    <div style={{
      background: "rgba(10, 22, 40, 0.8)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(0,212,255,0.12)",
      borderRadius: 16,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)", letterSpacing: "2px", marginBottom: 4 }}>
            ANIMATED RANKING
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "1px" }}>
            EV MARKET RACE
          </h3>
          <p style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
            This animation is impossible in Power BI
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Year display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentYear}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 48,
                fontWeight: 700,
                color: "rgba(0,212,255,0.15)",
                lineHeight: 1,
                letterSpacing: "4px",
                userSelect: "none",
              }}
            >
              {currentYear}
            </motion.div>
          </AnimatePresence>
          {/* Controls */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setYearIndex(0)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(0,212,255,0.2)",
                background: "transparent",
                color: "var(--color-text-muted)",
                fontSize: 14,
                cursor: "pointer",
              }}
            >⏮</button>
            <button
              onClick={() => setIsPlaying(p => !p)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid rgba(0,212,255,0.4)",
                background: isPlaying ? "rgba(0,212,255,0.15)" : "transparent",
                color: "var(--color-electric)",
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "var(--font-data)",
                letterSpacing: "1px",
              }}
            >
              {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </button>
          </div>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <AnimatePresence>
          {sorted.map(([region, value], index) => {
            const pct = (value / maxVal) * 100
            const color = getColor(region)
            return (
              <motion.div
                key={region}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  color: color,
                  width: 120,
                  textAlign: "right",
                  flexShrink: 0,
                  letterSpacing: "0.5px",
                }}>
                  {region}
                </div>
                <div style={{ flex: 1, height: 28, background: "rgba(255,255,255,0.03)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{
                      height: "100%",
                      background: `linear-gradient(90deg, ${color}cc, ${color}66)`,
                      borderRadius: 6,
                      boxShadow: `0 0 12px ${color}40`,
                      position: "relative",
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      right: 0, top: 0, bottom: 0,
                      width: 2,
                      background: color,
                      boxShadow: `0 0 8px ${color}`,
                    }} />
                  </motion.div>
                </div>
                <div style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 11,
                  color,
                  width: 70,
                  flexShrink: 0,
                  letterSpacing: "0.5px",
                }}>
                  {value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`}
                </div>
                <div style={{
                  fontFamily: "var(--font-data)",
                  fontSize: 10,
                  color: "var(--color-text-muted)",
                  width: 20,
                  textAlign: "center",
                  flexShrink: 0,
                }}>
                  #{index + 1}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Year scrubber */}
      <div style={{ marginTop: 20, display: "flex", gap: 4, alignItems: "center" }}>
        {years.map((y, i) => (
          <button
            key={y}
            onClick={() => { setYearIndex(i); setIsPlaying(false) }}
            style={{
              flex: 1,
              height: i === yearIndex ? 6 : 3,
              borderRadius: 3,
              border: "none",
              background: i === yearIndex
                ? "var(--color-electric)"
                : i < yearIndex
                ? "rgba(0,212,255,0.3)"
                : "rgba(255,255,255,0.06)",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: i === yearIndex ? "0 0 8px var(--color-electric)" : "none",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)" }}>{years[0]}</span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)" }}>{years[years.length - 1]}</span>
      </div>
    </div>
  )
}
