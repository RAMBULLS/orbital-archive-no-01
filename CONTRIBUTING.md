# Contributing

Contributions should improve clarity, portability, accessibility, maintainability, or documented application coverage.

## Before opening a change

1. Read [`GOVERNANCE.md`](GOVERNANCE.md), then open [`index.html`](index.html).
2. Review [`docs/AEROSPACE-GRAMMAR.md`](docs/AEROSPACE-GRAMMAR.md) and [`docs/LAYOUT-UX.md`](docs/LAYOUT-UX.md).
3. Keep assets and examples stack-neutral unless a platform-specific adapter is clearly labeled.
4. Do not add niche pictograms for concepts that are clearer as labels or established platform icons.
5. Test changed icons at 16, 20, 24, 32, and 48 pixels.
6. Test changed examples at wide and narrow viewports.
7. Run the public validation gate:

```bash
node scripts/build-icon-sprite.mjs
node scripts/validate.mjs
```

## Pull requests

Describe the user problem, intended outcome, affected files, accessibility considerations, and verification performed. Keep unrelated changes separate and record user-visible changes in [`CHANGELOG.md`](CHANGELOG.md).
