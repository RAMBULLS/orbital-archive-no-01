#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (message) => failures.push(message);
const rel = (path) => relative(ROOT, path).replaceAll("\\", "/");
const read = (path) => readFileSync(resolve(ROOT, path), "utf8");
const parse = (path) => JSON.parse(read(path));

const required = [
  "index.html",
  "preview.html",
  "README.md",
  "RELEASE_NOTES.md",
  "GOVERNANCE.md",
  "LICENSE",
  "manifest.json",
  "components/contracts.json",
  "tokens/tokens.json",
  "assets/manifest.json",
  "assets/icons/manifest.json",
  "assets/icons/lsm-icons.svg",
  "assets/marks/readme-banner.svg",
  "assets/patterns/aerospace-schematic.svg",
  "assets/patterns/flight-plan.svg",
  "assets/patterns/horizon-profile.svg",
  "assets/patterns/calibration-rail.svg",
  "assets/patterns/phosphor-dither.svg",
  "docs/STYLE_GUIDE.md",
  "docs/LAYOUT-UX.md",
  "docs/AEROSPACE-GRAMMAR.md",
  "docs/DEPLOYMENT.md",
  "examples/index.html",
  ".github/workflows/quality.yml",
  ".github/workflows/pages.yml",
  ".nojekyll"
];
for (const path of required)
  if (!existsSync(resolve(ROOT, path))) fail(`missing required path: ${path}`);

const manifest = parse("manifest.json");
const assetManifest = parse("assets/manifest.json");
const iconManifest = parse("assets/icons/manifest.json");
const contracts = parse("components/contracts.json");
const tokenSource = parse("tokens/tokens.json");

if (manifest.framework !== "none") fail("portable manifest must remain framework-free");
if (tokenSource.color?.palette?.teal?.$value !== "#5CA3A6")
  fail("canonical Signal Teal token is stale");
if (tokenSource.color?.palette?.relay?.$value !== "{color.palette.teal}")
  fail("deprecated relay token must alias Signal Teal");
for (const [name, expected] of [
  ["primary", "{color.palette.orange}"],
  ["info", "{color.palette.teal}"],
  ["ring", "{color.palette.teal}"],
  ["focus", "{color.palette.teal}"],
  ["link", "{color.palette.teal}"]
])
  if (tokenSource.color?.semantic?.[name]?.$value !== expected)
    fail(`semantic color ${name} must resolve through ${expected}`);
for (const [label, version] of [
  ["asset manifest", assetManifest.version],
  ["icon manifest", iconManifest.version],
  ["component contracts", contracts.version]
])
  if (version !== manifest.version)
    fail(`${label} version ${version} does not match ${manifest.version}`);

const examples = readdirSync(resolve(ROOT, "examples")).filter(
  (name) => name.endsWith(".html") && name !== "index.html"
);
if (examples.length !== manifest.exampleCount)
  fail(`expected ${manifest.exampleCount} application examples, found ${examples.length}`);
if (
  contracts.count !== contracts.components.length ||
  contracts.count !== manifest.componentContractCount
) {
  fail(
    `expected ${manifest.componentContractCount} component contracts, found ${contracts.components.length}`
  );
}
const contractIds = new Set();
for (const contract of contracts.components) {
  if (contractIds.has(contract.id)) fail(`duplicate component contract id: ${contract.id}`);
  contractIds.add(contract.id);
  if (
    !contract.name ||
    !contract.family ||
    !contract.states?.length ||
    !contract.allowedDepths?.length
  ) {
    fail(`incomplete component contract: ${contract.id || contract.name}`);
  }
  if (contract.allowedDepths.some((depth) => ![0, 1, 2].includes(depth)))
    fail(`invalid depth in ${contract.id}`);
}

const individualIcons = readdirSync(resolve(ROOT, "assets/icons")).filter(
  (name) => extname(name) === ".svg" && name !== "lsm-icons.svg"
);
if (individualIcons.length !== manifest.iconCount)
  fail(`expected ${manifest.iconCount} individual icons, found ${individualIcons.length}`);
if (iconManifest.count !== iconManifest.icons.length || iconManifest.count !== manifest.iconCount) {
  fail(
    `icon manifest count mismatch: declared ${iconManifest.count}, listed ${iconManifest.icons.length}, package ${manifest.iconCount}`
  );
}
const categoryTotal = Object.values(iconManifest.categories).reduce((sum, count) => sum + count, 0);
if (categoryTotal !== iconManifest.count)
  fail(`icon category totals equal ${categoryTotal}, expected ${iconManifest.count}`);
