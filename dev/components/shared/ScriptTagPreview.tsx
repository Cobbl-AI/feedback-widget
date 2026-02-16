import type { WidgetConfig } from './WidgetControls'
import { PreviewContainer } from './PreviewContainer'

// Import the browser script to enable auto-mounting
import '../../../src/browser'

interface ScriptTagPreviewProps {
  config: WidgetConfig
}

export const ScriptTagPreview = ({ config }: ScriptTagPreviewProps) => {
  return (
    <PreviewContainer bare={config.variant === 'inline'}>
      {/* Key forces remount when variant changes, triggering auto-mount */}
      <div key={config.variant}>
        {/* This div auto-mounts via MutationObserver from browser.ts */}
        <div
          id="cobbl-feedback-widget"
          data-run-id={config.runId}
          data-variant={config.variant}
          data-position={config.position}
          data-trigger-button-text={config.triggerButtonText}
          data-color-scheme={config.colorScheme}
          data-base-url={config.apiEndpoint}
        />
      </div>
    </PreviewContainer>
  )
}
