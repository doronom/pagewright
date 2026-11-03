---
name: Kinetic Glass Architecture
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dce6'
  primary: '#e0fdff'
  on-primary: '#00373a'
  primary-container: '#00f2fe'
  on-primary-container: '#006a70'
  inverse-primary: '#00696f'
  secondary: '#dcb8ff'
  on-secondary: '#480081'
  secondary-container: '#7701d0'
  on-secondary-container: '#dcb7ff'
  tertiary: '#fff5f5'
  on-tertiary: '#670021'
  tertiary-container: '#ffcfd3'
  on-tertiary-container: '#b91b47'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ff6ff'
  primary-fixed-dim: '#00dce6'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dcb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6700b5'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#ffb2ba'
  on-tertiary-fixed: '#400011'
  on-tertiary-fixed-variant: '#910031'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Space Grotesk
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
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

This design system crafts an electric, hyper-modern personal platform for a QA Automation Engineer & Test Architect. It bridges high-rigor systems engineering with expressive, luminous creative technology. The brand voice feels authoritative yet forward-leaning, surgical yet vivid—demonstrating that automation infrastructure, test harnesses, and CI/CD pipelines can be visual art forms without sacrificing clarity.

### Design Movement: Luminous Cyber-Glass
The aesthetic merges precision Glassmorphism, deep dark-mode minimalism, and controlled chromatic energy:
- **Base Canvas:** Deep abyssal navy/slate substrates (`#090D16`) that swallow harsh light while providing infinite depth.
- **Luminous Chromatics:** Controlled bursts of electric violet, neon cyan, and hot coral that trace key execution flows, code blocks, pass/fail metrics, and interactive triggers.
- **Glass & Frosting:** Multi-layered translucent panels (`rgba` surfaces with progressive background blur) accented by 1px sub-pixel gradient borders.
- **Tactile Technical Feedback:** Soft neon glows (`drop-shadow` / `box-shadow` aura overlays) reserved strictly for active states, metrics highlights, and interactive states to maintain enterprise legibility.

## Colors

The palette balances dark canvas readability with vivid, hyper-saturated engineering beacons:

- **Primary (`#00F2FE` - Hyper Neon Cyan):** Signifies telemetry, active test runners, real-time assertions, and interactive primary actions. High visual resonance against obsidian surfaces.
- **Secondary (`#8A2BE2` - Electric Violet / Indigo):** Forms architectural scaffolding, structural glow backdrops, pipeline stages, and ambient gradient depth.
- **Tertiary (`#FF5376` - Radiant Coral / Amber):** Highlights mission-critical exceptions, architectural breakthroughs, high-impact metrics, and tertiary badges.
- **Neutral (`#0B0F19` - Deep Obsidian Void):** The bedrock surface. Complemented by `#131B2E` for elevated cards, `#1E2942` for structural borders, and `#F1F5F9` for primary typography.
- **Success / Passed (`#10B981`):** Retained for pure green-path automated suite passes and uptime markers.
- **Warning / Flaky (`#F59E0B`):** Dedicated to flakiness thresholds and pending test runs.

### Contrast & Application Rules
- All text overlaid on tinted glass must meet WCAG AAA standards using `#F8FAFC` or `#94A3B8`.
- Luminous glows must never back raw body copy; ambient radial gradients are kept below `25%` opacity when intersecting reading planes.

## Typography

The typographic hierarchy combines three distinct functional voices:
1. **Space Grotesk (Headlines & Architecture Anchors):** Geometric, mechanical, yet full of charismatic angularity. Conveys cutting-edge technological forward momentum.
2. **Inter (Body & Narrative Prose):** Uncompromising clarity, neutral rhythm, and optimized readability across screen sizes for project summaries, architecture whitepapers, and case studies.
3. **JetBrains Mono (Metadata, KPIs, Code, and Badges):** Reinforces the precision of automation frameworks (Playwright, Cypress, Selenium, CI/CD configs) and system metrics.

### Sizing and Fluid Scaling
- Headlines scale down on mobile breakpoints (`display-mobile`, `headline-lg-mobile`) to prevent awkward hyphenation and preserve screen real estate.
- Monospaced labels feature slight letter spacing (`0.02em` - `0.05em`) to emphasize precision in metric cards and technical tag chips.

## Layout & Spacing

The layout utilizes a structured 12-column fluid grid system on desktop and tablet, collapsing to a single-column sequence on mobile devices.

### Breakpoints & Reflow
- **Desktop (1280px+):** Max-width container capped at `1280px` with `margin: 3rem` outer buffer. 12 columns with `gutter: 1.5rem`. Complex dual-column engineering case studies and interactive test architecture diagrams.
- **Tablet (768px - 1279px):** 8-column layout with `gutter: 1.25rem` and `margin: 2rem`. Secondary metrics flow beneath primary overview cards.
- **Mobile (< 768px):** 4-column / single stream stacked layout with `margin-mobile: 1.25rem` and `gutter-mobile: 1rem`. Architecture diagrams convert to swipeable horizontal cards.

