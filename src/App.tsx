import { Header } from "./components/layout/Header"
import { FilterBar } from "./components/filters/FilterBar"
import { KPICard } from "./components/ui/KPICard"
import { Skeleton } from "./components/ui/Skeleton"
import { SalesTrendChart } from "./components/charts/SalesTrendChart"
import { RegionRankingChart } from "./components/charts/RegionRankingChart"
import { PowertrainShareChart } from "./components/charts/PowertrainShareChart"
import { BarRaceChart } from "./components/charts/BarRaceChart"
import { WorldMap } from "./components/charts/WorldMap"
import { useEVData, useKPIData, useSalesTrend, useRegionRanking } from "./hooks/useEVData"
import { useFilterStore } from "./store/filterStore"

const g = (cols: string): React.CSSProperties => ({
  display: "grid", gridTemplateColumns: cols, gap: 16,
})

export default function App() {
  const { data, loading, error } = useEVData()
  const { regions, selectedYears } = useFilterStore()
  const lastYear = selectedYears.length > 0 ? Math.max(...selectedYears) : 2023
  const kpi = useKPIData(data, selectedYears)
  const salesTrend = useSalesTrend(data, regions, selectedYears)
  const regionRanking = useRegionRanking(data, selectedYears)

  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--color-danger)", fontFamily: "var(--font-data)" }}>
      ⚠ {error}
    </div>
  )

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <FilterBar />
      <main style={{ padding: "24px 32px", maxWidth: 1600, margin: "0 auto" }}>

        {/* KPIs */}
        <div style={{ ...g("repeat(4, 1fr)"), marginBottom: 20 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={160} />)
            : (<>
              <KPICard
                label="Global EV Sales" icon="🚗" glowColor="#00d4ff"
                yearValue={kpi.yearSales} totalValue={kpi.totalSales}
                unit="vehicles" growth={kpi.salesGrowth}
                selectedYear={lastYear} delay={0.1}
              />
              <KPICard
                label="EV Fleet on Road" icon="🌍" glowColor="#39ff8f"
                yearValue={kpi.yearStock} totalValue={kpi.totalStock}
                unit="total" growth={kpi.stockGrowth}
                selectedYear={lastYear} delay={0.2}
              />
              <KPICard
                label="Charging Points" icon="⚡" glowColor="#ff9500"
                yearValue={kpi.yearCharging} totalValue={kpi.totalCharging}
                unit="public" selectedYear={lastYear} delay={0.3}
              />
              <KPICard
                label="Oil Displaced" icon="🛢️" glowColor="#a855f7"
                yearValue={kpi.yearOil} totalValue={kpi.totalOil}
                unit="Mbd" selectedYear={lastYear} delay={0.4} format="decimal"
              />
            </>)
          }
        </div>

        {/* Row 2 — Bar Race + Powertrain */}
        <div style={{ ...g("3fr 2fr"), marginBottom: 20 }}>
          {loading
            ? <><Skeleton height={420} /><Skeleton height={420} /></>
            : <><BarRaceChart data={data} /><PowertrainShareChart data={data} year={lastYear} /></>
          }
        </div>

        {/* Row 2.5 — World Map */}
        <div style={{ marginBottom: 20 }}>
          {loading
            ? <Skeleton height={480} />
            : <WorldMap data={data} year={lastYear} />
          }
        </div>

        {/* Row 3 — Trend + Ranking */}
        <div style={{ ...g("3fr 2fr"), marginBottom: 20 }}>
          {loading
            ? <><Skeleton height={360} /><Skeleton height={360} /></>
            : <><SalesTrendChart data={salesTrend} regions={regions} /><RegionRankingChart data={regionRanking} year={lastYear} /></>
          }
        </div>

      </main>
    </div>
  )
}
