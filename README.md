# @cobbl-ai/feedback-widget

A lightweight, embeddable Preact widget for collecting user feedback on AI prompt responses. Part of the Cobbl platform.

**Three ways to use it:**

1. 📄 **Script tag** - Drop into any HTML page
2. 🎨 **Vanilla JS** - Stripe Elements-style API
3. ⚛️ **React component** - First-class React support

**Three display variants:**

- `trigger` - A text button that opens a feedback flyout (default)
- `thumbs` - Thumbs up/down buttons that register feedback immediately and open a flyout
- `inline` - Full feedback form rendered directly without any flyout

## Installation

### Via npm (for Vanilla JS & React)

```bash
npm install @cobbl-ai/feedback-widget
# or
pnpm add @cobbl-ai/feedback-widget
# or
yarn add @cobbl-ai/feedback-widget
```

### Via CDN (for script tag)

```html
<script src="https://unpkg.com/@cobbl-ai/feedback-widget"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/@cobbl-ai/feedback-widget"></script>
```

## Usage

### 1. Script Tag (HTML)

Perfect for static sites, WordPress, Webflow, etc. **Automatically mounts** and watches for dynamically added widgets.

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>AI Response</h1>
    <p>Your AI-generated content here...</p>

    <!-- Widget container with configuration -->
    <div id="cobbl-feedback-widget" data-run-id="prompt-run-id"></div>

    <!-- Load the widget script -->
    <script src="https://unpkg.com/@cobbl-ai/feedback-widget"></script>
  </body>
</html>
```

**Features:**

- ✅ Auto-mounts on page load
- ✅ Works with dynamic content (uses MutationObserver)
- ✅ **Live updates**: Change any data attribute and the widget updates automatically
- ✅ Uses `id="cobbl-feedback-widget"` for the container element

**Dynamic content example:**

```html
<script src="https://unpkg.com/@cobbl-ai/feedback-widget"></script>

<script>
  // Add widget after page load - it auto-mounts!
  const widget = document.createElement('div')
  widget.id = 'cobbl-feedback-widget'
  widget.setAttribute('data-run-id', 'new-run-id')
  document.body.appendChild(widget)
</script>
```

**Updating configuration dynamically:**

```javascript
// Just change the data attribute - the widget updates automatically!
const widget = document.getElementById('cobbl-feedback-widget')
widget.setAttribute('data-run-id', 'new-run-id')
widget.setAttribute('data-trigger-button-text', 'Updated Text')
// MutationObserver detects the change and updates the widget
```

---

### 2. Vanilla JS (Stripe Elements Style)

For full programmatic control. Perfect for SPAs, vanilla JS apps, or any framework.

```typescript
import { cobblWidget } from '@cobbl-ai/feedback-widget'

// Create a widget instance
const widget = cobblWidget.create({
  runId: 'prompt-run-id',
  onSuccess: (feedbackId) => {
    console.log('Feedback submitted:', feedbackId)
  },
})

// Mount to a container
widget.mount('#feedback-container')

// Update configuration
widget.update({ runId: 'new-run-id' })

// Clean up when done
widget.destroy()
```

**Full example with dynamic content:**

```typescript
import { cobblWidget } from '@cobbl-ai/feedback-widget'
import { CobblAdminClient } from '@cobbl-ai/sdk/admin'

const client = new CobblAdminClient({ apiKey: 'your-api-key' })

// Run a prompt
const result = await client.runPrompt('my-prompt', { topic: 'AI' })

// Display response
document.getElementById('response').textContent = result.output

// Create and mount feedback widget
const widget = cobblWidget.create({
  runId: result.runId,
  position: 'bottom-right',
  triggerButtonText: 'Rate this response',
})

widget.mount('#feedback-container')

// Later, when navigating away
widget.destroy()
```

**API Reference:**

```typescript
interface WidgetInstance {
  // Mount the widget to a DOM element
  mount(container: string | HTMLElement): void

  // Update the configuration (e.g., new runId)
  update(config: Partial<FeedbackWidgetConfig>): void

  // Unmount and cleanup
  destroy(): void

