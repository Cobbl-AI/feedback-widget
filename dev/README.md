# Cobbl Feedback Widget - Development Server

This directory contains a unified development environment for testing the Cobbl Feedback Widget.

## Quick Start

```bash
# Start the dev server
pnpm run dev

# Dev server opens at http://localhost:3002/
```

## Unified Demo App

The development app provides a single, consistent interface with tabs for all three integration methods.

### Integration Methods

| Tab            | Method                                              | Best For                            |
| -------------- | --------------------------------------------------- | ----------------------------------- |
| **Script Tag** | Auto-mount via `<script>` tag + `data-*` attributes | Static sites, WordPress, Webflow    |
| **JavaScript** | Programmatic `cobblWidget.create()` API             | SPAs, custom mounting, dynamic apps |
| **React**      | `<FeedbackWidget />` component                      | React/Next.js applications          |

### Shared Configuration Panel

All tabs share the same controls:

- **API Endpoint** - Switch between Local, Staging, and Production
- **Run ID** - The unique identifier for the prompt run
- **Variant** - Default (trigger button) or Inline (thumbs up/down)
- **Trigger Text** - Custom text for the trigger button
- **Flyout Position** - Where the flyout appears relative to the trigger
- **Theme** - Default, Dark, or Brand color schemes

Changes update the code example and live preview instantly!

## Features

- ⚡ **Hot Module Reloading** - Changes auto-reload via Vite HMR
- 🎨 **Live Preview** - See widget changes in real-time
- 📝 **Dynamic Code Examples** - Code updates as you configure
- 🔀 **Consistent Experience** - Same options across all integration types

## Tech Stack (Dev Only)

The dev environment uses:

- **React 18** - For the demo UI
- **Tailwind CSS** - For styling
- **shadcn/ui** - Component library (Radix primitives + Tailwind)
- **Vite** - Development server with HMR

> **Note:** These are dev dependencies only. The widget itself uses Preact for a minimal footprint (~5kb gzipped).

## File Structure

```
dev/
├── app.tsx                    # Main unified demo app
├── globals.css                # Tailwind + theme styles
├── index.html                 # HTML entry point
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── badge.tsx
│   └── shared/                # Demo-specific components
│       ├── EndpointSwitcher.tsx
│       ├── WidgetControls.tsx
│       ├── WidgetPreview.tsx
│       ├── CodeExample.tsx
│       └── index.ts
└── lib/
    └── utils.ts               # cn() utility
```

## Debugging Tips

### Inspect Shadow DOM

1. Open DevTools
2. Go to Elements tab
3. Look for `#shadow-root (open)` under widget container
4. Expand to see encapsulated styles and DOM

### Test CSS Variables

```javascript
// In browser console:
const widget = document.querySelector('[data-cobbl-widget]')
widget.style.setProperty('--cobbl-primary', '#ff0000')
```

### Monitor Console

All widget events are logged:

- `✅ Feedback submitted: <id>`
- `❌ Error: <message>`

## Configuration

Dev server configured in `vite.config.ts`:

```typescript
{
  server: {
    port: 3002,
    open: true, // Auto-open browser
  },
  resolve: {
    alias: {
      '@cobbl-ai/feedback-widget': './src/index.ts',
      '@cobbl-ai/feedback-widget/react': './src/react.tsx',
    },
  },
}
```

## Building for Production

```bash
# Build widget for production
pnpm run build

# Output in dist/
```

---

**Happy developing!** 🚀
