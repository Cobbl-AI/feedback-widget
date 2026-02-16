# Widget Architecture

## Design Goals

1. **No code duplication**: All three APIs share the same core logic
2. **Industry standard patterns**: Follows patterns from Stripe Elements, Intercom, etc.
3. **Framework agnostic**: Works everywhere from static HTML to modern frameworks
4. **Proper lifecycle**: No memory leaks, proper cleanup
5. **TypeScript first**: Full type safety across all APIs

---

## File Structure

```
src/
├── FeedbackWidget.tsx      # Preact UI component (shared by all)
├── core.ts                 # Core widget class
├── vanilla.ts              # Vanilla JS API (uses core.ts)
├── react.tsx               # React wrapper (uses vanilla.ts)
├── browser.ts              # Script tag entry point (uses core.ts)
├── types.ts                # Shared TypeScript types
├── styles.ts               # Shared CSS-in-JS styles
└── icons.tsx               # Shared icon components
```

---

## Code Flow

### 1. Script Tag (`browser.ts`)

```
User loads script
  ↓
Auto-init on DOMContentLoaded
  ↓
MutationObserver watches DOM
  ↓
Find containers with id/class
  ↓
Read data attributes
  ↓
Create CobblFeedbackWidgetInstance
  ↓
Render Preact component
```

**Key features:**

- Runs after HTML parse
- MutationObserver watches for added/removed widgets
- Exposes global `window.cobblWidget` API
- Auto-cleanup on element removal

### 2. Vanilla JS (`vanilla.ts`)

```
User imports cobblWidget
  ↓
cobblWidget.create(config)
  ↓
Returns VanillaWidgetInstance
  ↓
widget.mount(container)
  ↓
Creates CobblFeedbackWidgetInstance
  ↓
Renders Preact component
  ↓
widget.destroy() for cleanup
```

**Key features:**

- Stripe Elements-style API
- Manual lifecycle control
- Can update config without remounting
- Returns cleanup function

### 3. React (`react.tsx`)

```
User renders <FeedbackWidget />
  ↓
useEffect on mount
  ↓
cobblWidget.create(config)
  ↓
widget.mount(ref.current)
  ↓
useEffect on config change
  ↓
widget.update(newConfig)
  ↓
Cleanup on unmount
  ↓
widget.destroy()
```

**Key features:**

- Uses vanilla JS API under the hood
- Proper React lifecycle
- Auto-updates on prop changes
- Auto-cleanup on unmount

---

## Core Classes

### `CobblFeedbackWidgetInstance` (core.ts)

The foundational class used by all APIs.

```typescript
class CobblFeedbackWidgetInstance {
  constructor(container: HTMLElement, config: FeedbackWidgetConfig)
  mount(): void // Render Preact component
  update(config: Partial<FeedbackWidgetConfig>): void // Re-render with new config
  destroy(): void // Unmount and cleanup
  getConfig(): FeedbackWidgetConfig // Get current config
}
```

**Responsibilities:**

- Manages Preact rendering
- Handles configuration updates
- Provides cleanup mechanism

### `VanillaWidgetInstance` (vanilla.ts)

Wrapper around core class with deferred mounting.

```typescript
class VanillaWidgetInstance implements WidgetInstance {
  constructor(config: FeedbackWidgetConfig)
  mount(container: string | HTMLElement): void
  update(config: Partial<FeedbackWidgetConfig>): void
  destroy(): void
  getConfig(): FeedbackWidgetConfig
}
```

**Responsibilities:**

- Defers mounting until `.mount()` is called
- Resolves container selectors
- Delegates to `CobblFeedbackWidgetInstance`

### `FeedbackWidget` (react.tsx)

React component wrapping vanilla API.

```typescript
const FeedbackWidget: React.FC<FeedbackWidgetProps>
```

**Responsibilities:**

- Manages widget lifecycle with React hooks
- Creates vanilla instance on mount
- Updates config on prop changes
- Cleans up on unmount

---

## Build Outputs

