import { useState } from "react"
import { Sidebar } from "./components/layout/Sidebar"
import { Topbar } from "./components/layout/Topbar"
import { KPICard } from "./components/ui/KPICard"
import { Skeleton } from "./components/ui/Skeleton"
import { SalesTrendChart } from "./components/charts/SalesTrendChart"
import { RegionRankingChart } from "./components/charts/RegionRankingChart"
import { PowertrainShareChart } from "./components/charts/PowertrainShareChart"
import { BarRaceChart } from "./components/charts/BarRaceChart"
import { WorldMap } from "./components/charts/WorldMap"
import { useEVData, useKPIData, useSalesTrend, useRegionRanking } from "./hooks/useEVData"
import { useFilterStore } from "./store/filterStore"

const SECTION_TITLES: Record<string, string> = {
  overview:  "Overview",
  markets:   "Markets",
  geography: "Geography",
  trends:    "Trends",
}

export default function App() {
  const [section, setSection] = useState("overview")
  const { data, loading, error } = useEVData()
  const { regions, selectedYears } = useFilterStore()
  const lastYear = selectedYears.length > 0 ? Math.max(...selectedYears) : 2023
  const kpi = useKPIData(data, selectedYears)
  const salesTrend = useSalesTrend(data, regions, selectedYears)
  const regionRanking = useRegionRanking(data, selectedYears)

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--red)", fontFamily: "var(--font-data)", fontSize: 13 }}>
      ⚠ Failed to load dataset
    </div>
  )

  const kpiCards = loading ? (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, marginBottom: 1 }}>
      {Array.from({length:4}).map((_,i) => <Skeleton key={i} height={180} />)}
    </div>
  ) : (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, marginBottom: 1 }}>
      <KPICard label="EV Sales" yearValue={kpi.yearSales} totalValue={kpi.totalSales}
        unit="vehicles" growth={kpi.salesGrowth} accentColor="var(--amber)" dimColor="var(--amber-dim)"
        selectedYear={lastYear} delay={0.05} description="Battery & plug-in hybrid cars" />
      <KPICard label="EV Fleet" yearValue={kpi.yearStock} totalValue={kpi.totalStock}
        unit="on road" growth={kpi.stockGrowth} accentColor="var(--green)" dimColor="var(--green-dim)"
        selectedYear={lastYear} delay={0.1} description="Cumulative stock worldwide" />
      <KPICard label="Charging Points" yearValue={kpi.yearCharging} totalValue={kpi.totalCharging}
        unit="public" accentColor="var(--blue)" dimColor="var(--blue-dim)"
        selectedYear={lastYear} delay={0.15} description="Publicly accessible chargers" />
      <KPICard label="Oil Displaced" yearValue={kpi.yearOil} totalValue={kpi.totalOil}
        unit="Mbd" accentColor="#bc8cff" dimColor="rgba(188,140,255,0.12)"
        selectedYear={lastYear} delay={0.2} format="decimal" description="Million barrels per day saved" />
    </div>
  )

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--ink)" }}>
      <Sidebar activeSection={section} onNavigate={setSection} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title={SECTION_TITLES[section]} />

        <main style={{ flex: 1, padding: "1px", display: "flex", flexDirection: "column", gap: 1 }}>

          {/* KPIs sempre visíveis */}
          {kpiCards}

          {/* Overview */}
          {section === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 1 }}>
              {loading ? <><Skeleton height={400} /><Skeleton height={400} /></> : (
                <><BarRaceChart data={data} /><PowertrainShareChart data={data} year={lastYear} /></>
              )}
            </div>
          )}

          {/* Markets */}
          {section === "markets" && (
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 1 }}>
              {loading ? <><Skeleton height={400} /><Skeleton height={400} /></> : (
                <><SalesTrendChart data={salesTrend} regions={regions} /><RegionRankingChart data={regionRanking} year={lastYear} /></>
              )}
            </div>
          )}

          {/* Geography */}
          {section === "geography" && (
            <div style={{ gap: 1 }}>
              {loading ? <Skeleton height={500} /> : <WorldMap data={data} year={lastYear} />}
            </div>
          )}

          {/* Trends */}
          {section === "trends" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              {loading ? <><Skeleton height={400} /><Skeleton height={400} /></> : (
                <><SalesTrendChart data={salesTrend} regions={regions} /><BarRaceChart data={data} /></>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