const iconNames = new Set();
const sprite = read("assets/icons/lsm-icons.svg");
for (const icon of iconManifest.icons) {
  if (iconNames.has(icon.name)) fail(`duplicate icon manifest name: ${icon.name}`);
  iconNames.add(icon.name);
  if (!existsSync(resolve(ROOT, `assets/icons/${icon.name}.svg`)))
    fail(`missing icon source: ${icon.name}.svg`);
  if (!sprite.includes(`id="lsm-icon-${icon.name}"`)) fail(`sprite missing symbol: ${icon.name}`);
}
if ((sprite.match(/<symbol\b/g) || []).length !== iconManifest.count)
  fail("sprite symbol count does not match icon manifest");

if (assetManifest.patterns.length !== manifest.patternCount)
  fail(`expected ${manifest.patternCount} patterns, found ${assetManifest.patterns.length}`);
for (const collection of ["marks", "patterns"]) {
  for (const asset of assetManifest[collection]) {
    if (asset.path.startsWith("/")) fail(`asset path must be relative: ${asset.path}`);
    if (!existsSync(resolve(ROOT, asset.path)))
      fail(`asset manifest points to missing path: ${asset.path}`);
  }
}
for (const path of Object.values(assetManifest.icons)) {
  if (typeof path !== "string") continue;
  if (path.startsWith("/")) fail(`icon asset path must be relative: ${path}`);
  if (!existsSync(resolve(ROOT, path))) fail(`icon asset manifest points to missing path: ${path}`);
}

const allFiles = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "_qa" || entry.name === "node_modules") continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else allFiles.push(path);
  }
}
walk(ROOT);

const retiredBrightBlue = new RegExp(`#${"54"}${"BCD9"}`, "i");
for (const file of allFiles) {
  const content = readFileSync(file, "utf8");
  if (retiredBrightBlue.test(content)) fail(`${rel(file)} contains the retired bright-blue value`);
}

function localTarget(file, value) {
  if (!value || /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(value)) return null;
  const clean = value.split("#")[0].split("?")[0];
  if (!clean) return null;
  return resolve(dirname(file), clean);
}

