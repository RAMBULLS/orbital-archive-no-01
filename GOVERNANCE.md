# Orbital Archive No. 01 Governance

This file is binding for AI agents and human contributors working in this repository.

## 1. Authority and package shape

Use this order when sources disagree:

1. `GOVERNANCE.md` — binding system and contribution rules.
2. `tokens/tokens.json` — design-token values.
3. `components/contracts.json` — component vocabulary, states, and allowed depths.
4. `assets/icons/manifest.json` and individual files in `assets/icons/` — native icon metadata and geometry.
5. `docs/AEROSPACE-GRAMMAR.md`, `docs/LAYOUT-UX.md`, and `docs/STYLE_GUIDE.md` — composition and behavior.
6. `examples/` — complete stack-neutral implementation references.
7. `index.html` — standalone visual overview and searchable specimen.

The public package must remain browsable without a framework, server, package manager, or build step. Node.js is used only for optional maintenance and validation scripts.

## 2. Language boundary — read this before naming anything

Every proper noun in this system — token names (`Ignition Orange`, `Signal Teal`), depth names (`Signal`, `Mission`, `Systems`), mode names (`editorial`, `operational`) — is **internal styling vocabulary**, not product copy. It exists to give humans and agents a shared name for a design decision. It is never a word a real user is meant to read on screen.

- Do not write these names into headings, button labels, status text, toasts, empty states, or any other consumer-visible copy. A button that triggers the primary action says what it does ("Launch", "Save changes", "Publish") — it does not say "Ignition."
- Do not invent in-universe flavor text (mission call signs, faux telemetry, "trajectory nominal," countdown clocks) to decorate a real product screen. That is the job of a genuine specimen page (`index.html`, `docs/`), never of application UI built from this system.
- When consuming this file, `tokens/tokens.json`, or `components/contracts.json` to generate an interface, treat every name in them as an **implementation identifier**. Translate it into plain, task-specific copy the way you would translate a variable name like `primaryAction` — never surface the identifier itself.
- If a request asks for UI text and nothing more specific is given, default to plain functional language over thematic language. When in doubt, name the action, not the aesthetic.

## 3. Core operating rule

> Present dramatically. Operate calmly. Scale completely.

- **Signal / Depth 0:** cinematic orientation, identity, one clear invitation.
- **Mission / Depth 1:** calm product work, moderate density, explicit scope.
- **Systems / Depth 2:** diagnostics, low-frequency configuration, dense data, and logs after deliberate entry.
- Never begin an ordinary task at Depth 2.
- Depth 1 and 2 surfaces keep current scope visible. Depth 2 always provides an obvious route back.
- These three names are internal shorthand for how much density and drama a surface earns — see §2. They are never section headers or labels a user reads.

Target roughly 70% usability and 30% personality overall. Change expression by depth rather than applying one ornamental density everywhere.

## 4. Color discipline

- Use semantic tokens before palette tokens.
- Do not introduce pure black, pure white application screens, purple, pink, or magenta.
- **One hue, one job.** No color may carry more than one of these roles at once: primary action, focus/link/active state, priority, success, warning, critical. This is the rule that keeps the system from reading as a single dominant hue — check any new component against it before shipping.
- **Ignition Orange** (`palette.orange`) is the primary action and editorial signal — the brand's dominant hue. It is rationed to one job per surface: the primary button, the hero accent, one chart series. It is not a warning, error, or ambient decoration, and it never fills a background or floods a page.
- **Signal Teal** (`palette.teal`) means active, focused, linked, or selected — the calm system-state color, not the brand color. Narrow role: focus rings, links, toggles, the live/cursor state. It is not the primary action color.
- `palette.relay` is a deprecated compatibility alias for `palette.teal`. New work uses `palette.teal`; the alias remains only to protect v1 consumers and is removed in v2.
- **Mission Gold** means priority and editorial hierarchy.
- **Signal Green** means success, available, or nominal.
- **Alert Rust** means warning, degraded, or attention.
- **Fault Red** means error, critical, or destructive.
- The base field (background, surface, card, muted text) stays desaturated and calm on every surface. Saturated color is a signal, spent deliberately — not the ambient tone of the page.
- Never communicate state through color alone.

