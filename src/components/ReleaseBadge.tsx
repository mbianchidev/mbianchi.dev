'use client'

import { useEffect, useState } from 'react'

interface ReleaseBadgeProps {
  className: string
  initialVersion: string
}

function getCurrentVersion() {
  const now = new Date()
  return `${now.getFullYear()}.${now.getMonth() + 1}`
}

export function ReleaseBadge({ className, initialVersion }: ReleaseBadgeProps) {
  const [version, setVersion] = useState(initialVersion)

  useEffect(() => {
    const refreshVersion = () => setVersion(getCurrentVersion())

    refreshVersion()
    const intervalId = window.setInterval(refreshVersion, 60 * 60 * 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <p className={className} data-release-badge>
      <span aria-hidden="true" />
      v{version} is accepting deployments
    </p>
  )
}
