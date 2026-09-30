import type { SystemSeverity } from '@/data/status'

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'UTC',
})

const minutesFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
})

export const severityLabels: Record<SystemSeverity, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  critical: 'Critical',
}

export function percentage(value: number) {
  return `${value.toFixed(3)}%`
}

export function minutes(value: number) {
  return `${minutesFormatter.format(value)} min`
}

export function duration(value: number) {
  const hours = Math.floor(value / 60)
  const remainder = value % 60
  return hours === 0
    ? minutes(value)
    : `${hours}h${remainder > 0 ? ` ${minutes(remainder)}` : ''}`
}

export function isoDate(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10)
}
