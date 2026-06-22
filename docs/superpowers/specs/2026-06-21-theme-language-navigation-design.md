# Theme Persistence During Language Navigation

## Problem

Astro's client router replaces the root document attributes when switching between `/` and `/es/`. The incoming server-rendered document has no `dark` class, so an active dark theme is replaced by the light theme during the swap. The initial inline theme script does not protect the incoming document before it becomes visible.

## Goals

- Preserve an explicitly selected dark or light theme across language changes in either direction.
- Apply the correct theme to the incoming document before it is displayed.
- Use the operating-system preference only when the user has not stored a manual choice.
- Keep direct page loads free from a theme flash.
- Keep theme controls synchronized and idempotent after client navigation.

## Approach

Centralize theme resolution in the theme controller. A saved `darkMode` value of `"true"` or `"false"` takes precedence. When neither value exists, resolve the theme from `prefers-color-scheme`.

Register one persistent `astro:before-swap` listener. It resolves the theme and applies or removes the `dark` class on `event.newDocument.documentElement` before Astro copies the incoming root attributes into the live document. This prevents the router from replacing the active theme with the server-rendered default.

The existing head script remains responsible for direct page loads because it runs before the first paint. It will follow the same saved-value and system-fallback rules. The theme controls continue to initialize on `astro:page-load`, with duplicate listeners prevented by their existing initialization marker.

## Failure Handling

If storage access is unavailable, theme resolution falls back to the operating-system preference. A malformed stored value is treated as absent rather than forcing either theme. Language navigation must continue even if no saved preference can be read.

## Testing

Unit tests will cover saved dark, saved light, system fallback, malformed storage, and applying the resolved theme to an incoming document. An end-to-end test will switch languages with dark selected and with light selected, asserting that the root class and theme control remain correct after each client navigation.

The complete `pnpm check` pipeline is the acceptance gate.
