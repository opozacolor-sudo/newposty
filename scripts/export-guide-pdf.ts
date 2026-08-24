import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { getGuide, type GuideDoc } from "../lib/guide-content";

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render(guide: GuideDoc, locale: string) {
  const dateLabel =
    locale === "ro"
      ? "24 august 2026 · posty.now"
      : "24 August 2026 · posty.now";

  const toc = guide.sections
    .map(
      (section, index) =>
        `<li><span>${String(index + 1).padStart(2, "0")}</span> ${esc(section.title)}</li>`,
    )
    .join("");

  const sections = guide.sections
    .map((section, index) => {
      const lead = section.lead ? `<p class="lead">${esc(section.lead)}</p>` : "";
      const body = section.body.map((p) => `<p>${esc(p)}</p>`).join("");
      const networks = section.networks
        ? `<div class="cards">${section.networks
            .map(
              (network) => `<article class="card">
            <h3>${esc(network.name)}</h3>
            <p><strong>${esc(guide.networkLabels.can)}.</strong> ${esc(network.can)}</p>
            <p><strong>${esc(guide.networkLabels.boost)}.</strong> ${esc(network.boost)}</p>
            <p><strong>${esc(guide.networkLabels.audiences)}.</strong> ${esc(network.audiences)}</p>
            <p><strong>${esc(guide.networkLabels.stats)}.</strong> ${esc(network.stats)}</p>
            ${network.note ? `<p class="note">${esc(network.note)}</p>` : ""}
          </article>`,
            )
            .join("")}</div>`
        : "";
      const tips = section.tips
        ? section.tips
            .map(
              (tip) => `<aside class="tip"><p class="kicker">${esc(guide.tipLabel)}</p><p class="tip-title">${esc(tip.title)}</p><p>${esc(tip.body)}</p></aside>`,
            )
            .join("")
        : "";
      const examples = section.examples
        ? `<p class="kicker orange">${esc(guide.tryLabel)}</p><ul class="examples">${section.examples
            .map((example) => `<li>${esc(guide.quoteStart)}${esc(example)}${esc(guide.quoteEnd)}</li>`)
            .join("")}</ul>`
        : "";

      return `<section>
        <p class="num">${String(index + 1).padStart(2, "0")}</p>
        <h2>${esc(section.title)}</h2>
        ${lead}${body}${networks}${tips}${examples}
      </section>`;
    })
    .join("");

  return `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>${esc(guide.title)} — posty.now</title>
  <style>
    @page { size: A4; margin: 18mm 16mm 20mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #1a1a1a;
      font: 11.5pt/1.55 "Segoe UI", system-ui, sans-serif;
    }
    .cover { page-break-after: always; padding-top: 28mm; }
    .brand { color: #ff4713; font-weight: 700; letter-spacing: -0.03em; font-size: 18pt; }
    h1 { font-size: 32pt; line-height: 1.15; margin: 18px 0 12px; letter-spacing: -0.03em; }
    .sub { color: #4b5563; font-size: 13pt; max-width: 140mm; }
    .meta { margin-top: 28mm; color: #6b7280; font-size: 10pt; }
    h2 { font-size: 16pt; margin: 0 0 10px; letter-spacing: -0.02em; page-break-after: avoid; }
    h3 { font-size: 12pt; margin: 0 0 6px; }
    .num { color: #ff4713; font-size: 9pt; font-weight: 700; margin: 0 0 4px; }
    section { margin: 0 0 11mm; page-break-inside: avoid; }
    p { margin: 0 0 8px; }
    .lead { font-weight: 600; }
    .toc { page-break-after: always; }
    .toc h2 { margin-bottom: 8mm; }
    .toc ol { padding: 0; margin: 0; list-style: none; }
    .toc li { display: flex; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f3f4f6; }
    .toc span { color: #ff4713; font-variant-numeric: tabular-nums; width: 18px; flex: none; }
    .kicker { text-transform: uppercase; letter-spacing: 0.08em; font-size: 8.5pt; font-weight: 700; color: #9a3412; margin: 10px 0 4px; }
    .kicker.orange { color: #ff4713; }
    .tip { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 10px 12px; margin: 8px 0; }
    .tip-title { font-weight: 650; margin-bottom: 2px; }
    .examples { list-style: none; padding: 0; margin: 0 0 8px; }
    .examples li { border: 1px solid #ececec; border-radius: 10px; padding: 8px 10px; margin-bottom: 6px; }
    .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 8px 0 10px; }
    .card { background: #fafafa; border: 1px solid #ececec; border-radius: 10px; padding: 10px; }
    .card p { margin-bottom: 6px; }
    .note { color: #9a3412; }
    @media print {
      section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="cover">
    <div class="brand">posty.now</div>
    <h1>${esc(guide.title)}</h1>
    <p class="sub">${esc(guide.subtitle)}</p>
    <p class="meta">${esc(dateLabel)}</p>
  </div>
  <div class="toc">
    <h2>${esc(guide.toc)}</h2>
    <ol>${toc}</ol>
  </div>
  ${sections}
</body>
</html>`;
}

function chromePath() {
  return process.env["PROGRAMFILES"]
    ? path.join(process.env["PROGRAMFILES"], "Google", "Chrome", "Application", "chrome.exe")
    : "chrome";
}

function exportPdf(locale: "ro" | "en", outName: string) {
  const guide = getGuide(locale);
  const htmlPath = path.join(tmpdir(), `posty-guide-${locale}.html`);
  const outPath = path.resolve("public", outName);
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(htmlPath, render(guide, locale), "utf8");
  const fileUrl = `file:///${htmlPath.replaceAll("\\", "/")}`;
  execFileSync(
    chromePath(),
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--print-to-pdf=${outPath}`,
      "--no-first-run",
      "--no-default-browser-check",
      fileUrl,
    ],
    { stdio: "inherit" },
  );
  return outPath;
}

const ro = exportPdf("ro", "manual-posty-now-ro.pdf");
const en = exportPdf("en", "manual-posty-now-en.pdf");
console.log(ro);
console.log(en);
