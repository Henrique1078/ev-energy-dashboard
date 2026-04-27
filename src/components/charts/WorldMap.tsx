import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { motion, AnimatePresence } from "framer-motion"
import type { EVDataRow } from "../../types"

interface Props {
  data: EVDataRow[]
  year: number
}

interface TooltipData {
  x: number
  y: number
  country: string
  value: number
  rank: number
}

const NAME_MAP: Record<string, string> = {
  // GeoJSON name → Dataset name
  "USA": "USA",
  "England": "United Kingdom",
  "South Korea": "Korea",
  "Turkey": "Turkiye",
  "Czech Republic": "Czech Republic",
  "Germany": "Germany",
  "France": "France",
  "Norway": "Norway",
  "Netherlands": "Netherlands",
  "Sweden": "Sweden",
  "Belgium": "Belgium",
  "Austria": "Austria",
  "Denmark": "Denmark",
  "Finland": "Finland",
  "Switzerland": "Switzerland",
  "Spain": "Spain",
  "Italy": "Italy",
  "Poland": "Poland",
  "Portugal": "Portugal",
  "Ireland": "Ireland",
  "India": "India",
  "Japan": "Japan",
  "Canada": "Canada",
  "Australia": "Australia",
  "New Zealand": "New Zealand",
  "Brazil": "Brazil",
  "Chile": "Chile",
  "Colombia": "Colombia",
  "Thailand": "Thailand",
  "Indonesia": "Indonesia",
  "Israel": "Israel",
  "Mexico": "Mexico",
  "Iceland": "Iceland",
  "Greece": "Greece",
  "Hungary": "Hungary",
  "Romania": "Romania",
  "Slovakia": "Slovakia",
  "Slovenia": "Slovenia",
  "Croatia": "Croatia",
  "Bulgaria": "Bulgaria",
  "Estonia": "Estonia",
  "Latvia": "Latvia",
  "Lithuania": "Lithuania",
  "Luxembourg": "Luxembourg",
  "Cyprus": "Cyprus",
  "Costa Rica": "Costa Rica",
  "Morocco": "Morocco",
  "South Africa": "South Africa",
  "China": "China",
  "Russia": "Russia",
}

export function WorldMap({ data, year }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [geoData, setGeoData] = useState<any>(null)

  useEffect(() => {
    fetch("/data/world.geojson")
      .then(r => r.json())
      .then(setGeoData)
  }, [])

  useEffect(() => {
    if (!geoData || !svgRef.current) return

    const excluded = ["World", "Europe", "EU27", "Rest of the world", "Other Europe"]
    const salesByCountry: Record<string, number> = {}

    data
      .filter(d =>
        d.parameter === "EV sales" &&
        d.mode === "Cars" &&
        d.year === year &&
        !excluded.includes(d.region)
      )
      .forEach(d => {
        salesByCountry[d.region] = (salesByCountry[d.region] || 0) + d.value
      })

    const values = Object.values(salesByCountry).filter(v => v > 0)
    const maxVal = Math.max(...values)

    const colorScale = d3.scaleSequential()
      .domain([0, maxVal])
      .interpolator(d3.interpolate("#0a1628", "#00d4ff"))

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = svgRef.current.clientWidth || 800
    const height = 400

    const projection = d3.geoNaturalEarth1()
      .scale(width / 6.5)
      .translate([width / 2, height / 2])

    const path = d3.geoPath().projection(projection)

    // Ranked list for tooltip
    const ranked = Object.entries(salesByCountry)
      .sort(([, a], [, b]) => b - a)
    const rankMap: Record<string, number> = {}
    ranked.forEach(([country], i) => { rankMap[country] = i + 1 })

    svg
      .selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const name = d.properties.name
        const mapped = NAME_MAP[name] || name
        const val = salesByCountry[mapped]
        return val ? colorScale(val) : "#0d1e35"
      })
      .attr("stroke", "#1a3050")
      .attr("stroke-width", 0.5)
      .style("cursor", (d: any) => {
        const name = d.properties.name
        const mapped = NAME_MAP[name] || name
        return salesByCountry[mapped] ? "pointer" : "default"
      })
      .on("mousemove", function(event: MouseEvent, d: any) {
        const name = d.properties.name
        const mapped = NAME_MAP[name] || name
        const val = salesByCountry[mapped]
        if (!val) { setTooltip(null); return }

        const rect = svgRef.current!.getBoundingClientRect()
        setTooltip({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          country: mapped,
          value: val,
          rank: rankMap[mapped] || 0,
        })

        d3.select(this)
          .attr("stroke", "#00d4ff")
          .attr("stroke-width", 1.5)
      })
      .on("mouseleave", function() {
        setTooltip(null)
        d3.select(this)
          .attr("stroke", "#1a3050")
          .attr("stroke-width", 0.5)
      })

    // Graticule
    const graticule = d3.geoGraticule()()
    svg.append("path")
      .datum(graticule)
      .attr("d", path as any)
      .attr("fill", "none")
      .attr("stroke", "rgba(0,212,255,0.04)")
      .attr("stroke-width", 0.5)

  }, [geoData, data, year])

  const fmt = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}K`

  return (
    <div style={{
      background: "rgba(10,22,40,0.8)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(0,212,255,0.12)",
      borderRadius: 16,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-data)", fontSize: 10, color: "var(--color-text-muted)", letterSpacing: "2px", marginBottom: 4 }}>
          GEOGRAPHIC DISTRIBUTION
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "1px", margin: 0 }}>
          GLOBAL EV ADOPTION MAP
        </h3>
        <p style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
          EV car sales by country · {year} · Hover for details
        </p>
      </div>

      {/* Map */}
      <div style={{ position: "relative" }}>
        <svg
          ref={svgRef}
          width="100%"
          height={400}
          style={{ display: "block" }}
        />

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.1 }}
              style={{
                position: "absolute",
                left: tooltip.x + 12,
                top: tooltip.y - 60,
                background: "rgba(6,13,31,0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(0,212,255,0.3)",
                borderRadius: 8,
                padding: "10px 14px",
                pointerEvents: "none",
                zIndex: 10,
                minWidth: 140,
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--color-text-primary)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.5px" }}>
                {tooltip.country}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "1px", marginBottom: 2 }}>SALES</div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: 14, color: "var(--color-electric)", fontWeight: 600 }}>{fmt(tooltip.value)}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)", letterSpacing: "1px", marginBottom: 2 }}>RANK</div>
                  <div style={{ fontFamily: "var(--font-data)", fontSize: 14, color: "var(--color-acid)", fontWeight: 600 }}>#{tooltip.rank}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)" }}>LOW</span>
        <div style={{
          flex: 1, height: 4, borderRadius: 2,
          background: "linear-gradient(90deg, #0d1e35, #00d4ff)",
          maxWidth: 200,
        }} />
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)" }}>HIGH</span>
        <span style={{ fontFamily: "var(--font-data)", fontSize: 9, color: "var(--color-text-muted)", marginLeft: 8 }}>
          No data
        </span>
        <div style={{ width: 12, height: 4, borderRadius: 2, background: "#0d1e35", border: "1px solid #1a3050" }} />
      </div>
    </div>
  )
}
