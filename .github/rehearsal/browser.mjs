import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.join(process.env.RUNNER_TEMP, "rehearsal");
const { chromium } = await import(
  pathToFileURL(path.join(root, "driver/node_modules/playwright/index.mjs")).href
);
const origin = "https://orbital.rambulls.dev";
const report = {
  environment:
    "GitHub-hosted Chrome; exact archive bytes fulfilled by Playwright at modeled HTTPS origin",
  limitations: [
    "Request interception does not verify real DNS, certificates, provider headers, caching or native redirects",
    "Mobile is Chrome viewport/touch emulation, not a physical phone or Safari",
    "No deployment, DNS change or permanent staging infrastructure"
  ],
  cases: []
};
const browser = await chromium.launch({ channel: "chrome", headless: true });
report.browser_version = browser.version();
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".xml": "application/xml"
};
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: "reduce"
    });
    let release = "candidate";
    const unexpected = [];
    const errors = [];
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) {
        unexpected.push(url.origin);
        return route.abort();
      }
      let name = decodeURIComponent(url.pathname).replace(/^\/+/, "");
      if (!name || name.endsWith("/")) name += "index.html";
      if (name.split("/").includes("..")) return route.fulfill({ status: 404, body: "Not found" });
      const file = path.join(root, release + "-site", name);
      try {
        const body = await fs.readFile(file);
        return route.fulfill({
          status: 200,
          contentType: mime[path.extname(file)] || "application/octet-stream",
          body
        });
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        return route.fulfill({ status: 404, body: "Not found" });
      }
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    const target = origin + "/?source=test&x=1&x=2&empty=&utf8=%E2%9C%93#components";
    for (const label of ["candidate", "rollback", "candidate"]) {
      release = label;
      await page.goto(target, { waitUntil: "networkidle" });
      assert.equal(page.url(), target);
      assert.equal(await page.locator("#components").count(), 1);
      await page.waitForFunction(() => document.querySelectorAll(".icon-card").length === 161);
      assert.equal(
        await page.locator("link[rel=canonical]").getAttribute("href"),
        label === "candidate" ? origin + "/" : "https://rambulls.github.io/orbital-archive-no-01/"
      );
      assert.equal(
        await page.evaluate(
          () => getComputedStyle(document.body).getPropertyValue("--orange").trim().length > 0
        ),
        true
      );
      await page.locator("#icon-search").fill("home");
      assert.match(await page.locator("#icon-count").textContent(), /of 161 assets/);
      assert.ok((await page.locator(".icon-card:visible").count()) > 0);
      assert.ok((await page.locator(".icon-card:visible").count()) < 161);
      await page.locator("#icon-search").fill("");
      assert.equal(await page.locator(".icon-card:visible").count(), 161);
      await page.locator("#icon-search").focus();
      assert.equal(
        await page.locator("#icon-search").evaluate((el) => el === document.activeElement),
        true
      );
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(page.url(), target);
      const preview = await page.goto(origin + "/preview.html", { waitUntil: "networkidle" });
      assert.equal(preview.status(), 200);
      await page.goBack({ waitUntil: "networkidle" });
      assert.equal(page.url(), target);
      await page.goForward({ waitUntil: "networkidle" });
      assert.ok(page.url().endsWith("/preview.html"));
      report.cases.push({
        mobile,
        release: label,
        clean_or_warm:
          report.cases.filter((x) => x.mobile === mobile).length === 0 ? "clean" : "warm",
        query_fragment_reload_history_icons_focus: "PASS"
      });
    }
    release = "rollback";
    const manifest = JSON.parse(
      await fs.readFile(path.join(root, "previous-proof/rollback-manifest.json"), "utf8")
    );
    const resources = await page.evaluate(async (items) => {
      const results = [];
      for (const item of items) {
        const response = await fetch("/" + item.path);
        const bytes = await response.arrayBuffer();
        const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("");
        if (response.status !== 200 || hash !== item.sha256)
          throw new Error("Restore mismatch: " + item.path);
        results.push({ path: item.path, status: response.status, hash });
      }
      return results;
    }, manifest.files);
    assert.equal(resources.length, 242);
    report.cases.push({ mobile, restored_resource_count: resources.length, all_bytes_match: true });
    release = "candidate";
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(root, "proof", mobile ? "candidate-mobile.png" : "candidate-desktop.png")
    });
    const missing = await page.goto(origin + "/missing-migration-page.html", { waitUntil: "load" });
    assert.equal(missing.status(), 404);
    assert.deepEqual(errors, []);
    assert.deepEqual(unexpected, []);
    await context.close();
  }
  report.status = "PASS_STAGED_ONLY";
} finally {
  await fs.writeFile(
    path.join(root, "proof/browser-rehearsal.json"),
    JSON.stringify(report, null, 2)
  );
  await browser.close();
}
console.log(JSON.stringify(report));