## 5. Aerospace geometry

The visual vocabulary is broader than orbit rings. Use horizon profiles, trajectories, plotted vectors, datum crosshairs, leader lines, measurement ticks, calibration rails, coordinate labels, blueprint construction lines, crop marks, and registration marks.

Every mark needs a semantic or compositional job: frame, align, measure, connect, sequence, locate, or establish scale.

### Safe-corridor rule

- Never run decorative lines through paragraphs, headings, form controls, table cells, labels, or primary actions.
- Reserve geometry for margins, panel edges, diagram fields, negative space, or clearly separated illustration zones.
- A curve may lead toward content; it must not make content compete with it.
- Decorative SVGs use `aria-hidden="true"` and do not receive pointer events.
- Remove faux telemetry and labels that do not identify real context.

## 6. Surface texture

Paper grain, blueprint texture, scanlines, phosphor dither, film noise, vignette, and registration artifacts may add tactile character at low contrast.

- Texture belongs behind content and never changes the meaning of a state.
- Keep text and control surfaces readable at normal and reduced contrast conditions.
- Avoid animated noise. Respect `prefers-reduced-motion`.
- Use one or two texture families on a surface, not every effect at once.
- Operational surfaces are calmer than editorial surfaces; Systems surfaces may be finer and denser, not louder.
- **Pixel/retro accents** (dither fills, bitmap-style display type, faint scanlines) are a seasoning, not the base register. Reserve them for titles, primary buttons, and Signal-depth entry moments — never for body copy, dense tables, or anything read for long stretches. See `assets/patterns/phosphor-dither.svg`.

## 7. Components and interaction

- Search `components/contracts.json` before naming or adding a primitive.
- Preserve every declared consumer-visible state when implementing a contract.
- Native semantics come first. Keyboard operation, visible focus, programmatic labels, and error association are required.
- One primary action per decision area. Secondary actions remain visually quiet.
- Tables scroll horizontally on narrow screens instead of crushing columns.
- Dialogs and drawers require focus management and Escape dismissal in implementations that provide them.
- Do not copy a Signal-scale headline into ordinary Mission work.

## 8. Icons and assets

- Search `assets/icons/manifest.json` before adding an icon.
- Native icons cover conventional product vocabulary only. Use a text label or vetted platform/library icon when the concept is not represented.
- Do not invent niche aerospace pictograms merely to match the theme.
- Native icons use a 24 × 24 artboard, 1.5-pixel default stroke, round caps and joins, and `currentColor`.
- Review changed geometry at 16, 20, 24, 32, and 48 pixels.
- Decorative icons are hidden from assistive technology. Meaningful icons and icon-only controls require a programmatic name.
- After changing individual icon SVGs or the icon manifest, run `node scripts/build-icon-sprite.mjs`.

## 9. Application coverage

A new composition pattern requires:

- a real use case rather than a decorative variant;
- an explicit depth and mode;
- a wide and narrow layout;
- location, state, and next action in the first viewport;
- preserved labels on mobile;
- an obvious return path when it enters Systems depth;
- geometry and texture that support the task rather than obscure it.

Use the 13 examples as composition references. Do not reduce the atlas to repeated metric cards and tables with different headings.

## 10. Public repository discipline

- Keep public links relative so the package works from disk and under a GitHub Pages project path.
- Do not refer to private build folders, nonexistent framework source, or undocumented commands.
- Keep source and generated artifacts together when editing tokens or icons.
- Update `manifest.json`, relevant asset manifests, documentation, and `CHANGELOG.md` when public counts or contracts change.
- Preserve unrelated behavior and choose the smallest coherent change that solves the requirement.

## 11. Completion gate

Run both commands before declaring work complete:

```bash
node scripts/build-icon-sprite.mjs
node scripts/validate.mjs
```

Also inspect changed visual pages at a wide and narrow viewport. Do not suppress validation failures. Report unresolved uncertainty explicitly.

For v1.8 visual changes, review `preview.html` before release. The preview consumes the distributed CSS tokens and is part of the public package contract.

Current release: `1.8.0`.
