# Status simulation

[Documentation index](README.md) · [Content and configuration](content.md)

The `/status/` dashboard is fiction, not uptime telemetry. It has no monitoring
backend or connection to a real service.

## Seeded incidents

[`src/data/status.ts`](../src/data/status.ts) defines the catalogue;
[`src/lib/status.ts`](../src/lib/status.ts) generates the seeded UTC calendar.
Keep incident IDs and schedule groups stable so copy edits do not move existing
incidents.

Technical scenarios cover service mesh, cache, CDN, Kubernetes, DNS, storage,
and node failures, each with a fictional postmortem. Short human incidents have
independent schedules. Longer component incidents rotate with 47-65 day spacing
and a 90-day cooldown per incident type.

## Availability

Availability uses the preceding **90 complete UTC days**, excluding today.
Critical time counts as 100% downtime, degraded time as 50%, and overlapping
incidents count once at the worst severity. Component totals, overall
availability, and three historical 90-day periods share that calculation.
The schedule and incident budgets keep calculated availability between 97.5%
and 99.8% without clamping percentages.

Timelines add a separate bar for today containing only elapsed incidents,
including resolved ones; it never changes the completed-day percentage.

## Live browser behavior

While the page is visible, JavaScript refreshes current badges and reports
every minute and advances the historical window at midnight UTC. Only active
incidents affect current badges, critical takes priority over degraded, and
reports reveal only updates whose timestamps have occurred.

The exported HTML contains a build-time snapshot. Without JavaScript it stays
at that snapshot rather than becoming a live monitor.

## Inspecting the history

Expand history counts to inspect a period's incidents. Hover or tap a timeline
day to inspect downtime and related incidents. Each timeline is one keyboard
stop: arrow keys inspect incident days, Home/End jump to the first/last, and
Escape dismisses the preview.

[`tests/status.spec.ts`](../tests/status.spec.ts) protects the model's
invariants; [`tests/pages.spec.ts`](../tests/pages.spec.ts) covers the browser
interactions.
