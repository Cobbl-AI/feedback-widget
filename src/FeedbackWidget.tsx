/** @jsxImportSource preact */

import { useState, useEffect, useRef, useCallback } from 'preact/hooks'
import type { Helpful, FeedbackWidgetConfig, WidgetState } from './types'
import { ThumbsUpIcon, ThumbsDownIcon, CheckCircleIcon, XIcon } from './icons'

/** Detect if running on macOS or iOS */
export const isMacLike = (): boolean => {
  if (typeof navigator === 'undefined') return false

  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ??
    navigator.platform ??
    ''

  // This catches macOS + iPadOS reporting as "MacIntel" sometimes.
  return /mac|iphone|ipad|ipod/i.test(platform)
}

export interface FeedbackWidgetProps extends FeedbackWidgetConfig {}

// ============================================================================
// Sub-Components (for code reuse)
// ============================================================================

interface ThumbsButtonsProps {
  helpful: Helpful | null
  onThumbClick: (helpful: Helpful) => void
}

/** Reusable thumbs up/down button group */
const ThumbsButtons = ({ helpful, onThumbClick }: ThumbsButtonsProps) => (
  <div class="cobbl-thumbs">
    <button
      class={`cobbl-thumb-btn ${helpful === 'helpful' ? 'cobbl-selected' : ''}`}
      onClick={() => onThumbClick('helpful')}
      type="button"
    >
      <ThumbsUpIcon />
      Yes
    </button>
    <button
      class={`cobbl-thumb-btn ${helpful === 'not_helpful' ? 'cobbl-selected' : ''}`}
      onClick={() => onThumbClick('not_helpful')}
      type="button"
    >
      <ThumbsDownIcon />
      No
    </button>
  </div>
)

/** Reusable success message */
const SuccessMessage = () => (
  <div class="cobbl-success">
    <div class="cobbl-success-icon">
      <CheckCircleIcon />
    </div>
    <h3 class="cobbl-success-title">Thank you!</h3>
    <p class="cobbl-success-text">Your feedback has been submitted.</p>
  </div>
)

interface FeedbackFormProps {
  helpful: Helpful | null
  feedback: string
  isSubmitting: boolean
  error: string | null
  onThumbClick: (helpful: Helpful) => void
  onFeedbackChange: (e: Event) => void
  onSubmit: () => void
  onClose?: () => void
}

