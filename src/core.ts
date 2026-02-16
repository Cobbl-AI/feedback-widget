/**
 * Core widget class - shared by all APIs
 * Uses Shadow DOM for complete style encapsulation with extensive CSS variables
 */

import { render, h } from 'preact'
import { FeedbackWidget } from './FeedbackWidget'
import type { FeedbackWidgetConfig } from './types'
import { styles } from './styles'

/**
 * Core Widget class that handles mounting and unmounting
 * Uses Shadow DOM for style isolation while maintaining customization via CSS variables
 *
 * Uses Constructable Stylesheets for memory efficiency when multiple widgets are mounted.
 * All widget instances share a single CSSStyleSheet object.
 *
 * Requires: Chrome 73+, Firefox 101+, Safari 16.4+, Edge 79+
 */
export class CobblFeedbackWidgetInstance {
  /**
   * Shared CSSStyleSheet instance used by all widget instances
   * This significantly reduces memory usage when multiple widgets are on the page
   * @private
   */
  private static sharedStyleSheet: CSSStyleSheet | null = null

  private shadow: ShadowRoot
  private config: FeedbackWidgetConfig

  constructor(container: HTMLElement, config: FeedbackWidgetConfig) {
    this.config = config

    // Create shadow root for complete style encapsulation
    // mode: 'open' allows access to shadow root for debugging
    // If a shadow root already exists (e.g., in React StrictMode), reuse it
    if (container.shadowRoot) {
      this.shadow = container.shadowRoot
    } else {
      this.shadow = container.attachShadow({ mode: 'open' })
    }

    // Inject styles using the most efficient method available
    this.injectStyles()
  }

  /**
   * Inject styles into the shadow root using Constructable Stylesheets
   *
   * Requires: Chrome 73+, Firefox 101+, Safari 16.4+, Edge 79+
   * Benefits: Shared stylesheet across all instances = better memory & performance
   *
   * @private
   */
  private injectStyles(): void {
    // Create the shared stylesheet once for all instances
    if (!CobblFeedbackWidgetInstance.sharedStyleSheet) {
      CobblFeedbackWidgetInstance.sharedStyleSheet = new CSSStyleSheet()
      CobblFeedbackWidgetInstance.sharedStyleSheet.replaceSync(styles)
    }

    // Adopt the shared stylesheet into this shadow root
    // Type assertion needed for TypeScript (adoptedStyleSheets is not in base types yet)
    ;(
      this.shadow as ShadowRoot & { adoptedStyleSheets: CSSStyleSheet[] }
    ).adoptedStyleSheets = [CobblFeedbackWidgetInstance.sharedStyleSheet]
  }

  /**
   * Mount the widget to the shadow root
   */
  mount(): void {
    render(h(FeedbackWidget, this.config), this.shadow)
  }

  /**
   * Update the widget configuration
   */
  update(config: Partial<FeedbackWidgetConfig>): void {
    this.config = { ...this.config, ...config }
    render(h(FeedbackWidget, this.config), this.shadow)
  }

  /**
   * Unmount and cleanup the widget
   */
  destroy(): void {
    render(null, this.shadow)
  }

  /**
   * Get current configuration
   */
  getConfig(): FeedbackWidgetConfig {
    return { ...this.config }
  }
}

/**
 * Read configuration from data attributes on a container element
 */
export const getConfigFromDataAttributes = (
  element: HTMLElement
): FeedbackWidgetConfig => {
  const runId = element.getAttribute('data-run-id')

  if (!runId) {
    throw new Error(
      'Cobbl Feedback Widget: data-run-id is required on the container element'
    )
  }

  const config: FeedbackWidgetConfig = {
    runId,
  }

  // Variant
  const variant = element.getAttribute('data-variant')
  if (variant === 'trigger' || variant === 'thumbs' || variant === 'inline') {
    config.variant = variant
  }

  // Optional attributes
  const baseUrl = element.getAttribute('data-base-url')
  if (baseUrl) {
    config.baseUrl = baseUrl
  }

  // Default variant options
  const triggerButtonText = element.getAttribute('data-trigger-button-text')
  if (triggerButtonText) {
    config.triggerButtonText = triggerButtonText
  }

  const position = element.getAttribute('data-position')
  if (
    position === 'top-left' ||
    position === 'top' ||
    position === 'top-right' ||
    position === 'right' ||
    position === 'bottom-right' ||
    position === 'bottom' ||
    position === 'bottom-left' ||
    position === 'left'
  ) {
    config.position = position
  }

  // Color scheme
  const colorScheme = element.getAttribute('data-color-scheme')
  if (
    colorScheme === 'auto' ||
    colorScheme === 'light' ||
    colorScheme === 'dark'
  ) {
    config.colorScheme = colorScheme
  }

  return config
}
