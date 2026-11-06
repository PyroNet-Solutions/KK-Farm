# KK Farm design system

The world is Multani kashi glaze: cobalt and turquoise on cool glazed white. It lends type, palette, density and one signature move. Navigation and controls stay standard.

## Signature
**The Herd Wall.** Every goat is one tile, grouped by pen. Tiles hold their place: filters dim, they never reorder. Each goat's portrait is generated from its identity until a real photograph exists.

## Colour (tokens in `apps/kk-farm/resources/css/app.css`)
| Role | Token | Use |
|------|-------|-----|
| Shell | `cobalt-900` | Navigation rail, headings |
| Ground | `glaze`, `tile` | Page, panels |
| Action | `turq-700` | Primary buttons, focus, selection |
| Third data colour | `manganese-600` | Pregnancy |
| State | `ok`, `watch`, `treat`, `crit` | Only where they carry meaning |

Light theme by decision: staff use phones in daylight.

## Type
Hanken Grotesk Variable, self-hosted, tabular figures. Fixed rem scale.

## Shape and depth
6px tile radius, 1px rules, soft offset shadow. No gradients on data, no glass, no eyebrow labels.

## Motion
150 to 250 ms, exponential ease-out, state changes only. `prefers-reduced-motion` is honoured through `MotionConfig` and a global CSS rule.

## Components
`resources/js/components/ui.tsx`: Button, Panel, Stat, Chip, Field, Tabs, Empty, Note. Touch targets are at least 44px.
