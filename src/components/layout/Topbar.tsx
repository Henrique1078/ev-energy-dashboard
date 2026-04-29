import { useState, useEffect } from "react"
import { useFilterStore } from "../../store/filterStore"

const REGIONS = ["China", "USA", "Germany", "France", "United Kingdom", "Norway", "Netherlands", "Sweden", "Japan", "India"]
const YEARS = Array.from({ length: 13 }, (_, i) => 2011 + i)

export function Topbar({ title }: { title: string }) {
  const { regions, selectedYears, setRegions, setSelectedYears, resetFilters } = useFilterStore()
  const [time, setTime] = useState(new Date())
  const lastRef = { current: null as number | null }

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const toggleRegion = (r: string) => {
    if (regions.includes(r)) {
      if (regions.length === 1) return
      setRegions(regions.filter(x => x !== r))
    } else {
      if (regions.length >= 5) return
      setRegions([...regions, r])
    }
  }

  const handleYear = (y: number, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (selectedYears.includes(y)) {
        if (selectedYears.length === 1) return
        setSelectedYears(selectedYears.filter(x => x !== y))
      } else {
        setSelectedYears([...selectedYears, y])
      }
      return
    }
    setSelectedYears([y])
  }

  return (
    <div style={{
      background: "var(--ink-2)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Title row */}
      <div style={{
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--text-3)" }}>
            EV Analytics
          </span>
          <span style={{ color: "var(--border-2)" }}>›</span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-1)",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            {title}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "4px 10px",
            background: "var(--green-dim)",
            border: "1px solid rgba(63,185,80,0.2)",
            borderRadius: 4,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
            <span style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--green)" }}>
              LIVE
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--text-3)" }}>
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>
      </div>

      {/* Filters row */}
      <div style={{
        padding: "8px 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}>
        {/* Regions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-3)", letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Markets
          </span>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {REGIONS.map(r => {
              const on = regions.includes(r)
              return (
                <button key={r} onClick={() => toggleRegion(r)} style={{
                  padding: "3px 9px",
                  borderRadius: 3,
                  border: `1px solid ${on ? "var(--amber)" : "var(--border)"}`,
                  background: on ? "var(--amber-dim)" : "transparent",
                  color: on ? "var(--amber)" : "var(--text-3)",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: on ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}>
                  {r}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />

        {/* Years */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--text-3)", letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Year
          </span>
          <div style={{ display: "flex", gap: 3 }}>
            {YEARS.map(y => {
              const on = selectedYears.includes(y)
              return (
                <button key={y} onClick={e => handleYear(y, e)} style={{
                  padding: "3px 7px",
                  borderRadius: 3,
                  border: `1px solid ${on ? "var(--blue)" : "var(--border)"}`,
                  background: on ? "var(--blue-dim)" : "transparent",
                  color: on ? "var(--blue)" : "var(--text-3)",
                  fontFamily: "var(--font-data)",
                  fontSize: 10,
                  fontWeight: on ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.12s",
                  userSelect: "none",
                }}>
                  {y}
                </button>
              )
            })}
          </div>
        </div>

        <button onClick={resetFilters} style={{
          marginLeft: "auto",
          padding: "3px 12px",
          borderRadius: 3,
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--text-3)",
          fontFamily: "var(--font-data)",
          fontSize: 10,
          cursor: "pointer",
          letterSpacing: "1px",
          transition: "all 0.12s",
          whiteSpace: "nowrap",
        }}>
          ↺ RESET
        </button>
      </div>
    </div>
  )
}
