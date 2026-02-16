import * as React from 'react'
import type { WidgetConfig } from './WidgetControls'

type IntegrationType = 'script-tag' | 'vanilla-js' | 'react'

interface CodeExampleProps {
  config: WidgetConfig
  type: IntegrationType
}

const generateScriptTagCode = (config: WidgetConfig) => {
  return `<!-- 1. Include the widget script -->
<script src="https://unpkg.com/@cobbl-ai/feedback-widget/dist/cobbl-feedback-widget.global.js"></script>

<!-- 2. Add the widget container -->
<div
  id="cobbl-feedback-widget"
  data-run-id="${config.runId}"
  data-variant="${config.variant}"${
    config.variant === 'trigger'
      ? `
  data-trigger-button-text="${config.triggerButtonText}"`
      : ''
  }${
    config.variant !== 'inline'
      ? `
  data-position="${config.position}"`
      : ''
  }
  data-color-scheme="${config.colorScheme}"
  data-base-url="${config.apiEndpoint}"
></div>`
}

const generateVanillaJsCode = (config: WidgetConfig) => {
  return `import { cobblWidget } from '@cobbl-ai/feedback-widget'

// Create a widget instance
const widget = cobblWidget.create({
  runId: '${config.runId}',
  variant: '${config.variant}',${
    config.variant === 'trigger'
      ? `
  triggerButtonText: '${config.triggerButtonText}',`
      : ''
  }${
    config.variant !== 'inline'
      ? `
  position: '${config.position}',`
      : ''
  }
  colorScheme: '${config.colorScheme}',
  baseUrl: '${config.apiEndpoint}',
  onSuccess: (id) => console.log('Submitted:', id),
  onError: (err) => console.error('Error:', err),
})

// Mount to a DOM element
widget.mount('#your-container')

// Update config dynamically (widget auto-updates)
widget.update({ colorScheme: 'dark' })`
}

const generateReactCode = (config: WidgetConfig) => {
  return `import { FeedbackWidget } from '@cobbl-ai/feedback-widget/react'

const MyComponent = () => {
  return (
    <FeedbackWidget
      runId="${config.runId}"
      variant="${config.variant}"${
        config.variant === 'trigger'
          ? `
      triggerButtonText="${config.triggerButtonText}"`
          : ''
      }${
        config.variant !== 'inline'
          ? `
      position="${config.position}"`
          : ''
      }
      colorScheme="${config.colorScheme}"
      baseUrl="${config.apiEndpoint}"
      onSuccess={(id) => console.log('Submitted:', id)}
      onError={(err) => console.error('Error:', err)}
    />
  )
}`
}

const codeGenerators: Record<
  IntegrationType,
  (config: WidgetConfig) => string
> = {
  'script-tag': generateScriptTagCode,
  'vanilla-js': generateVanillaJsCode,
  react: generateReactCode,
}

export const CodeExample = ({ config, type }: CodeExampleProps) => {
  const code = codeGenerators[type](config)

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">Code Example</h3>
      <pre className="code-block text-xs leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}