/** Reusable feedback form (thumbs + textarea + submit) */
const FeedbackForm = ({
  helpful,
  feedback,
  isSubmitting,
  error,
  onThumbClick,
  onFeedbackChange,
  onSubmit,
  onClose,
}: FeedbackFormProps) => {
  const [isTextareaFocused, setIsTextareaFocused] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
      const isCmdOrCtrl = isMacLike() ? e.metaKey : e.ctrlKey
      if (isCmdOrCtrl && e.key === 'Enter') {
        e.preventDefault()
        // Only submit if the form is valid and not already submitting
        if (!isSubmitting && (helpful || feedback.trim())) {
          onSubmit()
        }
      }
    },
    [isSubmitting, helpful, feedback, onSubmit]
  )

  const handleFormSubmit = (e: Event) => {
    e.preventDefault()
    onSubmit()
  }

  const keyboardHintText = isMacLike()
    ? '\u2318 + Enter to send'
    : 'Ctrl + Enter to send'

  return (
    <form onSubmit={handleFormSubmit}>
      <div class="cobbl-header">
        <p class="cobbl-question">Was this response helpful?</p>
        {onClose && (
          <button
            class="cobbl-close"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <XIcon />
          </button>
        )}
      </div>

      <ThumbsButtons helpful={helpful} onThumbClick={onThumbClick} />

      <textarea
        class="cobbl-textarea"
        placeholder="Tell us more about your experience..."
        value={feedback}
        onInput={onFeedbackChange}
        onFocus={() => setIsTextareaFocused(true)}
        onBlur={() => setIsTextareaFocused(false)}
        onKeyDown={handleKeyDown}
      />

      <div class="cobbl-submit-container">
        <span
          class={`cobbl-keyboard-hint ${isTextareaFocused ? 'cobbl-keyboard-hint--visible' : ''}`}
        >
          {keyboardHintText}
        </span>
        <button
          class="cobbl-submit"
          disabled={isSubmitting || (!helpful && !feedback.trim())}
          type="submit"
        >
          {isSubmitting ? 'Submitting...' : 'Send'}
        </button>
      </div>

      {error && <p class="cobbl-error">{error}</p>}
    </form>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export const FeedbackWidget = ({
  runId,
  variant = 'trigger',
  baseUrl = 'https://api.cobbl.ai',
  onSuccess,
  onError,
  triggerButtonText = 'Give Feedback',
  position = 'bottom-right',
  demo = false,
  colorScheme = 'auto',
}: FeedbackWidgetProps) => {
  const [state, setState] = useState<WidgetState>({
    isOpen: false,
    helpful: null,
    feedback: '',
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    feedbackId: null,
    pendingCreate: null,
  })

  // Use ref to track latest pendingCreate promise to avoid stale closure issues
  const pendingCreateRef = useRef<Promise<string> | null>(null)
  // Use ref to track feedbackId synchronously (avoids stale closure issues with state)
  const feedbackIdRef = useRef<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)

  // Track dynamic position adjustments for collision detection
  const [positionStyle, setPositionStyle] = useState<{
    transform?: string
  }>({})

  // Set data-color-scheme attribute on the shadow host element
  useEffect(() => {
    if (!containerRef.current) return

    // Get the shadow root and then the host element
    const rootNode = containerRef.current.getRootNode()
    if (
      rootNode instanceof ShadowRoot &&
      rootNode.host instanceof HTMLElement
    ) {
      rootNode.host.setAttribute('data-color-scheme', colorScheme)
    }
  }, [colorScheme])

  const handleToggle = () => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen, error: null }))
  }

  const handleClose = () => {
    setState((prev) => ({ ...prev, isOpen: false, error: null }))
    setPositionStyle({})
  }

  /**
   * Create feedback on the backend
   * Returns a promise that resolves to the feedback ID
   */
  const createFeedback = async (
    helpful: Helpful | null,
    userFeedback?: string
  ): Promise<string> => {
    // In demo mode, return a mock feedback ID
    if (demo) {
      return `demo-feedback-${Date.now()}`
    }

    const body: { runId: string; helpful?: Helpful; userFeedback?: string } = {
      runId,
    }

    if (helpful) {
      body.helpful = helpful
    }

    if (userFeedback) {
      body.userFeedback = userFeedback
    }

    const response = await fetch(`${baseUrl}/public/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }

    const result = (await response.json()) as {
      id: string
      message: string
    }

    return result.id
  }

  /**
   * Update existing feedback on the backend
   */
  const updateFeedback = async (
    feedbackId: string,
    update: { helpful?: Helpful; userFeedback?: string }
  ): Promise<void> => {
    // In demo mode, skip the actual API call
    if (demo) {
      return
    }

    const response = await fetch(
      `${baseUrl}/public/v1/feedback/${feedbackId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      )
    }
  }

  /**
   * Handle thumb click within the form (to change the selection)
   */
  const handleThumbClick = (helpful: Helpful) => {
    // Update UI immediately (non-blocking)
    setState((prev) => ({ ...prev, helpful, error: null }))

    // If we already have a feedback ID, update it (check ref first, then state for safety)
    const existingFeedbackId = feedbackIdRef.current || state.feedbackId
    if (existingFeedbackId) {
      // Fire and forget - update in background
      updateFeedback(existingFeedbackId, { helpful }).catch((err) => {
        // Silently handle error for background update
        // The user can still submit, which will retry
        console.warn('Failed to update feedback:', err)
      })
      return
    }

    // If there's already a pending create, we need to wait for it and then update
    if (pendingCreateRef.current) {
      pendingCreateRef.current
        .then((feedbackId) => {
          return updateFeedback(feedbackId, { helpful })
        })
        .catch((err) => {
          console.warn('Failed to update feedback after pending create:', err)
        })
      return
    }

    // Create new feedback - track the promise for queuing
    const createPromise = createFeedback(helpful)
      .then((feedbackId) => {
        // Update ref immediately (sync) so subsequent calls see it
        feedbackIdRef.current = feedbackId
        setState((prev) => ({
          ...prev,
          feedbackId,
          pendingCreate: null,
        }))
        return feedbackId
      })
      .catch((err) => {
        // Clear pending state on error
        setState((prev) => ({ ...prev, pendingCreate: null }))
        pendingCreateRef.current = null
        console.warn('Failed to create feedback:', err)
        throw err
      })

    // Store the promise for potential queuing
    pendingCreateRef.current = createPromise
    setState((prev) => ({ ...prev, pendingCreate: createPromise }))
  }

  /**
   * Handle thumbs variant thumb button click (variant='thumbs')
   * This immediately creates feedback AND opens the popover
   */
  const handleThumbsVariantClick = async (helpful: Helpful) => {
    // Update UI immediately - open popover and set helpful
    setState((prev) => ({
      ...prev,
      isOpen: true,
      helpful,
      error: null,
    }))

    // If we already have a feedback ID, update it
    const existingFeedbackId = feedbackIdRef.current || state.feedbackId
    if (existingFeedbackId) {
      try {
        await updateFeedback(existingFeedbackId, { helpful })
      } catch (err) {
        console.warn('Failed to update feedback:', err)
      }
      return
    }

    // If there's already a pending create, wait for it and then update
    if (pendingCreateRef.current) {
      try {
        const feedbackId = await pendingCreateRef.current
        await updateFeedback(feedbackId, { helpful })
      } catch (err) {
        console.warn('Failed to update feedback after pending create:', err)
      }
      return
    }

    // Create new feedback immediately (so it registers even if user closes popover)
    const createPromise = (async () => {
      try {
        const feedbackId = await createFeedback(helpful)
        feedbackIdRef.current = feedbackId
        setState((prev) => ({
          ...prev,
          feedbackId,
          pendingCreate: null,
        }))
        return feedbackId
      } catch (err) {
        setState((prev) => ({ ...prev, pendingCreate: null }))
        pendingCreateRef.current = null
        console.warn('Failed to create feedback:', err)
        throw err
      }
    })()

    pendingCreateRef.current = createPromise
    setState((prev) => ({ ...prev, pendingCreate: createPromise }))
  }

  const handleFeedbackChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    setState((prev) => ({ ...prev, feedback: target.value, error: null }))
  }

  const handleSubmit = async () => {
    // Require at least one of: helpful rating or feedback text
    if (!state.helpful && !state.feedback.trim()) {
      setState((prev) => ({
        ...prev,
        error: 'Please select a rating or provide feedback',
      }))
      return
    }

    setState((prev) => ({ ...prev, isSubmitting: true, error: null }))

    try {
      // Check ref first (always current), then fall back to state
      let feedbackId = feedbackIdRef.current || state.feedbackId

      // If there's a pending create and we don't have a feedbackId yet, wait for it
      if (pendingCreateRef.current && !feedbackId) {
        try {
          feedbackId = await pendingCreateRef.current
        } catch {
          // Create failed, we'll create fresh below
          feedbackId = null
        }
      }

      if (feedbackId) {
        // Update existing feedback with the user feedback text
        const updateData: { helpful?: Helpful; userFeedback?: string } = {}
        if (state.helpful) {
          updateData.helpful = state.helpful
        }
        if (state.feedback.trim()) {
          updateData.userFeedback = state.feedback.trim()
        }
        await updateFeedback(feedbackId, updateData)

        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
        }))

        onSuccess?.(feedbackId)
      } else {
        // No existing feedback - create with available data
        const newFeedbackId = await createFeedback(
          state.helpful,
          state.feedback.trim() || undefined
        )

        // Update ref immediately so subsequent calls see it
        feedbackIdRef.current = newFeedbackId
        setState((prev) => ({
          ...prev,
          feedbackId: newFeedbackId,
          isSubmitting: false,
          isSubmitted: true,
        }))

        onSuccess?.(newFeedbackId)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message,
      }))
      onError?.(error)
    }
  }

  // Handle collision detection and position adjustments (only for flyout variants)
  useEffect(() => {
    if (variant === 'inline') return // No flyout for inline variant
    if (!state.isOpen || !flyoutRef.current) return

    let rafId: number | null = null

    const adjustPosition = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const flyout = flyoutRef.current
        if (!flyout) return

        // Get base transform from CSS (for centered positions like 'top', 'bottom', 'left', 'right')
        const computedStyle = window.getComputedStyle(flyout)
        const baseTransform = computedStyle.transform

        // Temporarily remove inline transform to get natural position with CSS transform only
        const currentInlineTransform = flyout.style.transform
        flyout.style.transform = ''

        const rect = flyout.getBoundingClientRect()

        // Restore inline transform
        flyout.style.transform = currentInlineTransform

        const viewport = {
          width: window.innerWidth,
        }

        const margin = 8 // Minimum margin from viewport edge
        let translateX = 0

        // Check horizontal overflow only (user can scroll vertically)
        if (rect.right > viewport.width - margin) {
          // Overflowing right edge
          translateX = viewport.width - margin - rect.right
        } else if (rect.left < margin) {
          // Overflowing left edge
          translateX = margin - rect.left
        }

        // Compose transforms: preserve CSS transform and add collision adjustment
        let transform = ''
        if (baseTransform && baseTransform !== 'none') {
          // Keep the base transform and add horizontal collision adjustment only
          transform = `${baseTransform} translate(${translateX}px, 0px)`
        } else {
          // No base transform, just use horizontal collision adjustment
          transform = `translate(${translateX}px, 0px)`
        }

        setPositionStyle({ transform })
      })
    }

    // Adjust position immediately and on scroll/resize
    adjustPosition()
    window.addEventListener('scroll', adjustPosition, true)
    window.addEventListener('resize', adjustPosition)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', adjustPosition, true)
      window.removeEventListener('resize', adjustPosition)
    }
  }, [state.isOpen, position, variant])

  // Handle clicks outside the widget to close the flyout (only for flyout variants)
  useEffect(() => {
    if (variant === 'inline') return // No flyout for inline variant
    if (!state.isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      // Use composedPath to properly handle Shadow DOM
      const path = event.composedPath()

      // Check if any element in the path is our container
      const clickedInside = path.some((el) => el === containerRef.current)

      if (!clickedInside) {
        handleClose()
      }
    }

    // Add listener with a slight delay to avoid closing immediately on open
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [state.isOpen, variant])

  const getFlyoutClassName = () => {
    const positionClass = `cobbl-${position}`
    return `cobbl-flyout ${positionClass}`
  }

  // Render inline variant (full form, no flyout)
  if (variant === 'inline') {
    return (
      <div ref={containerRef} class="cobbl-inline-form">
        {state.isSubmitted ? (
          <SuccessMessage />
        ) : (
          <FeedbackForm
            helpful={state.helpful}
            feedback={state.feedback}
            isSubmitting={state.isSubmitting}
            error={state.error}
            onThumbClick={handleThumbClick}
            onFeedbackChange={handleFeedbackChange}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    )
  }

  // Render trigger and thumbs variants (with flyout)
  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: variant === 'thumbs' ? 'inline-flex' : 'inline-block',
      }}
    >
      {variant === 'thumbs' ? (
        <div class="cobbl-direct-triggers">
          <button
            class={`cobbl-direct-thumb ${state.helpful === 'helpful' ? 'cobbl-submitted' : ''}`}
            onClick={() => handleThumbsVariantClick('helpful')}
            type="button"
            aria-label="Helpful"
          >
            <ThumbsUpIcon />
          </button>
          <button
            class={`cobbl-direct-thumb ${state.helpful === 'not_helpful' ? 'cobbl-submitted' : ''}`}
            onClick={() => handleThumbsVariantClick('not_helpful')}
            type="button"
            aria-label="Not helpful"
          >
            <ThumbsDownIcon />
          </button>
        </div>
      ) : (
        <button class="cobbl-trigger" onClick={handleToggle} type="button">
          {triggerButtonText}
        </button>
      )}

      {state.isOpen && (
        <div ref={flyoutRef} class={getFlyoutClassName()} style={positionStyle}>
          {state.isSubmitted ? (
            <SuccessMessage />
          ) : (
            <FeedbackForm
              helpful={state.helpful}
              feedback={state.feedback}
              isSubmitting={state.isSubmitting}
              error={state.error}
              onThumbClick={handleThumbClick}
              onFeedbackChange={handleFeedbackChange}
              onSubmit={handleSubmit}
              onClose={handleClose}
            />
          )}
        </div>
      )}
    </div>
  )
}
