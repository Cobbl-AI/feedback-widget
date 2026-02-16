'use client'

/**
 * React component wrapper
 *
 * @example
 * ```tsx
 * import { FeedbackWidget } from '@cobbl-ai/feedback-widget/react'
 *
 * const App = () => (
 *   <>
 *     {/* Trigger variant - button that opens flyout (default) *\/}
 *     <FeedbackWidget runId="prompt-run-id" />
 *
 *     {/* Thumbs variant - thumbs up/down buttons that open flyout *\/}
 *     <FeedbackWidget runId="prompt-run-id" variant="thumbs" />
 *
 *     {/* Inline variant - full form rendered directly *\/}
 *     <FeedbackWidget runId="prompt-run-id" variant="inline" />
 *   </>
 * )
 * ```
 */

/** @jsxImportSource react */
import { useEffect, useRef } from 'react'
import { cobblWidget } from './vanilla'
import type { FeedbackWidgetConfig } from './types'

export interface FeedbackWidgetProps extends FeedbackWidgetConfig {
  /**
   * Additional CSS class name for the container
   */
  className?: string
  /**
   * Additional inline styles for the container
   */
  style?: React.CSSProperties
}

/**
 * React component for the Cobbl Feedback Widget
 *
 * Uses the vanilla JS API under the hood for proper lifecycle management
 */
export const FeedbackWidget = ({
  runId,
  variant,
  baseUrl,
  triggerButtonText,
  position,
  onSuccess,
  onError,
  demo,
  colorScheme,
  className,
  style,
}: FeedbackWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<ReturnType<typeof cobblWidget.create> | null>(null)

  // Create and mount widget on initial render
  useEffect(() => {
    if (!containerRef.current) return

    const widget = cobblWidget.create({
      runId,
      variant,
      baseUrl,
      triggerButtonText,
      position,
      onSuccess,
      onError,
      demo,
      colorScheme,
    })

    widget.mount(containerRef.current)
    widgetRef.current = widget

    return () => {
      widget.destroy()
      widgetRef.current = null
    }
  }, []) // Empty deps - only run on mount

  // Update widget when config changes
  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.update({
        runId,
        variant,
        baseUrl,
        triggerButtonText,
        position,
        onSuccess,
        onError,
        demo,
        colorScheme,
      })
    }
  }, [
    runId,
    variant,
    baseUrl,
    triggerButtonText,
    position,
    onSuccess,
    onError,
    demo,
    colorScheme,
  ])

  const styleAttr = style ? { ...style } : undefined
  return <div ref={containerRef} className={className} style={styleAttr} />
}
