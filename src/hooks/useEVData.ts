import { useState, useEffect } from "react"
import { loadEVData } from "../utils/parseCSV"
import type { EVDataRow, ChartDataPoint, RegionData } from "../types"

export interface KPIData {
  yearSales: number
  totalSales: number
  yearStock: number
  totalStock: number
  yearCharging: number
  totalCharging: number
  yearOil: number
  totalOil: number
  salesGrowth: number
  stockGrowth: number
}

export function useEVData() {
  const [data, setData] = useState<EVDataRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEVData()
      .then(setData)
      .catch(() => setError("Failed to load dataset"))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

export function useKPIData(data: EVDataRow[], years: number[]): KPIData {
  const lastYear = Math.max(...years)
  const prevYear = lastYear - 1

  const sum = (parameter: string, mode: string, year?: number, region = "World") =>
    data
      .filter(d =>
        d.parameter === parameter &&
        d.mode === mode &&
        d.region === region &&
        (year === undefined || d.year === year)
      )
      .reduce((s, d) => s + d.value, 0)

  const sumOil = (year?: number) =>
    data
      .filter(d =>
        d.parameter === "Oil displacement Mbd" &&
        d.region === "World" &&
        (year === undefined || d.year === year)
      )
      .reduce((s, d) => s + d.value, 0)

  const yearSales = sum("EV sales", "Cars", lastYear)
  const prevSales = sum("EV sales", "Cars", prevYear)
  const yearStock = sum("EV stock", "Cars", lastYear)
  const prevStock = sum("EV stock", "Cars", prevYear)

  return {
    yearSales,
    totalSales: sum("EV sales", "Cars"),
    yearStock,
    totalStock: sum("EV stock", "Cars"),
    yearCharging: sum("EV charging points", "EV", lastYear),
    totalCharging: sum("EV charging points", "EV"),
    yearOil: sumOil(lastYear),
    totalOil: sumOil(),
    salesGrowth: prevSales > 0 ? ((yearSales - prevSales) / prevSales) * 100 : 0,
    stockGrowth: prevStock > 0 ? ((yearStock - prevStock) / prevStock) * 100 : 0,
  }
}

export function useSalesTrend(data: EVDataRow[], regions: string[], years: number[], mode = "Cars"): ChartDataPoint[] {
  return data
    .filter(d =>
      d.parameter === "EV sales" &&
      d.mode === mode &&
      d.powertrain === "BEV" &&
      d.category === "Historical" &&
      regions.includes(d.region) &&
      years.includes(d.year)
    )
    .map(d => ({ year: d.year, value: d.value, region: d.region }))
    .sort((a, b) => a.year - b.year)
}

export function useRegionRanking(data: EVDataRow[], years: number[], parameter = "EV sales"): RegionData[] {
  const excluded = ["World", "Europe", "EU27", "Rest of the world", "Other Europe"]
  const lastYear = Math.max(...years)

  return data
    .filter(d =>
      d.parameter === parameter &&
      d.mode === "Cars" &&
      d.year === lastYear &&
      !excluded.includes(d.region)
    )
    .reduce<RegionData[]>((acc, d) => {
      const ex = acc.find(r => r.region === d.region)
      if (ex) ex.value += d.value
      else acc.push({ region: d.region, value: d.value })
      return acc
    }, [])
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
}