for (const file of allFiles.filter((path) => path.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  if (!/<h1\b/i.test(html)) fail(`${rel(file)} lacks a primary h1`);
  for (const match of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const value = match[1];
    const target = localTarget(file, value);
    if (!target) continue;
    if (!existsSync(target)) {
      fail(`${rel(file)} links to missing ${value}`);
      continue;
    }
    const fragment = value.includes("#") ? value.split("#")[1].split("?")[0] : "";
    if (fragment && statSync(target).isFile() && target.endsWith(".html")) {
      const targetHtml = readFileSync(target, "utf8");
      if (!targetHtml.includes(`id="${fragment}"`) && !targetHtml.includes(`id='${fragment}'`)) {
        fail(`${rel(file)} links to missing #${fragment} in ${rel(target)}`);
      }
    }
  }
}

for (const file of allFiles.filter((path) => path.endsWith(".md"))) {
  const markdown = readFileSync(file, "utf8");
  const values = [
    ...[...markdown.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((match) => match[1]),
    ...[...markdown.matchAll(/<(?:img|a)\b[^>]*(?:src|href)=["']([^"']+)["']/gi)].map(
      (match) => match[1]
    )
  ];
  for (const value of values) {
    const target = localTarget(file, value);
    if (target && !existsSync(target)) fail(`${rel(file)} links to missing ${value}`);
  }
}

for (const name of examples) {
  const html = read(`examples/${name}`);
  if (!/<html\s+[^>]*lang=["'][^"']+["']/i.test(html)) fail(`examples/${name} lacks html lang`);
  if (!/<meta\s+name=["']viewport["']/i.test(html))
    fail(`examples/${name} lacks viewport metadata`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`examples/${name} lacks a title`);
  if (!html.includes("example.css")) fail(`examples/${name} does not use shared example.css`);
}

const activeDocs = [
  "README.md",
  "GOVERNANCE.md",
  "CONTRIBUTING.md",
  ...readdirSync(resolve(ROOT, "docs"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => `docs/${name}`)
];
const forbidden = [
  "components/lsm",
  "config/routes.json",
  "config/components.json",
  "assets/icons/catalog.mjs",
  "pnpm quality",
  "pnpm build",
  "style-guide.html"
];
for (const path of activeDocs) {
  const content = read(path);
  for (const phrase of forbidden)
    if (content.includes(phrase)) fail(`${path} contains stale public reference: ${phrase}`);
}

const index = read("index.html");
const preview = read("preview.html");
if (!index.includes(`OA-${manifest.version}`)) fail("standalone guide archive ref is stale");
if (index.includes("left:7%;right:-8%;bottom:23%"))
  fail("standalone guide still contains the copy-crossing hero rule");
if (!index.includes("oa-arcs"))
  fail("standalone guide lacks the safe-corridor flight-plan geometry");
if (!index.includes(`Orbital Archive No. 01 · ${manifest.version}`))
  fail("standalone guide footer version is stale");
if (!index.includes(`${assetManifest.patterns.length} patterns`))
  fail("standalone guide footer pattern count is stale");
if (!preview.includes("tokens/dist/tokens.css"))
  fail("v1.8 preview does not consume the distributed CSS tokens");
if (!preview.includes("--teal: var(--lsm-color-palette-teal, #5CA3A6);"))
  fail("v1.8 preview lacks canonical token fallbacks for a dropped local dependency");
if (!preview.includes("assets/patterns/phosphor-dither.svg"))
  fail("v1.8 preview does not demonstrate the phosphor dither asset");
for (const id of ["signal", "mission", "systems"])
  if (!preview.includes(`id="${id}"`)) fail(`v1.8 preview lacks ${id} depth`);
for (const marker of ['id="review-action"', 'aria-live="polite"'])
  if (!preview.includes(marker)) fail(`v1.8 preview lacks interaction contract: ${marker}`);
if (/make the\s*<br>\s*<span[^>]*>signal count/i.test(preview))
  fail("v1.8 preview contains campaign copy instead of a factual release specimen");
if (preview.includes(".pixel-word::after"))
  fail("v1.8 preview contains the rejected decorative title rail");
if (!read("README.md").includes(`VERSION ${manifest.version}`)) fail("README version is stale");
if (!read("docs/STYLE_GUIDE.md").includes(`Version ${manifest.version}`))
  fail("style guide version is stale");
if (!read("RELEASE_NOTES.md").includes(`— ${manifest.version}`))
  fail("release notes version is stale");
if (!read("components/README.md").includes(`Version: \`${manifest.version}\``))
  fail("component README version is stale");
if (!read("examples/index.html").includes(`<strong>${manifest.version}</strong>`))
  fail("application atlas version is stale");
if (!read("docs/DEPLOYMENT.md").includes(`v${manifest.version}`))
  fail("deployment release example is stale");
for (const [path, snippets] of Object.entries({
  "tokens/dist/tokens.css": [
    "--lsm-color-palette-teal: #5CA3A6;",
    "--lsm-color-palette-relay: #5CA3A6;"
  ],
  "tokens/dist/tokens.ts": [
    '"teal": "#5CA3A6"',
    '"relay": "#5CA3A6"',
    '"color.palette.relay": "#5CA3A6"'
  ],
  "tokens/dist/tokens.native.ts": [
    '"teal": "#5CA3A6"',
    '"relay": "#5CA3A6"',
    '"color.palette.relay": "#5CA3A6"'
  ],
  "tokens/dist/tailwind-theme.ts": ['"teal": "#5CA3A6"', '"relay": "#5CA3A6"'],
  "tokens/dist/react-native.ts": ['"teal": "#5CA3A6"', '"relay": "#5CA3A6"'],
  "tokens/dist/Tokens.swift": [
    "ColorPaletteTeal = Color(red: 0.3608, green: 0.6392, blue: 0.6510)",
    "ColorPaletteRelay = ColorPaletteTeal"
  ],
  "tokens/dist/LSMTokens.kt": [
    "ColorPaletteTeal = Color(0xFF5CA3A6)",
    "ColorPaletteRelay = ColorPaletteTeal"
  ],
  "tokens/dist/tokens.dart": [
    "colorPaletteTeal = Color(0xFF5CA3A6)",
    "colorPaletteRelay = colorPaletteTeal"
  ],
  "tokens/dist/android/colors.xml": [
    'lsm_color_palette_teal">#FF5CA3A6',
    'lsm_color_palette_relay">@color/lsm_color_palette_teal'
  ]
})) {
  const content = read(path);
  for (const snippet of snippets)
    if (!content.includes(snippet)) fail(`${path} lacks token export contract: ${snippet}`);
}

if (failures.length) {
  console.error(failures.map((message) => `- ${message}`).join("\n"));
  process.exit(1);
}
console.log(
  `[orbital-archive] valid v${manifest.version}: ${allFiles.filter((p) => p.endsWith(".html")).length} HTML files, ${examples.length} examples, ${contracts.count} contracts, ${assetManifest.patterns.length} patterns, ${iconManifest.count} icons`
);
