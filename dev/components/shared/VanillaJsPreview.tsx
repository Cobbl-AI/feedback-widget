import { useEffect, useRef } from 'react'
import type { WidgetConfig } from './WidgetControls'
import { PreviewContainer } from './PreviewContainer'
import { cobblWidget, type WidgetInstance } from '../../../src/vanilla'

interface VanillaJsPreviewProps {
  config: WidgetConfig
}

export const VanillaJsPreview = ({ config }: VanillaJsPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<WidgetInstance | null>(null)

  // Create/recreate widget when variant changes (variant changes cause DOM remount)
  useEffect(() => {
    if (!containerRef.current) return

    // Create widget instance
    widgetRef.current = cobblWidget.create({
      runId: config.runId,
      variant: config.variant,
      position: config.position,
      triggerButtonText: config.triggerButtonText,
      colorScheme: config.colorScheme,
      baseUrl: config.apiEndpoint,
      onSuccess: (feedbackId) => {
        console.log('✅ [Vanilla JS] Feedback submitted:', feedbackId)
        alert('Thanks for your feedback!')
      },
      onError: (error) => {
        console.error('❌ [Vanilla JS] Error:', error)
      },
    })

    // Mount to container
    widgetRef.current.mount(containerRef.current)

    // Cleanup on unmount or variant change
    return () => {
      widgetRef.current?.destroy()
      widgetRef.current = null
    }
  }, [config.variant]) // Recreate widget when variant changes

  // Update widget when other config changes (not variant)
  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.update({
        runId: config.runId,
        position: config.position,
        triggerButtonText: config.triggerButtonText,
        colorScheme: config.colorScheme,
        baseUrl: config.apiEndpoint,
      })
    }
  }, [
    config.runId,
    config.position,
    config.triggerButtonText,
    config.colorScheme,
    config.apiEndpoint,
  ])

  return (
    <PreviewContainer bare={config.variant === 'inline'}>
      {/* Key forces remount when variant changes */}
      <div ref={containerRef} key={config.variant} />
    </PreviewContainer>
  )
}
