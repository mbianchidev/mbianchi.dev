# Accessibility

[Project overview](README.md) · [Development checks](docs/development.md#checks-used-by-ci)

## Target

WCAG 2.2 AA is the implementation target for this web portfolio, not a claim of
certification or a completed independent audit. The existing conventions are
defined in [AGENTS.md](AGENTS.md).

## Implementation guidance

- Use semantic structure, descriptive headings, meaningful link text, and
  labels that expose each control's name and state.
- Preserve keyboard operation, visible focus, the skip link, and the mobile
  menu's expanded state, controlled region, and Escape dismissal.
- Expose dynamic quotes, diagnostic results, and status details with appropriate
  native elements and ARIA. Essential content must exist in the initial HTML.
- Keep sufficient text and control contrast, and do not use color alone to
  communicate meaning.
- Honor reduced motion without removing information. Marquees must remain
  inspectable and manually scrollable when motion is reduced.
- Preserve zoom/reflow, touch-target usability, image alternatives, and
  horizontally scrollable long code blocks or tables. Documentation screenshots
  need descriptive alt text and must not replace instructions.

## Verification and known limits

The Playwright suite checks selected keyboard interactions, responsive layouts,
reduced-motion behavior, and no-JavaScript content. It runs in Chromium and does
not establish complete WCAG compliance or screen-reader interoperability.

For affected pages, also check keyboard-only use, focus order, zoom and narrow
layouts, contrast, screen-reader names/state announcements, and the reduced
motion setting manually. Do not treat passing browser tests as a substitute for
those checks.

## Reporting a barrier

Use the existing [repository issues](https://github.com/mbianchidev/mbianchi.dev/issues)
for a reproducible public accessibility problem. Include the page, expected
behavior, steps, browser, and any relevant assistive technology, without private
data. The existing [support policy](SUPPORT.md) still applies; this guidance does
not add a response-time commitment.

Use [SECURITY.md](SECURITY.md) instead for private vulnerability reports.
