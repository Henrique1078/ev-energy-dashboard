export interface EVDataRow {
  region: string
  category: string
  parameter: EVParameter
  mode: VehicleMode
  powertrain: string
  year: number
  unit: string
  value: number
}

export type EVParameter =
  | 'EV sales'
  | 'EV stock'
  | 'EV sales share'
  | 'EV stock share'
  | 'EV charging points'
  | 'Electricity demand'
  | 'Oil displacement'
  | 'Oil displacement Mbd'

export type VehicleMode = 'Cars' | 'Buses' | 'Trucks' | 'Vans' | 'EV'

export interface FilterState {
  regions: string[]
  modes: VehicleMode[]
  yearRange: [number, number]
  parameter: EVParameter
}

export interface KPIData {
  totalSales: number
  totalStock: number
  chargingPoints: number
  oilDisplacement: number
  salesGrowth: number
  stockGrowth: number
}

export interface ChartDataPoint {
  year: number
  value: number
  region?: string
  mode?: string
  powertrain?: string
}

export interface RegionData {
  region: string
  value: number
  share?: number
  growth?: number
}
