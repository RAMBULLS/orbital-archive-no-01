# Deployment

Orbital Archive No. 01 is a static package. It can be opened from disk, served by any static host, or published through the included GitHub Pages workflow.

## Local review

Open `index.html` directly, or serve the repository root when you want browser routing and caching behavior closer to production:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## GitHub Pages

The workflow at `.github/workflows/pages.yml` runs on pushes to `main` and manual dispatch. It:

1. checks out the repository;
2. configures Pages;
3. runs `node scripts/validate.mjs`;
4. uploads the repository root as the Pages artifact;
5. deploys to the `github-pages` environment.

### One-time repository setting

In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. After the workflow reaches `main`, watch the `pages` run under the Actions tab.

The expected project URL is:

```text
https://rambulls.github.io/orbital-archive-no-01/
```

A custom domain or different account configuration may produce another URL; the deployment job exposes the actual page URL in its environment summary.

## Release flow

```bash
node scripts/build-icon-sprite.mjs
node scripts/validate.mjs
git add -A
git commit -m "Release Orbital Archive No. 01 v1.8.0"
git push origin main
```

## Static-host alternatives

Upload the repository root to any host that serves `index.html` and preserves the directory structure. No rewrite rules or server runtime are required.

## Troubleshooting

- **Missing styles or assets:** preserve relative directories; do not move an example without its `example.css` relationship.
- **Pages workflow cannot deploy:** confirm Pages uses GitHub Actions and the workflow has `pages: write` and `id-token: write` permissions.
- **Project-path failures:** remove leading `/` from local asset references.
- **Stale output:** hard-refresh after a successful deployment or wait for edge cache expiration.
