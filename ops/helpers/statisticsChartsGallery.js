import { escapeXml } from "./statisticsChartsSvg.js";

function buildChartsGallery(files, through) {
  const figures = [
    ["download-concentration.svg", "How concentrated are downloads?"],
    ["download-concentration-history.svg", "Has concentration changed?"],
    ["download-ranking.svg", "Which packages drive downloads?"],
    ["interdependencies.svg", "The circular dependency map"],
    ["dependency-topology.svg", "The complete active catalogue"],
    ["dependency-molecule.svg", "A dependency molecule, frozen in SVG"],
  ];
  const known = new Set(figures.map(([file]) => file));
  // Include any additional chart without making the gallery depend on its name.
  for (const file of Object.keys(files).sort()) {
    if (
      file.endsWith(".svg") &&
      !known.has(file) &&
      !file.endsWith("-narrow.svg")
    ) {
      figures.splice(3, 0, [
        file,
        file.replace(/\.svg$/, "").replaceAll("-", " "),
      ]);
    }
  }
  const content = figures
    .filter(([file]) => Object.hasOwn(files, file))
    .map(([file, title]) => {
      const narrow = file.replace(".svg", "-narrow.svg");
      const hasNarrow = Object.hasOwn(files, narrow);
      return `<section><h2>${escapeXml(title)}</h2>
<p><a href="${file}">Open full-size SVG</a></p>
<object ${hasNarrow ? 'class="wide-chart"' : ""} data="${file}" type="image/svg+xml" aria-label="${escapeXml(title)}"><img src="${file}" alt="${escapeXml(title)}"/></object>
${hasNarrow ? `<object class="narrow-chart" data="${narrow}" type="image/svg+xml" aria-label="${escapeXml(title)}"><img src="${narrow}" alt="${escapeXml(title)}"/></object>` : ""}
</section>`;
    })
    .join("\n");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Codsen statistics charts</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#fbfcfa;color:#203a43;font:16px/1.6 Arial,Helvetica,sans-serif}main{max-width:1184px;margin:auto;padding:32px}h1{font-size:36px;line-height:1.15;letter-spacing:-1px}h2{font-size:22px;line-height:1.3;margin-bottom:4px}p{max-width:76ch}a{color:#007c78;text-underline-offset:3px}section{margin-top:48px;border-top:1px solid #dce5e6;padding-top:24px}object,img,iframe{display:block;width:100%;border:0}iframe{height:760px}.narrow-chart{display:none}@media(max-width:700px){main{padding:20px 12px}h1{font-size:29px}.wide-chart{display:none}.narrow-chart{display:block}iframe{height:900px}}
</style></head><body><main>
<h1>Codsen, in charts</h1>
<p>Download history through ${escapeXml(through)}. Dependency maps describe this checkout and its current package catalogue. <a href="README.md">Sources, regeneration, and embedding</a> · <a href="summary.json">Underlying measurements</a></p>
${content}
${Object.hasOwn(files, "dependency-molecule.html") ? `<section><h2>Explore the molecule in 3D</h2><p><a href="dependency-molecule.html">Open the interactive explorer</a></p><iframe src="dependency-molecule.html" title="Interactive 3D dependency molecule" loading="lazy"></iframe></section>` : ""}
</main></body></html>
`;
}

export { buildChartsGallery };
