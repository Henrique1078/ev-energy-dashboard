import { useRef } from "react"
import { motion } from "framer-motion"
import { useFilterStore } from "../../store/filterStore"

const REGIONS = ["China", "USA", "Germany", "France", "United Kingdom", "Norway", "Netherlands", "Sweden", "Japan", "India"]
const YEARS = Array.from({ length: 13 }, (_, i) => 2011 + i)

export function FilterBar() {
  const { regions, selectedYears, setRegions, setSelectedYears, resetFilters } = useFilterStore()
  const lastClickedYear = useRef<number | null>(null)
  const toggleRegion = (region: string) => {
    if (regions.includes(region)) {
      if (regions.length === 1) return
      setRegions(regions.filter(r => r !== region))
    } else {
      if (regions.length >= 5) return
      setRegions([...regions, region])
    }
  }

  const handleYearClick = (year: number, e: React.MouseEvent) => {
    if (e.shiftKey && lastClickedYear.current !== null) {
      const from = Math.min(lastClickedYear.current, year)
      const to = Math.max(lastClickedYear.current, year)
      const range = YEARS.filter(y => y >= from && y <= to)
      setSelectedYears(Array.from(new Set([...selectedYears, ...range])))
      return
    }
    if (e.ctrlKey || e.metaKey) {
      if (selectedYears.includes(year)) {
        if (selectedYears.length === 1) return
        setSelectedYears(selectedYears.filter(y => y !== year))
      } else {
        setSelectedYears([...selectedYears, year])
      }
      lastClickedYear.current = year
      return
    }
    setSelectedYears([year])
    lastClickedYear.current = year
  }

  const chip = (active: boolean, accent: string): React.CSSProperties => ({
    padding: "4px 10px",
    borderRadius: 20,
    border: `1px solid ${active ? accent : "var(--color-border)"}`,
    background: active ? `${accent}20` : "transparent",
    color: active ? accent : "var(--color-text-muted)",
    fontSize: 11,
    fontFamily: "var(--font-data)",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    transition: "all 0.15s",
    userSelect: "none" as const,
    letterSpacing: "0.5px",
  })

  return (
    <div
      style={{
        position: "sticky",
        top: 64,
        zIndex: 90,
        background: "rgba(6,13,31,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,212,255,0.1)",
        padding: "10px 32px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      {/* Regions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "2px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Regions
        </span>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {REGIONS.map(r => (
            <button key={r} onClick={() => toggleRegion(r)} style={chip(regions.includes(r), "var(--color-electric)")}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: "var(--color-border)", flexShrink: 0 }} />

      {/* Years */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "2px", textTransform: "uppercase" }}>
            Year
          </div>
          <div style={{ fontFamily: "var(--font-data)", fontSize: 8, color: "var(--color-text-muted)", opacity: 0.5 }}>
            Ctrl · Shift
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {YEARS.map(y => (
            <button
              key={y}
              onClick={e => handleYearClick(y, e)}
              title={`Click: only ${y} · Ctrl+Click: toggle · Shift+Click: range`}
              style={chip(selectedYears.includes(y), "var(--color-electric)")}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        style={{
          marginLeft: "auto",
          padding: "4px 14px",
          borderRadius: 6,
          border: "1px solid var(--color-border)",
          background: "transparent",
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-data)",
          fontSize: 10,
          cursor: "pointer",
          letterSpacing: "1px",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        ↺ RESET
      </button>
    </div>
  )
}
