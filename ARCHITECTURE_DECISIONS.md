# Architecture Decisions

This document records key architectural decisions made during development.

---

## Decision: Modern Browsers Only (No Legacy Fallback)

**Date:** December 2024

**Status:** ✅ Implemented

### Context

When implementing Shadow DOM with Constructable Stylesheets, we had to decide whether to include a fallback for older browsers (Safari < 16.4, Firefox < 101, Chrome < 73).

### Decision

**Remove the fallback and require modern browsers only.**

### Rationale

1. **MVP Philosophy**
   - Focus on shipping fast and iterating based on real user feedback
   - Avoid over-engineering for edge cases we might not encounter
   - Can always add fallback later if analytics show it's needed

2. **Browser Reality (Dec 2024)**
   - Chrome 73+: ~99% of Chrome users ✅
   - Firefox 101+: ~98% of Firefox users ✅
   - Edge 79+: ~99% of Edge users ✅
   - Safari 16.4+: ~85% of Safari users ⚠️

3. **Target Audience**
   - Building a **developer-focused PromptOps platform**
   - Target users: Engineering teams and technical startups
   - These users overwhelmingly use modern browsers
   - B2B SaaS context (not general consumer product)

4. **Code Complexity**
   - Fallback adds ~70 lines of code
   - Requires maintenance and testing of two code paths
   - Adds ~0.3KB to bundle size
   - Increases cognitive overhead for contributors

5. **Performance Benefits**
   - Constructable Stylesheets are significantly better with multiple widgets
   - 10 widgets = 8KB (shared) vs 80KB (duplicated) of styles
   - Simpler implementation = fewer bugs

### Consequences

**Positive:**

- ✅ Simpler, cleaner codebase
- ✅ Better performance (always uses optimal path)
- ✅ Smaller bundle size (-0.3KB)
- ✅ Easier to maintain and understand
- ✅ Forces users onto modern, secure browsers

**Negative:**

- ❌ ~15% of Safari users on older macOS/iOS won't be supported
- ❌ Some enterprise users with locked-down systems might be affected
- ❌ Need to handle "browser not supported" scenario

### Mitigation

If analytics show significant usage from older browsers:

1. Add browser detection and show friendly error message
2. Consider adding fallback back (code was well-documented)
3. Provide CDN link to older version with fallback

### Monitoring

Track browser support in analytics:

```javascript
const supportsConstructableStylesheets =
  'adoptedStyleSheets' in Document.prototype ||
  'adoptedStyleSheets' in ShadowRoot.prototype

analytics.track('widget_browser_support', {
  supported: supportsConstructableStylesheets,
  userAgent: navigator.userAgent,
})
```

---

## Decision: Shadow DOM for Style Isolation

**Date:** December 2024

**Status:** ✅ Implemented

### Context

Embeddable widgets need style isolation to prevent conflicts with host page styles.

### Options Considered

1. **Global CSS with namespacing** (`#cobbl-feedback-widget .class`)
2. **Shadow DOM with CSS injection**
3. **Shadow DOM with Constructable Stylesheets** ⭐

### Decision

Use **Shadow DOM with Constructable Stylesheets**.

### Rationale

- Complete style isolation (no conflicts with host page)
- CSS variables pierce shadow boundary (allows customization)
- Constructable Stylesheets enable memory-efficient style sharing
- Modern, standard approach used by major platforms

### Trade-offs

- Requires modern browsers (see above decision)
- Slightly more complex than global CSS
- Direct CSS selectors from host page won't work (must use CSS variables)

---

## Decision: 100+ CSS Variables for Customization

**Date:** December 2024

**Status:** ✅ Implemented

### Context

Shadow DOM isolates styles, but users still need customization capabilities.

### Decision

Expose **100+ CSS variables** covering all customizable aspects.

### Rationale

1. **CSS Variables Pierce Shadow Boundary**
   - Only way to customize Shadow DOM styles from host page
   - Standard, well-supported approach

2. **Comprehensive Coverage**
   - Colors, typography, spacing, borders, shadows
   - Component-specific variables (trigger, flyout, buttons, etc.)
   - Users can customize everything without touching our code

3. **Well-Namespaced**
   - All variables prefixed with `--cobbl-`
   - Organized by category
   - Hierarchical (variables reference other variables)

4. **Developer Experience**
   - Easy to discover what can be customized
   - IntelliSense support in editors
   - Documented in `CUSTOMIZATION.md`

### Example

```css
#cobbl-feedback-widget {
  /* Simple customization */
  --cobbl-primary: #0ea5e9;

  /* Granular control */
  --cobbl-trigger-padding: 12px 20px;
  --cobbl-flyout-width: 400px;
}
```

