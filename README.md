<p align="center">
  <img src="assets/marks/readme-banner.svg" width="100%" alt="Orbital Archive No. 01 — Lunar Signal Modernism">
</p>

<p align="center"><strong>A stack-neutral aerospace design system for expressive entry, calm operation, and exact systems work.</strong></p>

<p align="center"><code>VERSION 1.8.0</code> · <code>161 REVIEWED ICONS</code> · <code>13 APPLICATIONS</code> · <code>49 CONTRACTS</code> · <code>9 SCHEMATIC PATTERNS</code></p>

<p align="center"><strong>Live:</strong> <a href="https://rambulls.github.io/orbital-archive-no-01/">rambulls.github.io/orbital-archive-no-01</a></p>

## Present dramatically. Operate calmly. Scale completely.

Orbital Archive No. 01 is the first theme in the **Lunar Signal Modernism** design language. It combines archival aerospace drafting, condensed editorial typography, controlled signal color, pragmatic product UX, and tactile surface texture without turning normal work into a cockpit simulation.

**[Open the visual guide](https://rambulls.github.io/orbital-archive-no-01/)** · **[Browse the application atlas](https://rambulls.github.io/orbital-archive-no-01/examples/index.html)** · **[See the v1.8 preview](https://rambulls.github.io/orbital-archive-no-01/preview.html)** · **[Read the aerospace grammar](docs/AEROSPACE-GRAMMAR.md)**

No install or framework is required. The pages are self-contained and open directly in a browser. For full fidelity — and to match GitHub Pages — serve the folder over a local HTTP server (`python -m http.server`) and open `http://localhost:8000/`. If a page ever renders unstyled, it means `tokens/dist/tokens.css` did not load; serve over HTTP.

## What ships

| Layer             | Included                                                                                                                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual guide      | Self-contained HTML with foundations, depth rules, component states, assets, applications, and a searchable icon catalog                                                                                   |
| Application atlas | 13 distinct responsive references spanning editorial, product, administration, documentation, mobile, sequencing, and diagnostics                                                                          |
| Aerospace grammar | Orbit and horizon arcs, plotted trajectories, datum marks, vectors, leader lines, calibration rails, coordinate notation, and blueprint structure                                                          |
| Surface language  | Restrained paper grain, blueprint grids, scanlines, film noise, vignette, and registration marks                                                                                                           |
| Asset kit         | 161 conventional SVG icons (adapted from [Tabler Icons](https://tabler.io/icons), MIT — see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)), a symbol sprite, 3 marks, and 9 reusable schematic patterns |
| Token package     | DTCG source plus CSS, TypeScript, Tailwind, React Native, Swift, Kotlin, Dart, and native exports                                                                                                          |
| Governance        | 49 machine-readable component contracts, binding agent rules, validation, contribution guidance, and CI                                                                                                    |

## Application atlas

The examples are deliberately different rather than one dashboard reskinned thirteen times.

| Depth                          | References                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Signal · cinematic entry**   | [Landing page](examples/landing-page.html), [editorial portfolio](examples/editorial-portfolio.html)                                                                                                                                                                                                                                                                                                                                       |
| **Mission · active work**      | [Top navigation](examples/top-navigation.html), [sidebar application](examples/sidebar-application.html), [dashboard](examples/dashboard.html), [data admin](examples/data-admin.html), [catalog](examples/catalog.html), [knowledge base](examples/knowledge-base.html), [settings](examples/settings.html), [staged flow](examples/staged-flow.html), [mission timeline](examples/mission-timeline.html), [mobile](examples/mobile.html) |
| **Systems · deliberate depth** | [Deep systems diagnostics](examples/deep-systems.html)                                                                                                                                                                                                                                                                                                                                                                                     |

Each page uses plain HTML and the shared [`examples/example.css`](examples/example.css). Copy the composition, hierarchy, responsive sequence, and semantic treatment into any stack.

## Aerospace without costume

The identity is architectural, not illustrative.

| Device                                  | Job                                                                |
| --------------------------------------- | ------------------------------------------------------------------ |
| Horizon and orbital arcs                | Establish scale, frame regions, or create a calm directional field |
| Trajectories and plotted vectors        | Show sequence, progression, relationship, or intent                |
| Datum crosshairs and registration marks | Establish origin, alignment, and technical precision               |
| Leader lines and measurement ticks      | Attach labels to real content and make comparison legible          |
| Blueprint grids and construction lines  | Reveal structure at low contrast                                   |
| Grain, scanlines, and film noise        | Give surfaces material character without reducing readability      |

**Non-negotiable:** trajectories, curves, and rules never cross running copy, form controls, data cells, or primary actions. Geometry lives in safe corridors and must earn its position. See [AEROSPACE-GRAMMAR.md](docs/AEROSPACE-GRAMMAR.md).

## Depth model

| Depth           | Mode                   | Job                                                                                |
| --------------- | ---------------------- | ---------------------------------------------------------------------------------- |
| **0 · Signal**  | Cinematic editorial    | Orient, establish identity, and invite one next action                             |
| **1 · Mission** | Calm operational       | Support active work with restrained hierarchy and clear scope                      |
| **2 · Systems** | Deliberately technical | Reveal diagnostics, advanced settings, logs, and dense detail after explicit entry |

Every deeper context keeps scope visible and provides a clear return path.

## Quick start

1. Review [`preview.html`](preview.html) for the v1.8 color and depth treatment.
2. Open [`index.html`](index.html) for the complete system guide.
3. Choose the closest reference in [`examples/`](examples/index.html).
4. Reuse semantic values from [`tokens/tokens.json`](tokens/tokens.json) or a generated export in [`tokens/dist/`](tokens/dist/).
5. Preserve required behavior from [`components/contracts.json`](components/contracts.json).
6. Validate before release:

```bash
node scripts/validate.mjs
```

`color.palette.teal` is the canonical active/focus/link token in v1.8. The former `color.palette.relay` name remains as a deprecated teal-valued compatibility alias and will be removed in v2.

When editing icons, rebuild the sprite first:

```bash
node scripts/build-icon-sprite.mjs
node scripts/validate.mjs
```

## Adopt this theme in a project

Nothing needs to be built to _consume_ the theme — the exports in
[`tokens/dist/`](tokens/dist/) and the embedded faces in
[`assets/fonts.css`](assets/fonts.css) are ready to use. Two ways to pull it
into another project:

**Install from Git** (versioned, no registry required):

```bash
npm install github:RAMBULLS/orbital-archive-no-01#v1.8.0
```

Then import the pieces your stack needs — the package exposes stable subpaths:

```css
/* Any CSS/PostCSS project */
@import "orbital-archive-no-01/fonts.css"; /* Oswald · IBM Plex Mono · Silkscreen */
@import "orbital-archive-no-01/css"; /* --lsm-* custom properties */

.cta {
  background: var(--lsm-color-semantic-primary);
  color: var(--lsm-color-semantic-primary-foreground);
  font-family: var(--lsm-font-display);
}
```

| Subpath                           | File                            | Use                             |
| --------------------------------- | ------------------------------- | ------------------------------- |
| `orbital-archive-no-01/css`       | `tokens/dist/tokens.css`        | CSS custom properties           |
| `orbital-archive-no-01/fonts.css` | `assets/fonts.css`              | Self-contained `@font-face` set |
| `orbital-archive-no-01/tailwind`  | `tokens/dist/tailwind-theme.ts` | Tailwind theme object           |
| `orbital-archive-no-01/ts`        | `tokens/dist/tokens.ts`         | Typed token object              |
| `orbital-archive-no-01`           | `tokens/tokens.json`            | Raw DTCG source                 |

**Or copy two files** — `tokens/dist/tokens.css` and `assets/fonts.css` — into
any project and reference the `--lsm-*` variables directly. Swift, Kotlin, Dart,
Android, and React Native exports are in [`tokens/dist/`](tokens/dist/) for
native targets.

## Local development

Requires Node (version pinned in [`.nvmrc`](.nvmrc)).

```bash
npm install
npm run build      # regenerate token exports + icon sprite
npm test           # validate the portable package
```

Tokens are generated, never hand-edited. Edit the single source
[`tokens/tokens.json`](tokens/tokens.json), then regenerate every platform
export with **[Style Dictionary](https://styledictionary.com)**:

```bash
npm run build:tokens   # tokens/build.mjs → all 10 files in tokens/dist/
```

The quality gate (enforced in CI) mirrors these local commands:

```bash
npm run format:check   # Prettier
npm run lint:css       # Stylelint
npm run lint:md        # markdownlint
npm run validate       # portable-package contract checks
```

`npm run format` auto-fixes formatting. CI additionally regenerates the tokens
and fails if [`tokens/dist/`](tokens/dist/) is out of sync with the source, so a
token change can never merge without its regenerated exports.

## Repository map

```text
.
├── index.html                    # standalone visual guide
├── examples/                     # 13 complete responsive applications
├── components/
│   └── contracts.json            # 49 stack-neutral behavior contracts
├── assets/
│   ├── icons/                    # individual SVGs, sprite, metadata
│   ├── marks/                    # roundel, wordmark, README banner
│   └── patterns/                 # 9 reusable aerospace fields
├── tokens/
│   ├── tokens.json               # DTCG source of truth
│   ├── build.mjs                 # Style Dictionary generator
│   └── dist/                     # generated platform exports (do not hand-edit)
├── docs/                         # style, layout, grammar, icon, deployment
├── scripts/                      # icon-sprite build and package validation
├── package.json                  # toolchain, scripts, and package exports
└── .github/workflows/            # quality and GitHub Pages deployment
```

## Deployment

The repository includes a GitHub Pages workflow for the root static package. See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for the one-time repository setting and release flow.

## Contribution rules

Read [GOVERNANCE.md](GOVERNANCE.md) before generating or changing UI. Human contributions follow [CONTRIBUTING.md](CONTRIBUTING.md). User-visible and contract-level changes belong in [CHANGELOG.md](CHANGELOG.md).

## License

MIT. See [LICENSE](LICENSE). Third-party material (Tabler Icons, MIT) is credited in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
