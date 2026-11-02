---
name: Editorial Test Architecture
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bcc9c6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#879391'
  outline-variant: '#3d4947'
  surface-tint: '#6bd8cb'
  primary: '#6bd8cb'
  on-primary: '#003732'
  primary-container: '#29a195'
  on-primary-container: '#00302b'
  inverse-primary: '#006a61'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: '1.15'
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.875rem
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: '1.45'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.75'
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.7'
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 0.875em
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.65'
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an editorial-technical aesthetic calibrated for deep technical comprehension and zero cognitive fatigue. Built specifically for long-form engineering essays, Playwright architecture guides, and test harness documentation, the visual language balances the composure of an architectural monograph with the mechanical precision of developer tooling.

### Personality & Emotional Tenor
- **Composed & Authoritative:** Quiet confidence achieved through deliberate white space, disciplined hierarchy, and the avoidance of decorative fluff.
- **Mechanically Precise:** Crisp structural alignments, meticulous monospaced tabular data, and explicit structural framing.
- **Distraction-Free:** Optimized for extended 45-minute reading sessions, where typographical cadence and contrast take precedence over decorative visuals.

### Style Archetype
A disciplined hybrid of **Minimalist Editorial** and **Modern Developer Tooling**. Surfaces are flat, structured with ultra-fine hair-thin borders rather than elevated drop shadows. The design system uses micro-details—such as syntax-colored file badges, subtle terminal frames, and distinct test execution indicators—to inject authentic developer character into an otherwise quiet reading canvas.

## Colors

The palette employs a dark-first foundation grounded in slate and charcoal neutrals with a balanced, warm undertone to soften harsh glare. Functional syntax accents (teal/emerald, indigo/cyan, amber, rose) punctuate technical copy and provide instant semantic clarity.

### Color Roles

#### Canvas & Neutrals
- **Canvas Base (`#0B0F19`):** Deep charcoal slate, avoiding eye fatigue compared to pure `#000000`.
- **Surface Elevated (`#111827`):** Card panels, code block bodies, and persistent nav elements.
- **Surface Inset (`#080C14`):** Line numbering gutters, terminal canvas, and subtle recessed containers.
- **Borders & Dividers (`#1E293B`):** Low-contrast architectural hair-thin lines separating content clusters.
- **Border Subtle (`#334155`):** Interactive element borders on hover, active tabs, and focused controls.
- **Text Primary (`#F8FAFC`):** Maximum-contrast copy exceeding WCAG AAA for technical long-form body text.
- **Text Secondary (`#94A3B8`):** Captions, secondary metadata, line numbers, and author notes.
- **Text Tertiary (`#64748B`):** Disabled states, structural bracket annotations, and inactive tab headers.

#### Functional & Semantic Colors
- **Primary / Success (`#0D9488` teal / `#10B981` emerald):** Playwright test passes, assertions confirmed, active links, primary CTA states.
- **Secondary / Architecture (`#6366F1` indigo / `#06B6D4` cyan):** Playwright fixtures, page objects, API routes, and syntax tokens.
- **Warning / Tip (`#F59E0B` amber):** Flaky test notices, timeouts, execution warnings, and advisory callouts.
- **Destructive / Error (`#F43F5E` rose):** Test failure traces, assertions broken, deprecation alerts.

### Light Mode Adaptation
When toggled to light mode, the canvas flips to warm paper slate (`#F8FAFC`), surfaces to crisp white (`#FFFFFF`), borders to slate grey (`#E2E8F0`), and text primary to deep charcoal (`#0F172A`). Accent hues shift slightly darker (`#0F766E` teal, `#4F46E5` indigo, `#B45309` amber) to maintain WCAG AA/AAA compliance on light grounds.

## Typography

The typographical engine matches the geometric clarity and approachability of **Plus Jakarta Sans** with the structural fidelity of **JetBrains Mono**.

### Typographic Principles
- **Reading Measure:** Article body prose is strictly constrained to a `65ch` to `75ch` column width to prevent ocular tracking strain across wide desktop monitors.
- **Vertical Rhythm:** Headings enforce a generous `2.25rem` top margin to visibly dissociate subsequent topic sections, followed by an immediate tight `0.75rem` bottom margin binding the heading to its introductory paragraph.
- **Monospace Integration:** Inline code spans use subtle background clipping (`padding: 0.15em 0.35em`) with a 1px border. Technical labels, table headers, test durations, and terminal logs standardize on JetBrains Mono to ground numerical and test data.

## Layout & Spacing

The layout philosophy uses a disciplined **Fixed Editorial Center** with fluid container margins. 

### Grid & Breakpoints
- **Mobile (< 640px):** 1-column fluid stacked layout. Outer horizontal margins are locked to `margin-mobile` (1.25rem). Code blocks span edge-to-edge with negative horizontal margins to maximize terminal width.
- **Tablet (641px - 1024px):** 6-column grid with `1.5rem` gutters. Article contents utilize a 5-column focus with 1 column reserved for collapsible navigation.
- **Desktop (1025px - 1440px):** 12-column grid. Main content column is pinned to a maximum reading container (`75ch` or 768px). Aside regions (Right: Table of Contents, execution metrics; Left: System navigation) stick dynamically in peripheral columns.
- **Wide Screen (> 1440px):** Layout remains centered with a max-width wrapper of `1320px`. Generous canvas margins (`margin`: 3rem) ensure the reading line never stretches into peripheral vision.

### Spacing Scale Utilization
- **`space-xs` (4px):** Internal button icon gaps, status badge dot offsets.
- **`space-sm` (8px):** Chip padding, table cell padding, metadata tags.
- **`space-md` (16px):** Standard card padding, code block gutter offsets, input field interior margins.
- **`space-lg` (24px):** Separation between card groups, callout block interior padding.
- **`space-xl` (40px):** Vertical spacing between major article sections (`h2`, `h3`).

