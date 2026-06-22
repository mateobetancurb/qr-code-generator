# Language Switch Continuity Design

## Problem

Switching between English (`/`) and Spanish (`/es/`) currently performs a full document navigation. The reload creates a visible background or content flash, resets the scroll position, and discards the user's QR generator configuration.

## Goals

- Switch languages without a blank-page or theme flash.
- Preserve the current scroll position.
- Preserve the QR text, size, module pattern, foreground color, background color, and customization-panel state.
- Keep localized URLs, metadata, and server-rendered content.
- Keep both language pages usable when JavaScript is disabled.

## Non-goals

- Persist generator data after the tab or browser session ends.
- Replace the existing English and Spanish route structure.
- Introduce a client-side localization framework.
- Animate the language change.

## Approach

Use Astro's `ClientRouter` for same-origin language navigation and disable page-transition animation for this document. The router swaps the server-rendered localized document without exposing an unstyled blank page. Normal anchor URLs remain intact, so direct visits, crawlers, and browsers without JavaScript continue to use `/` and `/es/` normally.

Store only the transient generator UI state in `sessionStorage`. The generator controller writes a versioned state object after each relevant input change. On initial load and after an Astro client navigation, it validates and restores that object, then renders the QR preview from the restored values. Invalid, incomplete, or unavailable storage falls back to the markup defaults without breaking initialization.

Capture the exact horizontal and vertical scroll coordinates when a language link is activated. Restore them after the destination document has swapped and its controls have been restored. Scroll restoration applies only to language-switch navigation; ordinary links retain Astro's default navigation behavior.

## Component Responsibilities

### Base layout

- Install Astro's client router once for both localized pages.
- Disable transition animation to prevent cross-fading translated layouts of different heights.
- Preserve the existing early theme script so the correct color scheme is applied before paint.

### Language switcher

- Keep real localized `href` values and current-language semantics.
- Identify language links for scoped state and scroll handling.
- Capture scroll immediately before navigation without preventing the router's standard link behavior.

### QR generator state

- Define a narrow, versioned, JSON-serializable state shape.
- Accept only known size and module-style values and valid six-digit hexadecimal colors.
- Restore all controls and selected-state attributes before requesting a render.
- Persist the mobile customization disclosure state. Desktop layout continues to follow its media-query behavior.
- Avoid storing generated canvas or download data; derive them again from the restored inputs.

### Controller lifecycle

- Initialize theme and QR controllers on the initial document and on Astro's `astro:page-load` event.
- Ensure initialization is idempotent so controls never receive duplicate event listeners.
- Perform state restoration before the destination is presented as ready.

## Failure Handling

Storage access and JSON parsing are best-effort. If storage is unavailable, corrupt, or from an unsupported version, the generator uses defaults and language switching still completes. QR rendering errors continue through the existing localized error UI. Missing scroll data results in the router's default position rather than a failed navigation.

## Testing

Unit tests will cover state validation, serialization, restoration of controls, re-rendering, invalid stored data, and repeated controller initialization. Existing theme, generator, localization, and no-JavaScript tests must remain green.

A Playwright test will configure a non-default QR, scroll away from the top, switch languages, and assert:

- the localized URL, document language, and translated heading changed;
- text, size, module pattern, and both colors remained unchanged;
- the generated QR preview remains visible and decodable behavior is unaffected;
- the scroll coordinates remain within a small rendering tolerance;
- switching back preserves the same state.

The complete `pnpm check` pipeline is the acceptance gate.