  // Get current config
  getConfig(): FeedbackWidgetConfig
}

const widget = cobblWidget.create(config: FeedbackWidgetConfig): WidgetInstance
```

---

### 3. React

First-class React support with proper hooks and lifecycle management.

```tsx
import { FeedbackWidget } from '@cobbl-ai/feedback-widget/react'

const App = () => {
  return (
    <div>
      <h1>AI Response</h1>
      <p>Your AI-generated content...</p>

      <FeedbackWidget
        runId="prompt-run-id"
        onSuccess={(feedbackId) => {
          console.log('Feedback submitted:', feedbackId)
        }}
      />
    </div>
  )
}
```

**Full example with Cobbl SDK:**

```tsx
import { useState, useEffect } from 'react'
import { CobblAdminClient } from '@cobbl-ai/sdk/admin'
import { FeedbackWidget } from '@cobbl-ai/feedback-widget/react'

const MyComponent = () => {
  const [response, setResponse] = useState<string>()
  const [runId, setRunId] = useState<string>()

  useEffect(() => {
    const runPrompt = async () => {
      const client = new CobblAdminClient({ apiKey: 'your-api-key' })
      const result = await client.runPrompt('my-prompt', { topic: 'AI' })
      setResponse(result.output)
      setRunId(result.runId)
    }
    runPrompt()
  }, [])

  return (
    <div>
      <h2>AI Response</h2>
      <p>{response}</p>

      {runId && (
        <FeedbackWidget
          runId={runId}
          triggerButtonText="Rate this response"
          position="bottom-right"
        />
      )}
    </div>
  )
}
```

**Props:**

```typescript
interface FeedbackWidgetProps {
  runId: string // Required - The run ID from a prompt execution
  variant?: 'trigger' | 'thumbs' | 'inline' // Optional - Display variant (default: 'trigger')
  triggerButtonText?: string // Optional - Button text (defaults to 'Feedback', only for 'trigger' variant)
  position?:
    | 'bottom-right' // Optional (default)
    | 'bottom-left'
    | 'top-right'
    | 'top-left' // Only used for 'trigger' and 'thumbs' variants
  onSuccess?: (feedbackId: string) => void // Optional
  onError?: (error: Error) => void // Optional
  className?: string // Optional
  style?: React.CSSProperties // Optional
}
```

> **Note:** Feedback submission is **public** and doesn't require API authentication. End users can submit feedback anonymously.

---

## Configuration

### Using Custom API Endpoints

By default, the widget connects to the production API at `https://api.cobbl.ai`. You can override this to test against local or staging environments:

**Script Tag:**

```html
<div
  id="cobbl-feedback-widget"
  data-run-id="your-run-id"
  data-base-url="http://127.0.0.1:5001/your-project/us-central1/externalApi"
></div>
```

**Vanilla JS:**

```typescript
const widget = cobblWidget.create({
  runId: 'your-run-id',
  baseUrl: 'http://127.0.0.1:5001/your-project/us-central1/externalApi',
})
```

**React:**

```tsx
<FeedbackWidget
  runId="your-run-id"
  baseUrl="http://127.0.0.1:5001/your-project/us-central1/externalApi"
/>
```

Common endpoints:

- **Production:** `https://api.cobbl.ai` (default)
- **Local (Firebase):** `http://127.0.0.1:5001/your-project/us-central1/externalApi`
- **Staging:** Your staging URL

---

### Data attributes (for script tag)

| Data Attribute             | Type                                                           | Default                  | Description                                                       |
| -------------------------- | -------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| `data-run-id`              | `string`                                                       | **required**             | The run ID from a prompt run                                      |
| `data-variant`             | `'trigger' \| 'thumbs' \| 'inline'`                            | `'trigger'`              | Display variant                                                   |
| `data-base-url`            | `string`                                                       | `'https://api.cobbl.ai'` | Custom API base URL                                               |
| `data-trigger-button-text` | `string`                                                       | `'Feedback'`             | Text shown on the trigger button (only for 'trigger' variant)     |
| `data-position`            | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'`         | Position of the flyout (only for 'trigger' and 'thumbs' variants) |

