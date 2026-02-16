/**
 * Scoped styles for the feedback widget
 * Uses Shadow DOM with extensive CSS variables for customization
 * Inspired by shadcn/ui design system
 *
 * All variables are prefixed with --cobbl- and can be customized from the host page:
 *
 * @example
 * ```css
 * #cobbl-feedback-widget {
 *   --cobbl-primary: #0ea5e9;
 *   --cobbl-trigger-color: #6b7280;
 * }
 * ```
 */

export const WIDGET_ID = 'cobbl-feedback-widget'

/**
 * Dark mode CSS variable overrides (shadcn/ui zinc palette)
 * Extracted to avoid duplication between auto and explicit dark mode selectors
 */
const darkModeVariables = `
  --cobbl-primary: #fafafa;
  --cobbl-primary-hover: #e4e4e7;
  --cobbl-success: #22c55e;
  --cobbl-error: #ef4444;
  --cobbl-bg: #09090b;
  --cobbl-bg-secondary: #18181b;
  --cobbl-text: #fafafa;
  --cobbl-text-secondary: #a1a1aa;
  --cobbl-text-muted: #71717a;
  --cobbl-border: #27272a;
  --cobbl-ring: #fafafa;
  --cobbl-ring-opacity: 0.2;

  /* Shadows adjusted for dark mode */
  --cobbl-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
  --cobbl-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.2);

  /* Focus ring for dark mode */
  --cobbl-focus-ring-color: rgba(250, 250, 250, 0.2);

  /* Selected button text stays dark on light background in dark mode */
  --cobbl-thumb-btn-selected-color: #09090b;

  /* Submit button text stays dark on light background in dark mode */
  --cobbl-submit-color: #09090b;
`

/**
 * Widget styles with comprehensive CSS variables
 * All customizable properties exposed as CSS custom properties
 */
