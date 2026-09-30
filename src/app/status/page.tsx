import { buildStatusSnapshot } from '@/lib/status'
import { createPageMetadata } from '@/lib/siteMetadata'
import { StatusDashboard } from './StatusDashboard'

export const metadata = createPageMetadata({
  title: 'Status — Matteo',
  description: 'A fictional incident history and calculated availability for one human platform.',
  path: '/status/',
})

export default function StatusPage() {
  return <StatusDashboard initialSnapshot={buildStatusSnapshot(new Date())} />
}