### Main Export (`dist/index.js`)

```typescript
export { cobblWidget, CobblFeedbackWidgetInstance }
export type { FeedbackWidgetConfig, WidgetState, WidgetInstance }
```

**Usage:**

```javascript
import { cobblWidget } from '@cobbl-ai/feedback-widget'
```

### React Export (`dist/react.js`)

```typescript
export { FeedbackWidget }
export type { FeedbackWidgetProps }
```

**Usage:**

```javascript
import { FeedbackWidget } from '@cobbl-ai/feedback-widget/react'
```

### Browser Export (`dist/cobbl-feedback-widget.global.js`)

```javascript
// IIFE bundle with auto-init
// Exposes: window.cobblWidget
```

**Usage:**

```html
<script src="https://unpkg.com/@cobbl-ai/feedback-widget"></script>
```

---

## Type Safety

### Shared Types

All APIs share the same TypeScript types:

```typescript
interface FeedbackWidgetConfig {
  runId: string
  triggerButtonText?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  onSuccess?: (feedbackId: string) => void
  onError?: (error: Error) => void
}
```

### Generated Type Definitions

- `dist/index.d.ts` - Vanilla JS types
- `dist/react.d.ts` - React component types
- Both reference the same base types

---

## MutationObserver Strategy (Script Tag)

The script tag uses MutationObserver to watch for dynamically added/removed widgets:

```typescript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // Check added nodes
    mutation.addedNodes.forEach((node) => {
      if (isWidgetContainer(node)) {
        mountWidget(node)
      }
    })

    // Check removed nodes
    mutation.removedNodes.forEach((node) => {
      if (isWidgetContainer(node)) {
        unmountWidget(node)
      }
    })
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
```

**Benefits:**

- Works with SPA frameworks
- Automatic cleanup
- No manual initialization needed
- Handles multiple widgets

---

## Comparison with Similar Libraries

### Stripe Elements

```javascript
// Stripe
const card = elements.create('card')
card.mount('#card-element')
card.destroy()

// Cobbl (very similar!)
const widget = cobblWidget.create({ ... })
widget.mount('#feedback-container')
widget.destroy()
```

### Intercom

```javascript
// Intercom (global API)
window.Intercom('boot', { ... })
window.Intercom('update', { ... })

// Cobbl (cleaner, returns instance)
const widget = cobblWidget.create({ ... })
widget.update({ ... })
```

### PostHog

```javascript
// PostHog (auto-init on import)
import posthog from 'posthog-js'

// Cobbl (similar for script tag)
import '@cobbl-ai/feedback-widget'
```

---

## Benefits of This Architecture

### 1. Zero Duplication

- ✅ Single Preact component for UI
- ✅ Single core class for logic
- ✅ React wraps vanilla (no separate implementation)
- ✅ Browser uses core (no separate auto-mount logic)

### 2. Maintainability

- 🔧 Bug fixes apply to all three APIs
- 🔧 New features work everywhere
- 🔧 Single source of truth for logic

### 3. Bundle Optimization

- 📦 Vanilla JS is tree-shakeable (~10 KB)
- 📦 React uses vanilla (no extra code)
- 📦 Script tag bundles everything (~26.5 KB)

### 4. Developer Experience

- 💡 Industry-standard patterns
- 💡 Full TypeScript support
- 💡 Works with any framework
- 💡 Proper cleanup (no memory leaks)

### 5. Testing

- ✅ Test core class once
- ✅ Test vanilla wrapper
- ✅ Test React wrapper (integration)
- ✅ Test browser auto-mount

---

## Future Enhancements

Potential additions without breaking changes:

1. **Vue component** - Wrap vanilla API like React
2. **Svelte component** - Wrap vanilla API
3. **Web Component** - Alternative to script tag
4. **Floating widget** - Auto-positioned overlay mode
5. **Custom themes** - Pre-built CSS themes
6. **Headless mode** - Just logic, no UI

All would reuse the existing core without duplication! 🎉