export const styles = `
    :host {
      /* ========== Color Palette ========== */
      --cobbl-primary: #09090b;
      --cobbl-primary-hover: #18181b;
      --cobbl-success: #22c55e;
      --cobbl-error: #ef4444;
      --cobbl-bg: #ffffff;
      --cobbl-bg-secondary: #f9fafb;
      --cobbl-text: #09090b;
      --cobbl-text-secondary: #71717a;
      --cobbl-text-muted: #a1a1aa;
      --cobbl-border: #e4e4e7;
      --cobbl-ring: #09090b;
      --cobbl-ring-opacity: 0.2;

      /* ========== Shadows & Effects ========== */
      --cobbl-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      --cobbl-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

      /* ========== Border Radius ========== */
      --cobbl-radius: 6px;
      --cobbl-radius-sm: 4px;

      /* ========== Typography ========== */
      --cobbl-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      --cobbl-font-size-xs: 12px;
      --cobbl-font-size-sm: 13px;
      --cobbl-font-size-base: 14px;
      --cobbl-font-size-lg: 16px;
      --cobbl-font-size-xl: 18px;
      --cobbl-font-weight-normal: 400;
      --cobbl-font-weight-medium: 500;
      --cobbl-font-weight-semibold: 600;
      --cobbl-line-height: 1.5;

      /* ========== Spacing ========== */
      --cobbl-spacing-xs: 4px;
      --cobbl-spacing-sm: 8px;
      --cobbl-spacing-md: 12px;
      --cobbl-spacing-lg: 16px;
      --cobbl-spacing-xl: 20px;
      --cobbl-spacing-2xl: 24px;
      --cobbl-spacing-3xl: 32px;

      /* ========== Transitions ========== */
      --cobbl-transition: all 0.15s ease;
      --cobbl-transition-fast: all 0.1s ease;

      /* ========== Focus Ring (shadcn style) ========== */
      --cobbl-focus-ring-width: 2px;
      --cobbl-focus-ring-offset: 2px;
      --cobbl-focus-ring-color: rgba(9, 9, 11, 0.2);

      /* ========== Z-Index ========== */
      --cobbl-z-index-flyout: 10000;

      /* ========== Trigger Button (Text Link Style) ========== */
      --cobbl-trigger-padding: 0;
      --cobbl-trigger-font-size: var(--cobbl-font-size-xs);
      --cobbl-trigger-font-weight: var(--cobbl-font-weight-normal);
      --cobbl-trigger-color: var(--cobbl-text-muted);
      --cobbl-trigger-text-decoration: underline;
      --cobbl-trigger-text-underline-offset: 2px;
      --cobbl-trigger-text-decoration-thickness: 1px;
      --cobbl-trigger-hover-color: var(--cobbl-text-secondary);
      --cobbl-trigger-hover-text-decoration: underline;
      --cobbl-trigger-hover-text-underline-offset: 2px;
      --cobbl-trigger-hover-text-decoration-thickness: 1px;

      /* ========== Direct Thumb Triggers (Ghost Button Style) ========== */
      --cobbl-direct-triggers-gap: var(--cobbl-spacing-xs);
      --cobbl-direct-thumb-size: 24px;
      --cobbl-direct-thumb-padding: 0;
      --cobbl-direct-thumb-border-radius: var(--cobbl-radius-sm);
      --cobbl-direct-thumb-color: var(--cobbl-text-muted);
      --cobbl-direct-thumb-bg: transparent;
      --cobbl-direct-thumb-hover-color: var(--cobbl-text);
      --cobbl-direct-thumb-hover-bg: var(--cobbl-bg-secondary);
      --cobbl-direct-thumb-submitted-color: var(--cobbl-success);
      --cobbl-direct-thumb-submitted-bg: transparent;
      --cobbl-direct-thumb-icon-size: 16px;

      /* ========== Flyout Panel ========== */
      --cobbl-flyout-width: 320px;
      --cobbl-flyout-bg: var(--cobbl-bg);
      --cobbl-flyout-border: 1px solid var(--cobbl-border);
      --cobbl-flyout-border-radius: var(--cobbl-radius);
      --cobbl-flyout-shadow: var(--cobbl-shadow);
      --cobbl-flyout-padding: var(--cobbl-spacing-md);
      --cobbl-flyout-margin: var(--cobbl-spacing-sm);

      /* ========== Inline Form (variant='inline') ========== */
      --cobbl-inline-width: 100%;

      /* ========== Header ========== */
      --cobbl-header-gap: var(--cobbl-spacing-md);
      --cobbl-header-margin-bottom: var(--cobbl-spacing-md);

      /* ========== Title ========== */
      --cobbl-title-font-size: var(--cobbl-font-size-base);
      --cobbl-title-font-weight: var(--cobbl-font-weight-semibold);
      --cobbl-title-color: var(--cobbl-text);

      /* ========== Close Button ========== */
      --cobbl-close-size: 20px;
      --cobbl-close-padding: 0;
      --cobbl-close-color: var(--cobbl-text-muted);
      --cobbl-close-hover-color: var(--cobbl-text);
      --cobbl-close-hover-bg: var(--cobbl-bg-secondary);
      --cobbl-close-border-radius: var(--cobbl-radius-sm);

      /* ========== Question Text ========== */
      --cobbl-question-font-size: var(--cobbl-font-size-sm);
      --cobbl-question-font-weight: var(--cobbl-font-weight-semibold);
      --cobbl-question-color: var(--cobbl-text);
      --cobbl-question-margin-bottom: var(--cobbl-spacing-sm);

      /* ========== Thumb Buttons (Button Group Style) ========== */
      --cobbl-thumbs-gap: 0;
      --cobbl-thumbs-margin-bottom: var(--cobbl-spacing-md);
      --cobbl-thumb-btn-padding: 5px 12px;
      --cobbl-thumb-btn-border: 1px solid var(--cobbl-border);
      --cobbl-thumb-btn-border-radius: var(--cobbl-radius);
      --cobbl-thumb-btn-bg: var(--cobbl-bg);
      --cobbl-thumb-btn-font-size: var(--cobbl-font-size-xs);
      --cobbl-thumb-btn-font-weight: var(--cobbl-font-weight-medium);
      --cobbl-thumb-btn-line-height: 1.667;
      --cobbl-thumb-btn-color: var(--cobbl-text-secondary);
      --cobbl-thumb-btn-gap: 6px;
      --cobbl-thumb-btn-hover-bg: var(--cobbl-bg-secondary);
      --cobbl-thumb-btn-hover-color: var(--cobbl-text);
      --cobbl-thumb-btn-selected-border-color: var(--cobbl-primary);
      --cobbl-thumb-btn-selected-bg: var(--cobbl-primary);
      --cobbl-thumb-btn-selected-color: #ffffff;
      --cobbl-thumb-btn-selected-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --cobbl-thumb-btn-icon-size: 16px;

      /* ========== Textarea ========== */
      --cobbl-textarea-min-height: 80px;
      --cobbl-textarea-padding: 8px 12px;
      --cobbl-textarea-border: 1px solid var(--cobbl-border);
      --cobbl-textarea-border-radius: var(--cobbl-radius);
      --cobbl-textarea-font-size: var(--cobbl-font-size-sm);
      --cobbl-textarea-color: var(--cobbl-text);
      --cobbl-textarea-bg: var(--cobbl-bg);
      --cobbl-textarea-placeholder-color: var(--cobbl-text-muted);
      --cobbl-textarea-focus-border-color: var(--cobbl-border);

      /* ========== Submit Button Container ========== */
      --cobbl-submit-container-justify: flex-end;
      --cobbl-submit-container-margin-top: var(--cobbl-spacing-md);
      --cobbl-submit-container-align-items: center;
      --cobbl-submit-container-gap: var(--cobbl-spacing-md);

      /* ========== Keyboard Hint ========== */
      --cobbl-keyboard-hint-font-size: var(--cobbl-font-size-xs);
      --cobbl-keyboard-hint-color: var(--cobbl-text-muted);
      --cobbl-keyboard-hint-opacity-hidden: 0;
      --cobbl-keyboard-hint-opacity-visible: 1;
      --cobbl-keyboard-hint-transition: opacity 0.15s ease;

      /* ========== Submit Button ========== */
      --cobbl-submit-width: auto;
      --cobbl-submit-padding: 5px 12px;
      --cobbl-submit-bg: var(--cobbl-primary);
      --cobbl-submit-color: #ffffff;
      --cobbl-submit-border: 1px solid transparent;
      --cobbl-submit-border-radius: var(--cobbl-radius);
      --cobbl-submit-font-size: var(--cobbl-font-size-xs);
      --cobbl-submit-font-weight: var(--cobbl-font-weight-medium);
      --cobbl-submit-line-height: 1.667;
      --cobbl-submit-hover-bg: var(--cobbl-primary-hover);
      --cobbl-submit-disabled-opacity: 0.5;

      /* ========== Error Message ========== */
      --cobbl-error-color: var(--cobbl-error);
      --cobbl-error-font-size: var(--cobbl-font-size-xs);
      --cobbl-error-margin-top: var(--cobbl-spacing-sm);

      /* ========== Success State ========== */
      --cobbl-success-padding: var(--cobbl-spacing-xl) var(--cobbl-spacing-md);
      --cobbl-success-icon-size: 40px;
      --cobbl-success-icon-margin: 0 auto var(--cobbl-spacing-sm);
      --cobbl-success-icon-color: var(--cobbl-success);
      --cobbl-success-title-font-size: var(--cobbl-font-size-base);
      --cobbl-success-title-font-weight: var(--cobbl-font-weight-semibold);
      --cobbl-success-title-color: var(--cobbl-text);
      --cobbl-success-title-margin: 0 0 var(--cobbl-spacing-xs);
      --cobbl-success-text-font-size: var(--cobbl-font-size-sm);
      --cobbl-success-text-color: var(--cobbl-text-muted);

      /* Base host styles */
      font-family: var(--cobbl-font);
      font-size: var(--cobbl-font-size-base);
      line-height: var(--cobbl-line-height);
      box-sizing: border-box;
    }

    :host *, :host *::before, :host *::after {
      box-sizing: inherit;
    }

    /* ========== Dark Mode Color Overrides ========== */
    /* Uses shadcn/ui zinc palette for dark mode */

    /* Auto mode: follows system preference via CSS media query */
    @media (prefers-color-scheme: dark) {
      :host([data-color-scheme="auto"]) {
        ${darkModeVariables}
      }
    }

    /* Explicit dark mode: always applies dark theme */
    :host([data-color-scheme="dark"]) {
      ${darkModeVariables}
    }

    /* ========== Trigger Button (Text Link Style) ========== */
    .cobbl-trigger {
      all: unset;
      cursor: pointer;
      display: inline;
      padding: var(--cobbl-trigger-padding);
      font-size: var(--cobbl-trigger-font-size);
      font-weight: var(--cobbl-trigger-font-weight);
      color: var(--cobbl-trigger-color);
      text-decoration: var(--cobbl-trigger-text-decoration);
      text-underline-offset: var(--cobbl-trigger-text-underline-offset);
      text-decoration-thickness: var(--cobbl-trigger-text-decoration-thickness);
      transition: var(--cobbl-transition);
    }

    .cobbl-trigger:hover {
      color: var(--cobbl-trigger-hover-color);
      text-decoration: var(--cobbl-trigger-hover-text-decoration);
      text-underline-offset: var(--cobbl-trigger-hover-text-underline-offset);
      text-decoration-thickness: var(--cobbl-trigger-hover-text-decoration-thickness);
    }

    .cobbl-trigger:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--cobbl-focus-ring-offset) var(--cobbl-bg),
                  0 0 0 calc(var(--cobbl-focus-ring-offset) + var(--cobbl-focus-ring-width)) var(--cobbl-focus-ring-color);
      border-radius: 2px;
    }

    /* ========== Flyout Panel ========== */
    .cobbl-flyout {
      position: absolute;
      width: var(--cobbl-flyout-width);
      background: var(--cobbl-flyout-bg);
      border: var(--cobbl-flyout-border);
      border-radius: var(--cobbl-flyout-border-radius);
      box-shadow: var(--cobbl-flyout-shadow);
      padding: var(--cobbl-flyout-padding);
      z-index: var(--cobbl-z-index-flyout);
    }

    /* Corner positions */
    .cobbl-flyout.cobbl-top-left {
      bottom: 100%;
      right: 0;
      margin-bottom: var(--cobbl-flyout-margin);
    }

    .cobbl-flyout.cobbl-top-right {
      bottom: 100%;
      left: 0;
      margin-bottom: var(--cobbl-flyout-margin);
    }

    .cobbl-flyout.cobbl-bottom-left {
      top: 100%;
      right: 0;
      margin-top: var(--cobbl-flyout-margin);
    }

    .cobbl-flyout.cobbl-bottom-right {
      top: 100%;
      left: 0;
      margin-top: var(--cobbl-flyout-margin);
    }

    /* Edge positions (centered) */
    .cobbl-flyout.cobbl-top {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: var(--cobbl-flyout-margin);
    }

    .cobbl-flyout.cobbl-bottom {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: var(--cobbl-flyout-margin);
    }

    .cobbl-flyout.cobbl-left {
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      margin-right: var(--cobbl-flyout-margin);
    }

    .cobbl-flyout.cobbl-right {
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      margin-left: var(--cobbl-flyout-margin);
    }

    /* ========== Header ========== */
    .cobbl-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--cobbl-header-gap);
      margin-bottom: var(--cobbl-header-margin-bottom);
    }

    .cobbl-title {
      font-size: var(--cobbl-title-font-size);
      font-weight: var(--cobbl-title-font-weight);
      color: var(--cobbl-title-color);
      margin: 0;
    }

    .cobbl-close {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--cobbl-close-padding);
      color: var(--cobbl-close-color);
      border-radius: var(--cobbl-close-border-radius);
      transition: var(--cobbl-transition-fast);
    }

    .cobbl-close svg {
      width: var(--cobbl-close-size);
      height: var(--cobbl-close-size);
      display: block;
    }

    .cobbl-close:hover {
      color: var(--cobbl-close-hover-color);
      background: var(--cobbl-close-hover-bg);
    }

    .cobbl-close:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--cobbl-focus-ring-offset) var(--cobbl-bg),
                  0 0 0 calc(var(--cobbl-focus-ring-offset) + var(--cobbl-focus-ring-width)) var(--cobbl-focus-ring-color);
    }

    /* ========== Question Text ========== */
    .cobbl-question {
      font-size: var(--cobbl-question-font-size);
      font-weight: var(--cobbl-question-font-weight);
      color: var(--cobbl-question-color);
      margin: 0;
    }

    /* ========== Thumb Buttons (Button Group Style) ========== */
    .cobbl-thumbs {
      display: flex;
      width: 100%;
      gap: var(--cobbl-thumbs-gap);
      margin-bottom: var(--cobbl-thumbs-margin-bottom);
      border-radius: var(--cobbl-thumb-btn-border-radius);
      box-shadow: var(--cobbl-shadow-sm);
    }

    .cobbl-thumb-btn {
      all: unset;
      cursor: pointer;
      flex: 1;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--cobbl-thumb-btn-gap);
      padding: var(--cobbl-thumb-btn-padding);
      border: var(--cobbl-thumb-btn-border);
      background: var(--cobbl-thumb-btn-bg);
      transition: var(--cobbl-transition);
      font-size: var(--cobbl-thumb-btn-font-size);
      font-weight: var(--cobbl-thumb-btn-font-weight);
      line-height: var(--cobbl-thumb-btn-line-height);
      color: var(--cobbl-thumb-btn-color);
      white-space: nowrap;
      box-sizing: border-box;
    }

    .cobbl-thumb-btn:first-child {
      border-radius: var(--cobbl-thumb-btn-border-radius) 0 0 var(--cobbl-thumb-btn-border-radius);
    }

    .cobbl-thumb-btn:last-child {
      border-radius: 0 var(--cobbl-thumb-btn-border-radius) var(--cobbl-thumb-btn-border-radius) 0;
      margin-left: -1px;
    }

    .cobbl-thumb-btn:hover:not(.cobbl-selected) {
      background: var(--cobbl-thumb-btn-hover-bg);
      color: var(--cobbl-thumb-btn-hover-color);
      z-index: 1;
    }

    .cobbl-thumb-btn.cobbl-selected {
      border-color: var(--cobbl-thumb-btn-selected-border-color);
      background: var(--cobbl-thumb-btn-selected-bg);
      color: var(--cobbl-thumb-btn-selected-color);
      box-shadow: var(--cobbl-thumb-btn-selected-shadow);
      z-index: 2;
    }

    .cobbl-thumb-btn.cobbl-selected svg {
      color: var(--cobbl-thumb-btn-selected-color);
    }

    .cobbl-thumb-btn:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--cobbl-focus-ring-offset) var(--cobbl-bg),
                  0 0 0 calc(var(--cobbl-focus-ring-offset) + var(--cobbl-focus-ring-width)) var(--cobbl-focus-ring-color);
      z-index: 3;
    }

    .cobbl-thumb-btn svg {
      width: var(--cobbl-thumb-btn-icon-size);
      height: var(--cobbl-thumb-btn-icon-size);
    }

    /* ========== Textarea ========== */
    .cobbl-textarea {
      display: block;
      width: 100%;
      min-height: var(--cobbl-textarea-min-height);
      padding: var(--cobbl-textarea-padding);
      border: var(--cobbl-textarea-border);
      border-radius: var(--cobbl-textarea-border-radius);
      resize: vertical;
      font-family: var(--cobbl-font);
      font-size: var(--cobbl-textarea-font-size);
      line-height: var(--cobbl-line-height);
      color: var(--cobbl-textarea-color);
      background: var(--cobbl-textarea-bg);
      transition: var(--cobbl-transition);
    }

    .cobbl-textarea:focus {
      outline: none;
      border-color: var(--cobbl-textarea-focus-border-color);
      box-shadow: 0 0 0 var(--cobbl-focus-ring-width) var(--cobbl-focus-ring-color);
    }

    .cobbl-textarea::placeholder {
      color: var(--cobbl-textarea-placeholder-color);
    }

    /* ========== Submit Button Container ========== */
    .cobbl-submit-container {
      display: flex;
      justify-content: var(--cobbl-submit-container-justify);
      align-items: var(--cobbl-submit-container-align-items);
      gap: var(--cobbl-submit-container-gap);
      margin-top: var(--cobbl-submit-container-margin-top);
    }

    /* ========== Keyboard Hint ========== */
    .cobbl-keyboard-hint {
      font-size: var(--cobbl-keyboard-hint-font-size);
      color: var(--cobbl-keyboard-hint-color);
      opacity: var(--cobbl-keyboard-hint-opacity-hidden);
      transition: var(--cobbl-keyboard-hint-transition);
      white-space: nowrap;
    }

    .cobbl-keyboard-hint--visible {
      opacity: var(--cobbl-keyboard-hint-opacity-visible);
    }

    /* ========== Submit Button ========== */
    .cobbl-submit {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--cobbl-submit-width);
      padding: var(--cobbl-submit-padding);
      background: var(--cobbl-submit-bg);
      color: var(--cobbl-submit-color);
      border: var(--cobbl-submit-border);
      border-radius: var(--cobbl-submit-border-radius);
      font-size: var(--cobbl-submit-font-size);
      font-weight: var(--cobbl-submit-font-weight);
      line-height: var(--cobbl-submit-line-height);
      transition: var(--cobbl-transition);
      box-sizing: border-box;
    }

    .cobbl-submit:hover:not(:disabled) {
      background: var(--cobbl-submit-hover-bg);
    }

    .cobbl-submit:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--cobbl-focus-ring-offset) var(--cobbl-bg),
                  0 0 0 calc(var(--cobbl-focus-ring-offset) + var(--cobbl-focus-ring-width)) var(--cobbl-focus-ring-color);
    }

    .cobbl-submit:disabled {
      opacity: var(--cobbl-submit-disabled-opacity);
      cursor: not-allowed;
    }

    /* ========== Error Message ========== */
    .cobbl-error {
      color: var(--cobbl-error-color);
      font-size: var(--cobbl-error-font-size);
      margin-top: var(--cobbl-error-margin-top);
    }

    /* ========== Success State ========== */
    .cobbl-success {
      text-align: center;
      padding: var(--cobbl-success-padding);
    }

    .cobbl-success-icon {
      width: var(--cobbl-success-icon-size);
      height: var(--cobbl-success-icon-size);
      margin: var(--cobbl-success-icon-margin);
      color: var(--cobbl-success-icon-color);
    }

    .cobbl-success-title {
      font-size: var(--cobbl-success-title-font-size);
      font-weight: var(--cobbl-success-title-font-weight);
      color: var(--cobbl-success-title-color);
      margin: var(--cobbl-success-title-margin);
    }

    .cobbl-success-text {
      font-size: var(--cobbl-success-text-font-size);
      color: var(--cobbl-success-text-color);
      margin: 0;
    }

    /* ========== Direct Thumb Triggers (Ghost Button Style) ========== */
    .cobbl-direct-triggers {
      display: inline-flex;
      align-items: center;
      gap: var(--cobbl-direct-triggers-gap);
    }

    .cobbl-direct-thumb {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--cobbl-direct-thumb-size);
      min-height: var(--cobbl-direct-thumb-size);
      padding: var(--cobbl-direct-thumb-padding);
      border-radius: var(--cobbl-direct-thumb-border-radius);
      color: var(--cobbl-direct-thumb-color);
      background: var(--cobbl-direct-thumb-bg);
      transition: var(--cobbl-transition-fast);
    }

    .cobbl-direct-thumb svg {
      width: var(--cobbl-direct-thumb-icon-size);
      height: var(--cobbl-direct-thumb-icon-size);
      flex-shrink: 0;
    }

    .cobbl-direct-thumb:hover:not(.cobbl-submitted) {
      color: var(--cobbl-direct-thumb-hover-color);
      background: var(--cobbl-direct-thumb-hover-bg);
    }

    .cobbl-direct-thumb:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--cobbl-focus-ring-offset) var(--cobbl-bg),
                  0 0 0 calc(var(--cobbl-focus-ring-offset) + var(--cobbl-focus-ring-width)) var(--cobbl-focus-ring-color);
    }

    .cobbl-direct-thumb.cobbl-submitted {
      color: var(--cobbl-direct-thumb-submitted-color);
      background: var(--cobbl-direct-thumb-submitted-bg);
    }

    /* ========== Inline Form (variant='inline') ========== */
    .cobbl-inline-form {
      width: var(--cobbl-inline-width);
    }
`
