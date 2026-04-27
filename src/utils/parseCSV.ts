import type { EVDataRow } from '../types'

export async function loadEVData(): Promise<EVDataRow[]> {
  const response = await fetch('/data/IEA Global EV Data 2024.csv')
  const text = await response.text()

  const lines = text.trim().split('\n')
  const headers = lines[0].split(',')

  return lines.slice(1).map(line => {
    const values = line.split(',')
    return {
      region: values[0]?.trim(),
      category: values[1]?.trim(),
      parameter: values[2]?.trim() as EVDataRow['parameter'],
      mode: values[3]?.trim() as EVDataRow['mode'],
      powertrain: values[4]?.trim(),
      year: parseInt(values[5]),
      unit: values[6]?.trim(),
      value: parseFloat(values[7]),
    }
  }).filter(row => !isNaN(row.value) && !isNaN(row.year))
}
