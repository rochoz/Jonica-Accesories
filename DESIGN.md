# Jónica visual system

## Direction
Editorial minimalism with a quiet-luxury tone. Prioritize clear product photography, calm negative space, restrained borders, and simple navigation. Do not add promotional claims or decorative luxury cues that are not supported by the brand.

## Foundations

| Role | Token | Value | Use |
|---|---|---|---|
| Main canvas | `--ivory` | `#F8F5EF` | Page background |
| Secondary surface | `--sand` | `#EAE2D6` | Contact and disabled actions |
| Accent | `--champagne` | `#C9B69E` | Fine details only; not small text |
| Secondary tone | `--taupe` | `#8C7560` | Decorative details |
| Primary text | `--ink` | `#302820` | Headings, body, primary actions |
| White surface | `--white` | `#FFFFFF` | Product labels and open space |
| Muted text | `--text-muted` | `#62564B` | Secondary text with readable contrast |

`style.css` and `styles.css` keep independent, equivalent token blocks. Update both when changing shared tokens.

## Typography
- Display: Cormorant Garamond 400–600 for editorial headings.
- Interface and product information: DM Sans 400–700.
- Body copy starts at 16px; product names and prices at 14px; functional controls at 11px or larger.
- Use balanced headings and readable line lengths. Keep product prices tabular where supported.

## Layout and components
- Content maximum: 1280px; page gutters scale from 20px to 76px.
- Home hero: static split composition with the existing light collection photograph.
- Catalog hero: static copy-and-photograph composition using an existing asset.
- Product cards: unframed, square photography followed by name, price, availability, and consultation action. Single-column on mobile, two columns on tablet, three on wide desktop.
- Navigation categories may stick while scrolling; the main header remains in normal flow to avoid a double-height sticky stack on mobile.
- Footer retains the existing monogram pending brand confirmation.

## Interaction and accessibility
- Strong visible `:focus-visible` outline; links and controls remain keyboard reachable according to their existing business state.
- Disabled inquiry controls remain disabled and legible; do not infer or update stock.
- Respect `prefers-reduced-motion`; transitions are short and nonessential.
- Use text with 4.5:1 contrast where practical, meaningful image alternatives, semantic landmarks, and a visible active state.

## Open validation items
- Confirm the public spelling/name and the footer monogram.
- Confirm whether the existing collection photographs correspond to the products shown.
- Verify current availability; the markup is preserved as supplied.
