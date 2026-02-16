/**
 * Type definitions for React component
 */

import type React from 'react'
import type { FeedbackWidgetConfig } from './index'

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
 * Supports three variants:
 * - 'trigger': Shows a trigger button that opens the feedback popover (default)
 * - 'thumbs': Shows thumbs up/down buttons that immediately register feedback and open the popover
 * - 'inline': Renders the full feedback form directly without a flyout
 */
export declare const FeedbackWidget: React.FC<FeedbackWidgetProps>
