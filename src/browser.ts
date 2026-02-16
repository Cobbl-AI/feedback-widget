/**
 * Browser entry point for script tag / CDN usage
 *
 * Auto-mounts widgets and watches for dynamically added widget containers.
 *
 * @example Default variant (trigger button)
 * ```html
 * <div
 *   id="cobbl-feedback-widget"
 *   data-run-id="prompt-run-id"
 * ></div>
 * <script src="https://unpkg.com/@cobbl-ai/feedback-widget/dist/cobbl-feedback-widget.global.js"></script>
 * ```
 *
 * @example Inline variant (thumbs up/down buttons)
 * ```html
 * <div
 *   id="cobbl-feedback-widget"
 *   data-run-id="prompt-run-id"
 *   data-variant="inline"
 * ></div>
 * <script src="https://unpkg.com/@cobbl-ai/feedback-widget/dist/cobbl-feedback-widget.global.js"></script>
 * ```
 */

import { cobblWidget } from './vanilla'
import type { WidgetInstance } from './vanilla'
import { getConfigFromDataAttributes } from './core'

const CONTAINER_ID = 'cobbl-feedback-widget'

// Track mounted widgets to prevent double-mounting
const mountedWidgets = new WeakMap<HTMLElement, WidgetInstance>()

/**
 * Mount a widget to a container element
 */
const mountWidget = (element: HTMLElement): void => {
  // Skip if already mounted
  if (mountedWidgets.has(element)) {
    return
  }

  try {
    const widget = cobblWidget.create(element)
    widget.mount(element)
    mountedWidgets.set(element, widget)
  } catch (error) {
    console.error('Cobbl Feedback Widget initialization failed:', error)
  }
}

/**
 * Update a widget's configuration from its data attributes
 */
const updateWidget = (element: HTMLElement): void => {
  const widget = mountedWidgets.get(element)
  if (!widget) {
    return
  }

  try {
    const config = getConfigFromDataAttributes(element)
    widget.update(config)
  } catch (error) {
    console.error('Cobbl Feedback Widget update failed:', error)
  }
}

/**
 * Unmount a widget from a container element
 */
const unmountWidget = (element: HTMLElement): void => {
  const widget = mountedWidgets.get(element)
  if (widget) {
    widget.destroy()
    mountedWidgets.delete(element)
  }
}

/**
 * Find and mount all widget containers on the page
 */
const mountAllWidgets = (): void => {
  const idContainer = document.getElementById(CONTAINER_ID)
  if (idContainer) {
    mountWidget(idContainer)
  }
}

/**
 * Check if an element is a widget container
 */
const isWidgetContainer = (element: HTMLElement): boolean => {
  return element.id === CONTAINER_ID
}

/**
 * Initialize auto-mounting with MutationObserver for dynamic widgets
 */
const init = (): void => {
  // Mount existing widgets
  mountAllWidgets()

  // Watch for dynamically added/removed widgets and attribute changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Handle attribute changes on widget containers
      if (
        mutation.type === 'attributes' &&
        mutation.target instanceof HTMLElement
      ) {
        const target = mutation.target
        if (isWidgetContainer(target)) {
          updateWidget(target)
        }
      }

      // Handle added nodes
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if the node itself is a widget container
            if (isWidgetContainer(node)) {
              mountWidget(node)
            }

            // Check descendants for the widget ID
            const addedIdMatch = node.querySelector(`#${CONTAINER_ID}`)
            if (addedIdMatch instanceof HTMLElement) {
              mountWidget(addedIdMatch)
            }
          }
        })

        // Handle removed nodes
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if the node itself was a widget container
            if (isWidgetContainer(node)) {
              unmountWidget(node)
            }

            // Check descendants for the widget ID
            const removedIdMatch = node.querySelector(`#${CONTAINER_ID}`)
            if (removedIdMatch instanceof HTMLElement) {
              unmountWidget(removedIdMatch)
            }
          }
        })
      }
    }
  })

  // Start observing - watch for child changes AND attribute changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      'data-run-id',
      'data-variant',
      'data-base-url',
      'data-trigger-button-text',
      'data-position',
      'data-color-scheme',
    ],
  })
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Expose vanilla API globally for manual usage
declare global {
  interface Window {
    cobblWidget: typeof cobblWidget
  }
}

if (typeof window !== 'undefined') {
  window.cobblWidget = cobblWidget
}
