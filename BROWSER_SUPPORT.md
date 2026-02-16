# Browser Support

## Current Support

The Cobbl Feedback Widget requires modern browsers with Constructable Stylesheets support.

### Minimum Supported Versions

| Browser | Minimum Version | Released     |
| ------- | --------------- | ------------ |
| Chrome  | 73+             | March 2019   |
| Firefox | 101+            | May 2022     |
| Safari  | 16.4+           | March 2023   |
| Edge    | 79+             | January 2020 |

**Decision:** As of late 2024, legacy browser fallback has been removed for MVP simplicity. The widget uses Constructable Stylesheets exclusively for optimal performance.

### Feature Support Matrix

| Feature                       | Chrome | Firefox | Safari | Edge |
| ----------------------------- | ------ | ------- | ------ | ---- |
| **Shadow DOM**                | 53+    | 63+     | 10+    | 79+  |
| **CSS Variables**             | 49+    | 31+     | 9.1+   | 15+  |
| **Constructable Stylesheets** | 73+    | 101+    | 16.4+  | 79+  |

---

## Implementation Details

### Constructable Stylesheets (Memory Efficient)

The widget uses Constructable Stylesheets exclusively:

**Benefits:**

- ✅ **Shared stylesheet** across all widget instances
- ✅ **Lower memory usage** - 10 widgets = ~8KB of styles (not ~80KB)
- ✅ **Faster instantiation** - No DOM parsing per instance
- ✅ **Simpler codebase** - No fallback complexity

**Implementation:**

```typescript
// Create shared stylesheet once
if (!sharedStyleSheet) {
  sharedStyleSheet = new CSSStyleSheet()
  sharedStyleSheet.replaceSync(styles)
}

// Adopt into each shadow root
this.shadow.adoptedStyleSheets = [sharedStyleSheet]
```

---

## Unsupported Browsers

Users on older browsers will see:

- ❌ Widget fails to render (no styles applied)
- ❌ JavaScript error in console
- ❌ No visual feedback

**Who's affected:**

- Safari < 16.4 (~15% of Safari users, mostly older macOS/iOS)
- Firefox < 101 (~2% of Firefox users)
- Chrome < 73 (~1% of Chrome users)

**If this becomes an issue**, you can:

1. Monitor browser analytics
2. Add a polyfill or fallback if needed
3. Show a "Please update your browser" message

---

## Performance Impact

### Memory Usage (10 widgets on one page)

| Browser Tier               | Stylesheet Memory | Total Impact |
| -------------------------- | ----------------- | ------------ |
| **Modern** (Constructable) | ~8KB (shared)     | ✅ 1x        |
| **Legacy** (Fallback)      | ~80KB (10 copies) | ⚠️ 10x       |

### Instantiation Speed

| Browser Tier | Per Widget | 10 Widgets |
| ------------ | ---------- | ---------- |
| **Modern**   | ~1ms       | ~10ms      |
| **Legacy**   | ~2-3ms     | ~25ms      |

**Note:** Performance difference is negligible for 1-3 widgets, but noticeable with 10+ widgets.

---

## Testing

### How to Test Legacy Mode

Force the fallback in modern browsers for testing:

```javascript
// In browser console or test environment
Object.defineProperty(Document.prototype, 'adoptedStyleSheets', {
  value: undefined,
  configurable: true,
})

// Now reload the widget - it will use the fallback
```

### Automated Testing

```javascript
// Test both code paths
describe('Widget Styles', () => {
  it('should use Constructable Stylesheets when supported', () => {
    // Modern browser test
  })

  it('should fallback to <style> element when not supported', () => {
    // Mock lack of support
    delete ShadowRoot.prototype.adoptedStyleSheets
    // Legacy browser test
  })
})
```

---

## Migration Path

### Step 1: Current (2024-2025)

- ✅ Keep fallback for maximum compatibility
- ✅ Monitor browser usage in analytics

### Step 2: Mid 2025

- ⚠️ Deprecate fallback in documentation
- ⚠️ Add console warning for legacy browsers
- 📊 Continue monitoring usage

### Step 3: Late 2025 / Early 2026

- 🗑️ Remove fallback code (follow instructions in `core.ts`)
- 📦 Ship smaller bundle (remove fallback = -0.3KB)
- 🚀 Simpler codebase

---

## FAQs

### Q: What happens in unsupported browsers?

The widget will still work! It uses a fallback that creates a `<style>` element per instance instead of sharing a stylesheet.

### Q: Will the fallback be maintained?

Yes, but it's intentionally simple and well-documented for easy removal when no longer needed.

### Q: Does the fallback affect functionality?

No! The only difference is memory usage with multiple widgets. All features work identically.

### Q: How do I know when to remove the fallback?

Check your analytics. When < 1% of users are on Safari < 16.4 and Firefox < 101, it's safe to remove.

### Q: What's the bundle size impact of the fallback?

About ~0.3KB minified. Not significant, but every byte counts!

---

## Browser Stats (Reference)

As of December 2024:

- **Chrome 73+**: ~99% of Chrome users
- **Firefox 101+**: ~98% of Firefox users
- **Safari 16.4+**: ~85% of Safari users (some on older macOS/iOS)
- **Edge 79+**: ~99% of Edge users

**Recommendation:** Keep fallback for now, plan removal for late 2025.
