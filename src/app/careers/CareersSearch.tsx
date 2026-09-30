'use client'

import { useEffect, useId, useState } from 'react'
import styles from '@/app/inner.module.css'

interface FilterOption {
  id: string
  label: string
}

interface CareersSearchProps {
  locations: readonly FilterOption[]
  departments: readonly FilterOption[]
  total: number
}

export function CareersSearch({
  locations,
  departments,
  total,
}: CareersSearchProps) {
  const searchId = useId()
  const locationId = useId()
  const departmentId = useId()
  const [query, setQuery] = useState('')
  const [activeLocation, setActiveLocation] = useState('all')
  const [activeDepartment, setActiveDepartment] = useState('all')
  const [resultCount, setResultCount] = useState(total)

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const roles = [
      ...document.querySelectorAll<HTMLElement>('[data-career-search]'),
    ]
    let visible = 0

    for (const role of roles) {
      const matchesQuery =
        normalizedQuery === ''
        || (role.dataset.careerSearch ?? '').includes(normalizedQuery)
      const matchesLocation =
        activeLocation === 'all'
        || (role.dataset.careerLocations ?? '').split(' ').includes(activeLocation)
      const matchesDepartment =
        activeDepartment === 'all'
        || role.dataset.careerDepartment === activeDepartment
      const matches = matchesQuery && matchesLocation && matchesDepartment

      role.hidden = !matches
      if (matches) {
        visible += 1
      }
    }

    setResultCount(visible)
  }, [activeDepartment, activeLocation, query])

  return (
    <div className={styles.careerSearch} role="search">
      <div className={styles.careerSearchGrid}>
        <div className={styles.careerFilterField}>
          <label htmlFor={searchId}>Search roles</label>
          <input
            id={searchId}
            type="search"
            value={query}
            placeholder="Search jobs"
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className={styles.careerFilterField}>
          <label htmlFor={locationId}>Location</label>
          <select
            id={locationId}
            value={activeLocation}
            onChange={(event) => setActiveLocation(event.target.value)}
          >
            <option value="all">All locations</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.careerFilterField}>
          <label htmlFor={departmentId}>Department</label>
          <select
            id={departmentId}
            value={activeDepartment}
            onChange={(event) => setActiveDepartment(event.target.value)}
          >
            <option value="all">All departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.careerSearchStatus}>
        <output
          className={styles.careerResultCount}
          htmlFor={`${searchId} ${locationId} ${departmentId}`}
          aria-live="polite"
        >
          {resultCount} {resultCount === 1 ? 'role' : 'roles'}
        </output>
        <p className={styles.careerNoResults} hidden={resultCount !== 0}>
          No roles match those filters.
        </p>
      </div>
    </div>
  )
}