### Spacing Rhythm
Component padding follows strict mathematical multiples of `4px` / `8px`:
- Tight groupings (icon to metric): `space-xs` (4px) to `space-sm` (8px).
- Internal card padding: `space-lg` (24px) for desktop, `space-md` (16px) for mobile.
- Section-to-section breaks: `space-xl` (40px) up to dedicated layout section margins (`margin: 3rem`).

## Elevation & Depth

Visual depth is achieved through translucent planar layering, dynamic backdrop blur, and gradient light leak borders rather than traditional dark dropshadows.

### Layering Hierarchy
1. **Canvas Layer (`z-index: 0`):** `#090D16` base canvas layered with two deep ambient radial gradient blurs (`rgba(138, 43, 226, 0.08)` and `rgba(0, 242, 254, 0.05)`).
2. **Structural Glass Layer (`z-index: 10`):** `background: rgba(19, 27, 46, 0.65)` paired with `backdrop-filter: blur(16px)` and a subtle 1px border `rgba(255, 255, 255, 0.08)`.
3. **Elevated Interactive Layer (`z-index: 20`):** `background: rgba(26, 38, 64, 0.75)` with `backdrop-filter: blur(24px)`. Borders transition on hover to dynamic linear gradients (`linear-gradient(135deg, rgba(0, 242, 254, 0.4), rgba(138, 43, 226, 0.4))`).
4. **Active Luminescence (Hover/Focus):** Soft localized aura: `box-shadow: 0 0 24px -4px rgba(0, 242, 254, 0.25)`.
5. **Overlay / Drawer Layer (`z-index: 50`):** `background: rgba(9, 13, 22, 0.85)` with `backdrop-filter: blur(32px)`.

## Shapes

The design system operates at **Level 2 (Rounded)**:
- Base elements (buttons, input fields, test assertion tags): `0.5rem` (8px).
- Cards, code inspection windows, and architecture nodes (`rounded-lg`): `1rem` (16px).
- Modals, prominent hero containers, and feature showcases (`rounded-xl`): `1.5rem` (24px).
- Status indicator pills and execution chips use full pill shapes (`9999px`) to distinguish categorical metadata from structural content cards.

## Components

### Buttons
- **Primary Action (Execute / Get In Touch):** Filled gradient from `#00F2FE` to `#8A2BE2`, high-contrast obsidian text (`#050811`), `font-weight: 600`. Hover delivers an ambient teal bloom (`0 0 20px rgba(0, 242, 254, 0.4)`).
- **Secondary Action (View Framework / GitHub):** Glass surface (`rgba(255, 255, 255, 0.05)`), border `1px solid rgba(0, 242, 254, 0.3)`, text `#F8FAFC`. Hover shifts border to solid `#00F2FE` with subtle internal reflection.
- **Ghost Action (Inspect Artifacts):** Transparent canvas, text `#94A3B8`, hover states transition to `#00F2FE` with an underlined glow.

### Chips & Badges
- **Framework & Skill Badges:** JetBrains Mono, `label-md`. Background `rgba(0, 242, 254, 0.08)`, border `1px solid rgba(0, 242, 254, 0.2)`, text `#00F2FE`.
- **Pass/Fail Pipeline Status Chips:** 
  - Passed: Pill badge, background `rgba(16, 185, 129, 0.12)`, text `#10B981`, pulsing dot beacon.
  - Flaky / Refactor: Pill badge, background `rgba(255, 83, 118, 0.12)`, text `#FF5376`.

### Cards & Architecture Displays
- Translucent backdrop blur with high-fidelity 1px gradient borders (`linear-gradient(to bottom right, rgba(0, 242, 254, 0.2), rgba(138, 43, 226, 0.1), transparent)`).
- Content headers feature an icon enclosure with an inner neon glow.
- Interactive cards elevate by `-2px` on hover with dynamic light border intensifications.

### Lists & Test Case Timelines
- Clean vertical line connectors styled in `rgba(138, 43, 226, 0.3)`.
- List items feature monospaced numerical prefixes (`01`, `02`, `03`) styled in `#00F2FE`.
- Hovering over a list item lights up its corresponding connector point into an active cyan node.

### Input Fields & Terminal Emulators
- Form inputs feature `rgba(11, 15, 25, 0.8)` background with `1px solid #1E2942` borders. Focused states shift to `1px solid #00F2FE` accompanied by `box-shadow: 0 0 12px rgba(0, 242, 254, 0.2)`. Placeholder text set in `#64748B`.
- Integrated terminal components utilize `#070A10` background, a faux macOS traffic-light top bar, and syntax-highlighted automation script previews in JetBrains Mono.

### Checkboxes & Segmented Controls
- Checkboxes feature rounded corners (`4px`), obsidian fills, and borders of `1px solid rgba(255, 255, 255, 0.2)`. Checked state transitions to full `#00F2FE` fill with a deep obsidian check icon.
- Segmented architecture toggles (e.g., *E2E Tests* | *API Mocks* | *Performance*) rely on a sliding frosted-glass pill highlight.