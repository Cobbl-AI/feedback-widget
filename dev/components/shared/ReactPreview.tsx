import type { WidgetConfig } from './WidgetControls'
import { PreviewContainer } from './PreviewContainer'
import { FeedbackWidget } from '../../../src/react'

interface ReactPreviewProps {
  config: WidgetConfig
}

export const ReactPreview = ({ config }: ReactPreviewProps) => {
  return (
    <PreviewContainer bare={config.variant === 'inline'}>
      <FeedbackWidget
        key={config.variant}
        runId={config.runId}
        baseUrl={config.apiEndpoint}
        variant={config.variant}
        triggerButtonText={config.triggerButtonText}
        position={config.position}
        colorScheme={config.colorScheme}
        onSuccess={(feedbackId) => {
          console.log('✅ [React] Feedback submitted:', feedbackId)
          alert('Thanks for your feedback!')
        }}
        onError={(error) => {
          console.error('❌ [React] Error:', error)
        }}
      />
    </PreviewContainer>
  )
}