## Elevation & Depth

This design system rejects heavy, dramatic skeuomorphic drops and aggressive blur-heavy elevations. Visual hierarchy is established strictly through **Tonal Layering** paired with **Low-Contrast Outlines**.

### Elevation Scale
- **Base Level (`z-index: 0`):** The default application canvas. Rendered in `#0B0F19`.
- **Layer 1 Surface (`z-index: 1`):** Read-only cards, article containers, and prose content. Neutral surface elevated (`#111827`) bounded by a subtle `1px solid #1E293B` border. Zero shadow.
- **Layer 2 Interactive (`z-index: 2`):** Hovered cards, floating code copy trays, dropdown panels, and test runner inspectors. Elevated (`#1E293B`) backed by a faint, crisp micro-shadow: `0 4px 12px -2px rgba(0, 0, 0, 0.45)`.
- **Layer 3 Overlay (`z-index: 50`):** Modal dialogs, trace viewers, and screenshot comparison lightboxes. Backdrop utilizes an ultra-fine blur: `backdrop-filter: blur(8px); background-color: rgba(11, 15, 25, 0.85)`. Border shifts to `#334155`.

## Shapes

The design system adopts a **Soft Geometric** roundedness factor (`1`). This yields intentional, crisp curvature that echoes clean developer dashboards and CLI tools without appearing childish or bubbly.

### Corner Radii
- **Micro Radii (`0.25rem` / 4px):** Tags, badges, test status pills, inline code spans, and button elements.
- **Medium Radii (`0.5rem` / 8px):** Code blocks, article cards, callout alert containers, and test run trace panels.
- **Large Radii (`0.75rem` / 12px):** Modals, screenshot diff frames, and architecture overview diagrams.
- **Full Pill (`9999px`):** Reserved exclusively for dynamic status pips and live execution badges (e.g., `RUNNING`, `PASSED`).

## Components

All components are engineered with deterministic state indicators, high-contrast typography, and explicit `data-test` attributes to make the portfolio an embodiment of Playwright testability.

### 1. Code Blocks & Terminal Frames
- **Structure:** Two-tier layout consisting of a header panel and a syntax body.
- **Header:** Contains the relative file path (`tests/e2e/auth.spec.ts`) in `label-sm` with a file icon, paired with a right-aligned Copy button.
- **Body:** Recessed `#080C14` background. Left gutter features non-selectable line numbers in `#64748B`. Line-highlighting states introduce a `rgba(13, 148, 136, 0.12)` horizontal bar with a `2px solid #0D9488` left border.
- **Test Automation Hook:** `data-test="code-block"`, `data-test-file="auth.spec.ts"`, `data-test-action="copy-code"`.

### 2. Test Status Badges & Live Indicators
- **Variants:**
  - **Passed:** Green tint (`#064E3B` background, `#10B981` text, `#047857` border).
  - **Failed:** Red tint (`#4C0519` background, `#F43F5E` text, `#BE123C` border).
  - **Flaky / Retrying:** Amber tint (`#451A03` background, `#F59E0B` text, `#B45309` border).
  - **Running:** Indigo tint with a pulsing SVG ring dot.
- **Format:** Monospace uppercase `label-sm`, horizontal padding `0.5rem`, vertical padding `0.2rem`, radius `0.25rem`.
- **Test Automation Hook:** `data-test="status-badge"`, `data-test-status="passed|failed|flaky|running"`.

### 3. Callout Boxes
- **Types:** `note` (cyan/slate), `tip` (emerald), `warning` (amber).
- **Structure:** Solid background at 8% opacity of the accent hue. A distinct `3px` solid accent bar on the left edge.
- **Typography:** An icon paired with a bold monospaced category label (e.g., `[PLAYWRIGHT BEST PRACTICE]`) above standard `body-md` copy.
- **Test Automation Hook:** `data-test="callout"`, `data-test-type="note|tip|warning"`.

### 4. Interactive Architecture Diagrams & Trace Frames
- **Container:** Structural card with a 1px border (`#1E293B`), centered SVG/Mermaid diagrams, and an integrated bottom caption strip.
- **Caption Strip:** Displays figure number, file origin, or architecture layer in `label-sm`.
- **Zoom / Pan Actions:** Floating top-right control toolbar with icons for toggle full-width, reset zoom, and open raw SVG.
- **Test Automation Hook:** `data-test="diagram-frame"`, `data-test-caption="figure-1"`.

### 5. Buttons & Interactive Controls
- **Primary:** Background `#0D9488`, text `#FFFFFF`, hover `#0F766E`, focus ring `2px solid #14B8A6` with a 2px offset.
- **Secondary / Ghost:** Transparent background, border `1px solid #334155`, text `#F8FAFC`, hover background `#1E293B`.
- **States:** Active, Hover, Focus-Visible, Disabled (`opacity: 0.4`, cursor not-allowed).
- **Test Automation Hook:** `data-test="btn-primary"`, `data-test="btn-secondary"`.

### 6. Cards & Article Snippets
- **Style:** Background `#111827`, border `1px solid #1E293B`, radius `0.5rem`.
- **Hover Behavior:** Border shifts to `#334155`, title shifts from `#F8FAFC` to `#0D9488`. No physical transform (no vertical displacement/jumping), maintaining a calm reading rhythm.
- **Metadata Group:** Displays publication date, reading duration, and Playwright version compatibility badge in `JetBrains Mono`.
- **Test Automation Hook:** `data-test="article-card"`, `data-test-id="{article-slug}"`.