/**
 * Vanilla JS API - Stripe Elements style
 *
 * @example
 * ```typescript
 * import { cobblWidget } from '@cobbl-ai/feedback-widget'
 *
 * // Default variant (trigger button)
 * const widget = cobblWidget.create({
 *   runId: 'prompt-run-id'
 * })
 * widget.mount('#feedback-container')
 *
 * // Inline variant (thumbs up/down buttons)
 * const inlineWidget = cobblWidget.create({
 *   runId: 'prompt-run-id',
 *   variant: 'inline'
 * })
 * inlineWidget.mount('#inline-container')
 * ```
 */

import {
  CobblFeedbackWidgetInstance,
  getConfigFromDataAttributes,
} from './core'
import type { FeedbackWidgetConfig } from './types'

/**
 * Widget instance with mount/destroy methods
 */
export interface WidgetInstance {
  /**
   * Mount the widget to a DOM element
   * @param container - Element or selector to mount to
   */
  mount(container: string | HTMLElement): void

  /**
   * Update the widget configuration
   * @param config - Partial configuration to update
   */
  update(config: Partial<FeedbackWidgetConfig>): void

  /**
   * Unmount and cleanup the widget
   */
  destroy(): void

  /**
   * Get current configuration
   */
  getConfig(): FeedbackWidgetConfig
}

class VanillaWidgetInstance implements WidgetInstance {
  private config: FeedbackWidgetConfig
  private instance: CobblFeedbackWidgetInstance | null = null

  constructor(config: FeedbackWidgetConfig) {
    this.config = config
  }

  mount(container: string | HTMLElement): void {
    const element =
      typeof container === 'string'
        ? document.querySelector<HTMLElement>(container)
        : container

    if (!element) {
      throw new Error(
        `Cobbl Feedback Widget: Container "${container}" not found`
      )
    }

    this.instance = new CobblFeedbackWidgetInstance(element, this.config)
    this.instance.mount()
  }

  update(config: Partial<FeedbackWidgetConfig>): void {
    this.config = { ...this.config, ...config }

    if (this.instance) {
      this.instance.update(config)
    }
  }

  destroy(): void {
    if (this.instance) {
      this.instance.destroy()
      this.instance = null
    }
  }

  getConfig(): FeedbackWidgetConfig {
    return { ...this.config }
  }
}

/**
 * Factory for creating widget instances
 */
export const cobblWidget = {
  /**
   * Create a new widget instance
   *
   * @param config - Widget configuration or element with data attributes
   * @returns Widget instance with mount/destroy methods
   *
   * @example With config object
   * ```typescript
   * const widget = cobblWidget.create({
   *   runId: 'prompt-run-id'
   * })
   * widget.mount('#container')
   * ```
   *
   * @example With data attributes
   * ```typescript
   * const element = document.getElementById('my-widget')
   * const widget = cobblWidget.create(element)
   * widget.mount(element)
   * ```
   */
  create(configOrElement: FeedbackWidgetConfig | HTMLElement): WidgetInstance {
    const config =
      configOrElement instanceof HTMLElement
        ? getConfigFromDataAttributes(configOrElement)
        : configOrElement

    return new VanillaWidgetInstance(config)
  },
}