### Config object (for Vanilla JS & React)

```typescript
interface FeedbackWidgetConfig {
  runId: string // Required - The run ID from a prompt execution
  variant?: 'trigger' | 'thumbs' | 'inline' // Optional - Display variant (default: 'trigger')
  triggerButtonText?: string // Optional - Button text (defaults to 'Feedback', only for 'trigger' variant)
  position?:
    | 'bottom-right'
    | 'bottom-left' // Optional (only for 'trigger' and 'thumbs' variants)
    | 'top-right'
    | 'top-left'
  onSuccess?: (feedbackId: string) => void // Optional
  onError?: (error: Error) => void // Optional
}
```

---

## Styling

The widget uses **Shadow DOM with extensive CSS variables** for complete style isolation while maintaining full customization.

### Quick Customization

```css
#cobbl-feedback-widget {
  /* Colors */
  --cobbl-primary: #0ea5e9;
  --cobbl-primary-hover: #0284c7;

  /* Sizing */
  --cobbl-flyout-width: 400px;
  --cobbl-trigger-padding: 12px 20px;

  /* Typography */
  --cobbl-font-size-base: 16px;
  --cobbl-radius: 12px;
}
```

### Dark Mode Example

```css
#cobbl-feedback-widget {
  --cobbl-primary: #818cf8;
  --cobbl-bg: #1f2937;
  --cobbl-text: #f9fafb;
  --cobbl-border: #4b5563;
}
```

### 100+ CSS Variables Available

The widget exposes over 100 CSS variables for complete customization:

- Colors (primary, success, error, backgrounds, text, borders)
- Typography (fonts, sizes, weights)
- Spacing (padding, margins, gaps)
- Borders (radius, widths)
- Shadows and effects
- Component-specific styles (trigger, flyout, buttons, textarea, etc.)

**See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for the complete reference and examples.**

---

## Advanced Usage

### Multiple widgets on one page

**Script tag:**

```html
<div class="cobbl-feedback-widget" data-run-id="run-1"></div>
<div class="cobbl-feedback-widget" data-run-id="run-2"></div>
```

**Vanilla JS:**

```typescript
const widget1 = cobblWidget.create({ runId: 'run-1' })
widget1.mount('#container-1')

const widget2 = cobblWidget.create({ runId: 'run-2' })
widget2.mount('#container-2')
```

**React:**

```tsx
<div>
  <FeedbackWidget runId="run-1" />
  <FeedbackWidget runId="run-2" />
</div>
```

### Updating configuration dynamically

**Vanilla JS:**

```typescript
const widget = cobblWidget.create({ runId: 'run-1' })
widget.mount('#container')

// Later, update the runId
widget.update({ runId: 'run-2' })
```

**React:**

```tsx
const [runId, setRunId] = useState('run-1')

return (
  <FeedbackWidget
    runId={runId} // Automatically updates when runId changes
  />
)
```

---

## Development

```bash
# Start dev server with interactive examples
pnpm run dev
# Opens http://localhost:3002/ with live reload

# Build the package
pnpm run build

# Type check
pnpm typecheck
```

The dev server includes three interactive examples:

- **Script Tag** (`/script-tag.html`) - Auto-mounting with MutationObserver
- **Vanilla JS** (`/vanilla-js.html`) - Programmatic API demo
- **React** (`/react.html`) - React component examples

See [dev/README.md](./dev/README.md) for detailed development documentation.

---

## TypeScript Support

Full TypeScript support included:

```typescript
import type {
  FeedbackWidgetConfig,
  WidgetState,
  WidgetInstance,
} from '@cobbl-ai/feedback-widget'
```

---

## Browser Support

**Minimum versions required:**

- Chrome 73+ (March 2019)
- Firefox 101+ (May 2022)
- Safari 16.4+ (March 2023)
- Edge 79+ (January 2020)

**Features used:**

- ES2020 support
- Shadow DOM (for style isolation)
- Constructable Stylesheets (for memory efficiency)
- MutationObserver (for script tag dynamic mounting)

---

## License

MIT
