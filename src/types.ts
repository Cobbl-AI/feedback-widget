/**
 * Whether the AI output was helpful
 */
export type Helpful = 'helpful' | 'not_helpful'

/**
 * Position options for widget flyout
 */
export type WidgetPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'

/**
 * Widget variant options
 * - 'trigger': Shows a trigger button that opens the feedback popover
 * - 'thumbs': Shows thumbs up/down buttons that immediately register feedback and open the popover
 * - 'inline': Renders the full feedback form directly without a flyout
 */
export type WidgetVariant = 'trigger' | 'thumbs' | 'inline'

/**
 * Color scheme options for the widget
 * - 'auto': Follows system preference (prefers-color-scheme) and reacts to changes
 * - 'light': Forces light theme
 * - 'dark': Forces dark theme
 */
export type ColorScheme = 'auto' | 'light' | 'dark'

/**
 * Configuration for the feedback widget
 */
export interface FeedbackWidgetConfig {
  /**
   * The run ID from a prompt run to submit feedback for
   */
  runId: string

  /**
   * Widget variant
   * - 'trigger': Shows a trigger button that opens the feedback popover
   * - 'thumbs': Shows thumbs up/down buttons that immediately register feedback and open the popover
   * - 'inline': Renders the full feedback form directly without a flyout
   * @default 'trigger'
   */
  variant?: WidgetVariant

  /**
   * Optional base URL for the API (defaults to 'https://api.cobbl.ai')
   * @internal
   */
  baseUrl?: string

  /**
   * Callback fired when feedback is successfully submitted
   */
  onSuccess?: (feedbackId: string) => void

  /**
   * Callback fired when feedback submission fails
   */
  onError?: (error: Error) => void

  /**
   * Custom trigger button text (defaults to 'Feedback')
   * Only used when variant is 'trigger'
   */
  triggerButtonText?: string

  /**
   * Position of the widget flyout
   * Only used when variant is 'trigger' or 'thumbs'
   * @default 'bottom-right'
   */
  position?: WidgetPosition

  /**
   * Demo mode - disables all API calls
   * Internal use only for documentation/demos
   * @default false
   * @internal
   */
  demo?: boolean

  /**
   * Color scheme for the widget
   * - 'auto': Follows system preference (prefers-color-scheme) and reacts to changes
   * - 'light': Forces light theme
   * - 'dark': Forces dark theme
   * @default 'auto'
   */
  colorScheme?: ColorScheme
}

/**
 * Internal widget state
 */
export interface WidgetState {
  isOpen: boolean
  helpful: Helpful | null
  feedback: string
  isSubmitting: boolean
  isSubmitted: boolean
  error: string | null
  /** The feedback ID returned after initial creation */
  feedbackId: string | null
  /** Promise tracking the pending create request (for queueing updates) */
  pendingCreate: Promise<string> | null
}
