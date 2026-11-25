// Headless smoke test: serve the repo, load index.html in Chrome (React and Babel come
// from unpkg, so the runner needs network access), fail on any uncaught page error,
// failed request or console error, then drive the app and check the linen bookkeeping:
//  - the app renders (8 KPI cards, the SVG flow diagram);
//  - "Trimite tot" moves every item from Camera Murdara to La Spalatorie and the grand
//    total stays unchanged; "Returnare" moves them back into Camera Curata;
//  - the Jurnal tab shows the logged pickup and return.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const root = new URL("..", import.meta.url).pathname;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  try {
    const file = join(root, path.endsWith("/") ? path + "index.html" : path);
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}/index.html`;

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "chrome" });
const page = await browser.newPage();
const problems = [];
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
const ignored = (u) => new URL(u).pathname === "/favicon.ico";
page.on("console", (m) => { if (m.type() === "error" && !(m.location()?.url && ignored(m.location().url))) problems.push(`console.error: ${m.text()} (${m.location()?.url ?? ""})`); });
page.on("response", (r) => { if (r.status() >= 400 && !ignored(r.url())) problems.push(`http ${r.status()}: ${r.url()}`); });
page.on("requestfailed", (r) => problems.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
const check = (ok, msg) => { if (!ok) problems.push(msg); };

const kpi = (label) => page.evaluate((l) => {
  const el = [...document.querySelectorAll("#root div")].find((d) => d.children.length === 0 && d.textContent === l);
  return el ? Number(el.nextElementSibling.textContent) : NaN;
}, label);

await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("#root svg", { timeout: 20000 }).catch(() => problems.push("app did not render an SVG flow diagram"));

const dirty0 = await kpi("Camera Murdara");
const ext0 = await kpi("La Spalatorie");
const total0 = await kpi("Total General");
check(dirty0 > 0 && ext0 === 0 && total0 > 0, `unexpected initial KPIs: dirty=${dirty0} laundry=${ext0} total=${total0}`);

await page.getByRole("button", { name: /^Trimite tot/ }).click();
check((await kpi("Camera Murdara")) === 0, "Camera Murdara not emptied by the pickup");
check((await kpi("La Spalatorie")) === dirty0, "La Spalatorie did not receive the dirty items");
check((await kpi("Total General")) === total0, "pickup changed the grand total");

const curata1 = await kpi("Camera Curata");
await page.getByRole("button", { name: /^Primeste tot/ }).click();
check((await kpi("La Spalatorie")) === 0, "La Spalatorie not emptied by the return");
check((await kpi("Camera Curata")) === curata1 + dirty0, "Camera Curata did not receive the returned items");
check((await kpi("Total General")) === total0, "return changed the grand total");

await page.getByRole("button", { name: "Jurnal" }).click();
const logText = await page.locator("#root").innerText();
check(logText.includes("RIDICARE PROGRAMATA") && logText.includes("RETURNARE PROGRAMATA"), "Jurnal does not show the pickup and the return");

await browser.close();
server.close();
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log(`ok: ${url} rendered; pickup ${dirty0} items to laundry and back, total ${total0} constant, log entries present, no errors`);