---

## Decision: Three-Way API (Script Tag + Vanilla + React)

**Date:** December 2024

**Status:** ✅ Implemented

### Context

Different users have different integration requirements.

### Decision

Provide **three distinct APIs** that share the same core:

1. **Script Tag** - Auto-mount with data attributes
2. **JavaScript** - Stripe Elements-style API
3. **React** - First-class React support

### Rationale

1. **Maximum Compatibility**
   - Script tag: Works anywhere (WordPress, Webflow, static HTML)
   - Vanilla: Works with any framework (Vue, Svelte, Angular)
   - React: Idiomatic React with proper hooks

2. **Zero Code Duplication**
   - React wraps Vanilla
   - Vanilla uses Core class
   - All render the same Preact component
   - Single source of truth for UI

3. **Industry Standard**
   - Follows patterns from Stripe, Intercom, PostHog
   - Familiar to developers
   - Easy to document and support

### Implementation

```
FeedbackWidget.tsx (Preact UI)
       ↑
       |
   core.ts (Shadow DOM + Styles)
       ↑
       |
  ┌────┼────┐
  |    |    |
Script Vanilla React
```

---

## Decision: MutationObserver for Script Tag (with Attribute Watching)

**Date:** December 2024

**Status:** ✅ Implemented

**Updated:** December 2024 - Added attribute watching for live updates

### Context

Script tag needs to work with dynamically added content (SPAs, AJAX) and allow configuration updates without destroying/recreating widgets.

### Decision

Use **MutationObserver** to watch for:

1. Dynamically added/removed widgets (`childList`)
2. **Attribute changes on widget elements** (`attributes`)

### Rationale

- SPAs often add content after page load
- DOMContentLoaded only fires once
- MutationObserver watches for changes continuously
- Automatically mounts new widgets and cleans up removed ones
- **Attribute watching enables live updates without destroy/recreate**

### Implementation

```typescript
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true, // Watch for attribute changes
  attributeFilter: [
    'data-run-id',
    'data-base-url',
    'data-trigger-button-text',
    'data-position',
  ],
})
```

When attributes change, the observer calls `widget.update(newConfig)` instead of destroying/recreating.

### Benefits

- Works with React, Vue, Angular, etc.
- No manual initialization needed
- Proper cleanup prevents memory leaks
- **Live configuration updates** - just change `data-run-id` and it updates
- Efficient - `attributeFilter` limits callbacks to relevant changes only
- Only mounts on elements with `id="cobbl-feedback-widget"` for simplicity

### Example Usage

```javascript
// Change runId dynamically - widget updates automatically!
const widget = document.getElementById('cobbl-feedback-widget')
widget.setAttribute('data-run-id', 'new-run-id')
```

---

## Decision: Preact (Not React)

**Date:** December 2024

**Status:** ✅ Implemented

### Context

Need a view library for the UI component.

### Decision

Use **Preact** instead of React.

### Rationale

1. **Bundle Size**
   - Preact: ~3KB
   - React: ~40KB
   - 13x smaller!

2. **Compatibility**
   - Preact has React-compatible API
   - Can still export React component wrapper
   - Users don't need to know it's Preact under the hood

3. **Performance**
   - Faster than React for small components
   - Lower memory footprint

### Trade-offs

- Slightly different API in edge cases
- Smaller ecosystem than React
- Not an issue since we're building a self-contained widget

---

## Future Decisions to Make

### 1. TypeScript in JSX

**Question:** Should we use `.tsx` or `.jsx` + JSDoc?

**Current:** Using `.tsx` (TypeScript)

**Revisit:** If build times become an issue

### 2. Internationalization (i18n)

**Question:** How to support multiple languages?

**Current:** Hardcoded English strings

**Options:**

- Add `data-lang="en"` attribute
- Let users override strings via props
- Full i18n library (overkill for now)

### 3. Theming System

**Question:** Should we provide pre-built themes?

**Current:** CSS variables only

**Future Options:**

- Theme presets (dark, light, brand-specific)
- Theme builder UI
- Community theme marketplace

### 4. Analytics Integration

**Question:** Should we track widget interactions?

**Current:** No tracking (user can add their own)

**Considerations:**

- Privacy implications
- Opt-in vs opt-out
- What metrics are useful?

---

## References

- [Shadow DOM Spec](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Constructable Stylesheets](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/CSSStyleSheet)
- [Stripe Elements Architecture](https://stripe.com/docs/js)
- [Web Components Best Practices](https://web.dev/custom-elements-best-practices/)
