# Public Repository Guide

The distributed package is a static, stack-neutral repository. It functions as a browsable design resource, implementation reference, constraint package for coding agents, and portable source of assets and tokens.

## Root files

Keep `README.md`, `index.html`, `GOVERNANCE.md`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `RELEASE_NOTES.md`, and `manifest.json` at the repository root. A new visitor should understand the project and open the guide without installing anything.

## Content ownership

| Path                        | Responsibility                                                  |
| --------------------------- | --------------------------------------------------------------- |
| `index.html`                | Authoritative standalone visual overview                        |
| `examples/`                 | 13 copyable, responsive, plain-HTML application references      |
| `components/contracts.json` | 49 stack-neutral component state and depth contracts            |
| `assets/icons/`             | Individual SVGs, sprite, and icon metadata                      |
| `assets/marks/`             | Identity marks and README banner                                |
| `assets/patterns/`          | Reusable aerospace diagrams and fields                          |
| `tokens/tokens.json`        | Design-token source                                             |
| `tokens/dist/`              | Generated platform exports                                      |
| `docs/`                     | Style, layout, aerospace grammar, icon, and deployment guidance |
| `scripts/`                  | Zero-dependency maintenance and validation tools                |
| `.github/workflows/`        | Quality validation and Pages deployment                         |

## Relative-path requirement

All public HTML, Markdown, and asset-manifest paths must remain relative. The package must work when opened from disk and when hosted under a GitHub Pages project path.

## Publishing

The included GitHub Pages workflow validates the repository, uploads the root static package, and deploys it from `main`. See [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Release checklist

1. Update the root and asset manifest versions and counts.
2. Rebuild the icon sprite if icon geometry changed.
3. Run `node scripts/validate.mjs`.
4. Inspect changed examples at wide and narrow viewports.
5. Update `CHANGELOG.md` and `RELEASE_NOTES.md`.
6. Package the repository without `.git` or QA output.

A release is not ready if navigation links are dead, an example depends on an undocumented framework, a niche icon needs its caption to be recognized, responsive behavior is missing, geometry crosses content, or the first viewport does not establish location, state, and next action.
