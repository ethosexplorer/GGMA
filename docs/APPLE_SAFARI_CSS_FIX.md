# Apple / Safari CSS Compatibility Fixes

## The Bug: "White Screen" / Missing Dark Green Backgrounds
Users on certain Apple devices (specifically macOS Sequoia with Safari) reported that the custom dark green backgrounds (`#1a4731`, `#0f291c`, etc.) were completely invisible, rendering as transparent "white screens".

## The Cause: Tailwind v4 Arbitrary Hex Values
Tailwind v4 compiles arbitrary hex color classes (e.g., `bg-[#1a4731]`) into modern CSS formats (like `oklch()` or `color-mix()`). Certain Safari versions or strict webkit configurations fail to parse these modern color functions accurately, causing the browser to discard the CSS rule entirely. 

**Important Note:** 
Applying global regex fallbacks using `[class*="bg-blue"]` in `index.html` causes conflicts with Tailwind's opacity modifiers (e.g., `bg-blue-500/20` becomes solid blue). 

## The Solution: Explicit CSS Fallbacks
To fix this without breaking opacity modifiers on other elements, **exact class selectors** must be explicitly defined in `src/index.css`. 

By defining the exact class string, Safari can fall back to standard `background-color` properties when it fails to parse Tailwind's output.

### Required Code (`src/index.css`):
```css
/* ===================================================================
   Safari / iOS Compatibility — Brand Color Fallbacks
   These ensure all custom arbitrary hex branded greens display correctly.
   =================================================================== */

.bg-\[\#1a4731\] { background-color: #1a4731 !important; }
.bg-\[\#0f291c\] { background-color: #0f291c !important; }
.bg-\[\#153a28\] { background-color: #153a28 !important; }
.bg-\[\#0f2d1e\] { background-color: #0f2d1e !important; }
.bg-\[\#2c6e4d\] { background-color: #2c6e4d !important; }
.bg-\[\#A3B18A\] { background-color: #A3B18A !important; }
.bg-\[\#a3b18a\] { background-color: #a3b18a !important; }
.bg-\[\#080e1a\] { background-color: #080e1a !important; }
.bg-\[\#0D6EFD\] { background-color: #0D6EFD !important; }
.text-\[\#1a4731\] { color: #1a4731 !important; }
.text-\[\#3E2723\] { color: #3E2723 !important; }
.text-\[\#A3B18A\] { color: #A3B18A !important; }
.border-\[\#1a4731\] { border-color: #1a4731 !important; }
```

## Summary for Future Developers:
If a user on a Mac or iOS device reports missing background colors or gradients:
1. Identify the Tailwind class failing to render (usually an arbitrary value like `bg-[#HEX]`).
2. Do **not** use wildcard attribute selectors (`[class*="bg-"]`) to fix it.
3. Instead, append the **exact escaped class name** to `src/index.css` with an `!important` hex color fallback.
