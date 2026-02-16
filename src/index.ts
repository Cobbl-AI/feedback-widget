/**
 * Cobbl Feedback Widget - Main exports
 *
 * @example Vanilla JS
 * ```typescript
 * import { cobblWidget } from '@cobbl-ai/feedback-widget'
 *
 * // Trigger variant (button that opens flyout) - default
 * const widget = cobblWidget.create({
 *   runId: 'prompt-run-id'
 * })
 * widget.mount('#container')
 *
 * // Thumbs variant (thumbs up/down buttons that open flyout)
 * const thumbsWidget = cobblWidget.create({
 *   runId: 'prompt-run-id',
 *   variant: 'thumbs'
 * })
 * thumbsWidget.mount('#thumbs-container')
 *
 * // Inline variant (full form rendered directly)
 * const inlineWidget = cobblWidget.create({
 *   runId: 'prompt-run-id',
 *   variant: 'inline'
 * })
 * inlineWidget.mount('#inline-container')
 * ```
 *
 * @example React
 * ```tsx
 * import { FeedbackWidget } from '@cobbl-ai/feedback-widget/react'
 *
 * // Trigger variant (default)
 * <FeedbackWidget runId="prompt-run-id" />
 *
 * // Thumbs variant
 * <FeedbackWidget runId="prompt-run-id" variant="thumbs" />
 *
 * // Inline variant
 * <FeedbackWidget runId="prompt-run-id" variant="inline" />
 * ```
 */

// Export vanilla JS API
export { cobblWidget } from './vanilla'
export type { WidgetInstance } from './vanilla'

// Export types
export type {
  FeedbackWidgetConfig,
  WidgetState,
  WidgetPosition,
  WidgetVariant,
  ColorScheme,
} from './types'

// Export core utilities
export { CobblFeedbackWidgetInstance } from './core'
