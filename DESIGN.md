# Finantalyst Design System — "Obsidian Ledger"

**Single source of truth for all UI styling decisions. All components must stay consistent with this document.**

---

## Identity

**Mood:** Futuristic premium trust. Bloomberg Terminal × Linear × CRED.  
**Tagline:** "Your AI CFO."  
**Feel benchmarks:** Brex (calm dense data), Mercury (trust), Stripe Dashboard (density without clutter), Linear (speed), CRED (premium delight).

---

## Color Palette

All colors expressed as CSS custom properties in `globals.css`.

| Token | Value | Usage |
|---|---|---|
| `--color-base` | `#0A0B0F` | Page background |
| `--color-surface` | `#111318` | Card / panel base |
| `--color-surface-raised` | `#16181F` | Elevated card, dropdown |
| `--color-surface-overlay` | `rgba(17,19,24,0.92)` | Modal overlays, tooltips |
| `--color-glass` | `rgba(255,255,255,0.04)` | Glassmorphism fill |
| `--color-border` | `rgba(255,255,255,0.08)` | Default border |
| `--color-border-strong` | `rgba(255,255,255,0.14)` | Hover / focus borders |
| `--color-indigo` | `#6366F1` | Primary brand / CTA |
| `--color-indigo-dim` | `rgba(99,102,241,0.15)` | Indigo tinted surfaces |
| `--color-emerald` | `#10B981` | Money positive / CFO |
| `--color-emerald-dim` | `rgba(16,185,129,0.12)` | Emerald tinted surfaces |
| `--color-amber` | `#F59E0B` | Tax / compliance / attention |
| `--color-amber-dim` | `rgba(245,158,11,0.12)` | Amber tinted surfaces |
| `--color-red` | `#EF4444` | Danger / loss / error |
| `--color-red-dim` | `rgba(239,68,68,0.12)` | Red tinted surfaces |
| `--color-text-primary` | `#F1F5F9` | Primary text |
| `--color-text-secondary` | `#94A3B8` | Secondary / muted text |
| `--color-text-tertiary` | `#64748B` | Placeholder / disabled |

---

## Typography

```css
/* Fonts loaded via next/font or Google Fonts */
--font-sans: 'Inter', system-ui, sans-serif;   /* all UI text */
--font-mono: 'JetBrains Mono', monospace;      /* ledger, code, TXN IDs */
```

| Scale | Size / Weight | Usage |
|---|---|---|
| `text-hero` | 48px / 700 | Landing headline |
| `text-display` | 32px / 700 | Page titles |
| `text-heading` | 20px / 600 | Section headings |
| `text-subheading` | 14px / 600 uppercase, ls 0.08em | Widget labels |
| `text-body` | 15px / 400 | Default body |
| `text-small` | 13px / 400 | Secondary info |
| `text-micro` | 11px / 500 | Badges, chips |
| `text-number-xl` | 36px / 700, mono | Hero financial figures |
| `text-number-lg` | 24px / 600, mono | Dashboard stats |
| `text-number-md` | 18px / 600, mono | In-card figures |
| `text-number-sm` | 14px / 500, mono | Table values |

**Rule:** financial numbers always use `font-mono`. Plain-language text uses `font-sans`.

---

## Glass Card Recipe (primary surface)

```css
.glass-card {
  background: var(--color-glass);
  backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset;
}
```

**Variants:**
- `.glass-card--raised` — adds `border-color: var(--color-border-strong)` + stronger shadow
- `.glass-card--accent-indigo` — adds `box-shadow: 0 0 0 1px var(--color-indigo) inset`
- `.glass-card--accent-emerald` — same with emerald
- `.glass-card--accent-amber` — same with amber

---

## Motion

Use Framer Motion. Follow these timing conventions:

| Interaction | Curve | Duration |
|---|---|---|
| Panel open/close | `spring { stiffness: 280, damping: 28 }` | — |
| Page transition | `easeOut` | 220ms |
| Micro (hover, press) | `easeOut` | 120ms |
| Number count-up | `easeOut` | 800ms |
| Toast / notification in | `spring { stiffness: 400, damping: 30 }` | — |

**Trust moments** (balance display, tax filing, trade confirm): NO decorative motion. Instant value reveal, no flash/pulse. Clarity first.

---

## Component Specifications

### GlassCard
```
background: glass recipe above
padding: 24px
border-radius: 16px
```

### Button — Primary
```
bg: --color-indigo
text: white, 14px/600
padding: 10px 20px
border-radius: 10px
hover: brightness 1.1, translateY -1px
active: brightness 0.95, translateY 0
```

### Button — Secondary
```
bg: transparent
border: 1px solid --color-border-strong
text: --color-text-primary
hover: bg rgba(255,255,255,0.06)
```

### Button — Ghost
```
bg: transparent
text: --color-text-secondary
hover: text --color-text-primary, bg rgba(255,255,255,0.04)
```

### Badge
```
padding: 3px 8px
border-radius: 999px
font: 11px/500
variants: indigo | emerald | amber | red | neutral
```

### Stat Widget
```
label: text-subheading, text-tertiary
value: text-number-lg or text-number-xl
delta: text-small, emerald (positive) or red (negative)
```

---

## Mode Color Accents

Each user mode has a primary accent applied to nav indicator and hero widgets.

| Mode | Accent | Rationale |
|---|---|---|
| Individual | Indigo | Calm, personal |
| Freelancer | Emerald | Money, growth |
| Business | Amber | Attention, scale |
| Startup | Indigo + Emerald gradient | Ambition, velocity |

---

## Approval Inbox Card

The core agent interaction surface. Must always feel like a "review before you sign" moment — trustworthy, clear, not flashy.

```
Card: glass-card--raised
Header: action type badge (amber) + created time
Body: draft content in user's voice (text-body)
Figures box: bg surface-raised, mono font, each figure with [engine] citation
Rationale: text-small, text-secondary, italic
Footer: Approve (primary/emerald) | Edit (secondary) | Dismiss (ghost/red)
```

---

## Responsive Strategy

- Mobile: single-column stack, bottom nav
- Tablet (768px+): sidebar collapsed (icon-only), 2-col dashboard
- Desktop (1280px+): sidebar expanded (240px), multi-col dashboard widgets

---

## Regulated Action Indicators

Actions marked `isRegulated: true` in AgentAction must display:
- Amber shield icon + "Needs licensed partner" label
- Disabled Approve button until a licensed partner is configured
- Tooltip: "This action requires a SEBI-registered / licensed partner. See SETUP.md."

---

## Iconography

Use Lucide React throughout. No mixing icon libraries.

Key icons:
- CFO brain: `BrainCircuit`
- Tax/CA: `FileText` or `Receipt`
- Portfolio: `TrendingUp`
- Invoicing: `FilePlus`
- Compliance: `ShieldCheck`
- Agent action: `Sparkles`
- Approval: `CheckCircle`
- Dismiss: `XCircle`
- Warning/regulated: `ShieldAlert`
- Mode: `User` (Individual) | `Briefcase` (Freelancer) | `Building2` (Business) | `Rocket` (Startup)
