'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ScheduledStatusIncident, StatusDay, StatusSystemHistory } from '@/lib/status'
import { dateFormatter, duration, percentage, severityLabels } from './statusFormatting'
import styles from '@/app/inner.module.css'

interface StatusTimelineProps {
  system: StatusSystemHistory
  today: StatusDay
  incidents: readonly ScheduledStatusIncident[]
}

export function StatusTimeline({ system, today, incidents }: StatusTimelineProps) {
  const popoverId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const hoveredDate = useRef<string | null>(null)
  const popoverHovered = useRef(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [activeDate, setActiveDate] = useState<string | null>(null)
  const days = [...system.days, today]
  const incidentDays = days.filter(({ severity }) => severity !== 'operational')
  const activeDay = days.find(({ date }) => date === activeDate)
  const dayStart = activeDay ? new Date(`${activeDay.date}T00:00:00Z`).getTime() : 0
  const related = activeDay ? incidents.filter((incident) =>
    incident.systemIds.includes(system.id)
    && incident.startedAt < dayStart + 86_400_000
    && incident.resolvedAt > dayStart
  ) : []

  const cancelClose = useCallback(() => {
    clearTimeout(closeTimer.current)
    closeTimer.current = undefined
  }, [])

  const dismiss = useCallback(() => {
    cancelClose()
    if (popoverRef.current?.matches(':popover-open')) {
      popoverRef.current.hidePopover()
    }
    setActiveDate(null)
  }, [cancelClose])

  function show(date: string | undefined) {
    cancelClose()
    if (date) {
      setActiveDate(date)
    }
  }

  function queueClose() {
    cancelClose()
    if (document.activeElement !== triggerRef.current && !popoverHovered.current) {
      closeTimer.current = setTimeout(dismiss, 150)
    }
  }

  function dateAtPointer(clientX: number, target: EventTarget | null) {
    const element = target instanceof HTMLElement
      ? target.closest<HTMLElement>('[data-uptime-day]')
      : null
    if (element && triggerRef.current?.contains(element)) {
      const date = days.find(({ date }) => date === element.dataset.uptimeDay)
      return date?.severity !== 'operational' ? date?.date : undefined
    }
    const bounds = triggerRef.current?.getBoundingClientRect()
    if (!bounds || bounds.width === 0) {
      return undefined
    }
    const index = Math.max(0, Math.min(
      days.length - 1,
      Math.floor((clientX - bounds.left) / bounds.width * days.length)
    ))
    const date = days[index]
    return date.severity === 'operational' ? undefined : date.date
  }

  const positionPopover = useCallback(() => {
    const popover = popoverRef.current
    const anchor = triggerRef.current?.querySelector<HTMLElement>('[data-active-day]')
    if (!popover?.matches(':popover-open') || !anchor) {
      return
    }
    const bounds = anchor.getBoundingClientRect()
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) {
      dismiss()
      return
    }
    const popup = popover.getBoundingClientRect()
    const gap = 12
    const left = Math.max(gap, Math.min(
      bounds.left + bounds.width / 2 - popup.width / 2,
      window.innerWidth - popup.width - gap
    ))
    const below = bounds.bottom + gap
    const top = below + popup.height <= window.innerHeight - gap
      ? below
      : Math.max(gap, bounds.top - popup.height - gap)
    popover.style.left = `${left}px`
    popover.style.top = `${top}px`
  }, [dismiss])

  useLayoutEffect(() => {
    const popover = popoverRef.current
    if (!popover || !activeDay) {
      if (popover?.matches(':popover-open')) {
        popover.hidePopover()
      }
      return
    }

    if (!popover.matches(':popover-open')) {
      popover.showPopover()
    }
    positionPopover()
  }, [activeDate, activeDay, positionPopover, system])

  useEffect(() => {
    const repositionOnScroll = (event: Event) => {
      if (!(event.target instanceof Node) || !popoverRef.current?.contains(event.target)) {
        positionPopover()
      }
    }
    window.addEventListener('resize', positionPopover)
    document.addEventListener('scroll', repositionOnScroll, true)
    return () => {
      cancelClose()
      window.removeEventListener('resize', positionPopover)
      document.removeEventListener('scroll', repositionOnScroll, true)
    }
  }, [cancelClose, positionPopover])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.uptimeTrack}
        style={{ gridTemplateColumns: `repeat(${days.length}, minmax(1px, 1fr))` }}
        data-status-timeline
        aria-label={`${system.name}: ${percentage(system.metrics.availabilityPercentage)} availability over ${system.days.length} complete days, plus today so far. Inspect incident days with the left and right arrow keys.`}
        aria-controls={popoverId}
        aria-expanded={Boolean(activeDay)}
        aria-describedby={activeDay ? popoverId : undefined}
        onPointerMove={(event) => {
          if (event.pointerType === 'touch') {
            return
          }
          const date = dateAtPointer(event.clientX, event.target)
          if (hoveredDate.current === (date ?? null)) {
            return
          }
          hoveredDate.current = date ?? null
          if (date) {
            show(date)
          } else {
            dismiss()
          }
        }}
        onPointerDown={(event) => {
          hoveredDate.current = dateAtPointer(event.clientX, event.target) ?? null
        }}
        onPointerLeave={() => {
          hoveredDate.current = null
          queueClose()
        }}
        onFocus={() => show(hoveredDate.current ?? incidentDays[0]?.date)}
        onBlur={queueClose}
        onClick={(event) => show(
          event.detail === 0
            ? activeDate ?? incidentDays[0]?.date
            : dateAtPointer(event.clientX, event.target)
        )}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            dismiss()
            return
          }
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            return
          }
          event.preventDefault()
          const current = Math.max(0, incidentDays.findIndex(({ date }) => date === activeDate))
          const index = event.key === 'Home' ? 0
            : event.key === 'End' ? incidentDays.length - 1
              : (current + (event.key === 'ArrowRight' ? 1 : -1) + incidentDays.length)
                % incidentDays.length
          show(incidentDays[index]?.date)
        }}
      >
        {days.map((date) => (
          <span
            key={date.date}
            data-uptime-day={date.date}
            data-severity={date.severity}
            data-today={date.date === today.date ? true : undefined}
            data-active-day={activeDate === date.date ? true : undefined}
            className={styles.uptimeBar}
            aria-hidden="true"
          />
        ))}
      </button>
      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        role="tooltip"
        className={styles.statusDayPopover}
        data-popover-day={activeDate ?? undefined}
        onToggle={(event) => {
          if (!event.currentTarget.matches(':popover-open')) {
            setActiveDate(null)
          }
        }}
        onPointerEnter={() => {
          popoverHovered.current = true
          cancelClose()
        }}
        onPointerLeave={() => {
          popoverHovered.current = false
          queueClose()
        }}
      >
        {activeDay && (
          <>
            <time dateTime={activeDay.date}>{dateFormatter.format(dayStart)}</time>
            {activeDay.date === today.date && (
              <p className={styles.statusTodayNote}>Today so far (UTC)</p>
            )}
            <dl className={styles.statusDayBreakdown}>
              <div>
                <dt data-severity={activeDay.severity}>{severityLabels[activeDay.severity]}</dt>
                <dd>
                  <time
                    data-day-total-duration
                    dateTime={`PT${activeDay.metrics.criticalMinutes + activeDay.metrics.degradedMinutes}M`}
                  >
                    {duration(activeDay.metrics.criticalMinutes + activeDay.metrics.degradedMinutes)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Weighted downtime</dt>
                <dd>
                  <time
                    data-day-weighted-duration
                    dateTime={`PT${activeDay.metrics.effectiveDowntimeMinutes}M`}
                  >
                    {duration(activeDay.metrics.effectiveDowntimeMinutes)}
                  </time>
                </dd>
              </div>
            </dl>
            <h4>Related incidents</h4>
            <ul>
              {related.map((incident) => (
                <li key={incident.instanceId} data-popover-incident={incident.instanceId}>
                  <strong>{incident.title}</strong>
                  <p>{incident.summary}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
