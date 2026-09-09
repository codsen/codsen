import { readFileSync } from "node:fs";
import path from "node:path";

import {
  placeMoleculeLabels,
  projectMolecule,
  startMoleculeExplorer,
} from "./statisticsChartsMoleculeClient.js";
import { escapeXml, packageUrl, svgDocument } from "./statisticsChartsSvg.js";
import { readWorkspaceRecords } from "./workspaceInventoryFile.js";

function canonicalLockPath(packages, candidate) {
  const seen = new Set();
  while (packages[candidate]?.link) {
    if (seen.has(candidate)) return null;
    seen.add(candidate);
    candidate = path.posix.normalize(packages[candidate].resolved || "");
    if (candidate.startsWith("../") || path.posix.isAbsolute(candidate))
      return null;
  }
  return packages[candidate] ? candidate : null;
}

function resolveDependency(packages, from, name) {
  let directory = from;
  while (true) {
    if (path.posix.basename(directory) !== "node_modules") {
      const candidate = path.posix.join(directory, "node_modules", name);
      if (packages[candidate]) return canonicalLockPath(packages, candidate);
    }
    if (!directory || directory === ".") return null;
    const parent = path.posix.dirname(directory);
    directory = parent === "." ? "" : parent;
  }
}

function layoutMolecule(nodes, edges) {
  const positions = nodes.map((node, i) => {
    if (!i) return { x: 0, y: 0, z: 0 };
    const polar = Math.acos(1 - (2 * (i - 0.5)) / (nodes.length - 1));
    const azimuth = i * 2.399963229728653;
    const radius = 90 + node.depth * 50;
    return {
      x: radius * Math.sin(polar) * Math.cos(azimuth),
      y: radius * Math.cos(polar),
      z: radius * Math.sin(polar) * Math.sin(azimuth),
    };
  });
  // Fixed iterations and deterministic seeds keep the baked artifacts stable.
  for (let iteration = 0; iteration < 180; iteration += 1) {
    const forces = positions.map(() => ({ x: 0, y: 0, z: 0 }));
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const a = positions[i];
        const b = positions[j];
        const distance = Math.max(
          1,
          Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z),
        );
        const force = 25000 / (distance * distance * distance);
        for (const axis of ["x", "y", "z"]) {
          const amount = (a[axis] - b[axis]) * force;
          forces[i][axis] += amount;
          forces[j][axis] -= amount;
        }
      }
    }
    for (const edge of edges) {
      const a = positions[edge.from];
      const b = positions[edge.to];
      const distance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z));
      const force = ((distance - 145) / distance) * 0.03;
      for (const axis of ["x", "y", "z"]) {
        const amount = (b[axis] - a[axis]) * force;
        forces[edge.from][axis] += amount;
        forces[edge.to][axis] -= amount;
      }
    }
    for (let i = 1; i < positions.length; i += 1) {
      for (const axis of ["x", "y", "z"]) {
        positions[i][axis] +=
          Math.max(-8, Math.min(8, forces[i][axis])) * (1 - iteration / 220);
      }
    }
  }
  const extent = Object.fromEntries(
    ["x", "y", "z"].map((axis) => [
      axis,
      Math.max(1, ...positions.map((point) => Math.abs(point[axis]))),
    ]),
  );
  return nodes.map((node, i) => ({
    ...node,
    x: Number(((positions[i].x / extent.x) * 300).toFixed(3)),
    y: Number(((positions[i].y / extent.y) * 220).toFixed(3)),
    z: Number(((positions[i].z / extent.z) * 120).toFixed(3)),
  }));
}

// Follow the locked installation topology, preserving different installed
// versions of the same name as separate nodes and cycles as ordinary edges.
function buildDependencyMolecule({ packages, workspaces, rootName }) {
  const workspaceMap = new Map(
    workspaces.map((record) => [record.directory, record.manifest]),
  );
  const root = workspaces.find((record) => record.manifest.name === rootName);
  if (!root) throw new Error(`Molecule root is not a workspace: ${rootName}`);
  const nodes = [];
  const indices = new Map();
  const edges = [];
  const unresolved = [];
  function add(id, fallbackName, depth) {
    if (indices.has(id)) return indices.get(id);
    const manifest = workspaceMap.get(id) || packages[id];
    const name = manifest.name || fallbackName;
    const internal = workspaceMap.has(id);
    const index = nodes.length;
    indices.set(id, index);
    nodes.push({
      id,
      name,
      version: manifest.version || "unversioned",
      internal,
      depth,
      url: internal
        ? packageUrl(name)
        : `https://www.npmjs.com/package/${encodeURIComponent(name)}/v/${encodeURIComponent(manifest.version || "latest")}`,
    });
    return index;
  }
  add(root.directory, rootName, 0);
  for (let from = 0; from < nodes.length; from += 1) {
    const node = nodes[from];
    const manifest = workspaceMap.get(node.id) || packages[node.id];
    const dependencies = {
      ...manifest.dependencies,
      ...manifest.optionalDependencies,
    };
    for (const [name, range] of Object.entries(dependencies).sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      const optional = Object.hasOwn(manifest.optionalDependencies || {}, name);
      const resolved = resolveDependency(packages, node.id, name);
      if (!resolved) {
        unresolved.push({
          from: node.name,
          fromId: node.id,
          name,
          range,
          optional,
        });
        continue;
      }
      const to = add(resolved, name, node.depth + 1);
      edges.push({ from, to, optional, range });
    }
  }
  return { nodes: layoutMolecule(nodes, edges), edges, unresolved };
}

function renderMoleculeSvg(graph) {
  const points = projectMolecule(graph.nodes);
  const labels = placeMoleculeLabels(graph.nodes, points);
  const lines = graph.edges
    .map((edge) => {
      const a = points[edge.from];
      const b = points[edge.to];
      const distance = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const inset = (edge.to === 0 ? 13 : 8) * b.scale;
      return `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${(b.x - ((b.x - a.x) / distance) * inset).toFixed(2)}" y2="${(b.y - ((b.y - a.y) / distance) * inset).toFixed(2)}" stroke="${edge.optional ? "#a47839" : "#8eb6b0"}" stroke-width="1.4"${edge.optional ? ' stroke-dasharray="4 4"' : ""} marker-end="url(#molecule-arrow)"/>`;
    })
    .join("\n");
  const leaders = points
    .map(
      (point, i) =>
        `<line x1="${point.x.toFixed(2)}" y1="${point.y.toFixed(2)}" x2="${labels[i].x.toFixed(2)}" y2="${(labels[i].y + 3).toFixed(2)}" stroke="#c4d5d1" stroke-width="0.8"/>`,
    )
    .join("\n");
  const circles = graph.nodes
    .map((node, i) => {
      const point = points[i];
      const label = labels[i];
      return `<a href="${escapeXml(node.url)}" target="_blank" rel="noopener noreferrer"><g transform="translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})"><title>${escapeXml(`${node.name}@${node.version} — ${node.id}`)}</title><circle r="${((i === 0 ? 12 : 7) * point.scale).toFixed(2)}" fill="${i === 0 ? "#153c38" : node.internal ? "#208b7b" : "#dd9a45"}" stroke="#fff" stroke-width="2"/><g transform="translate(${(label.x - point.x).toFixed(2)} ${(label.y - point.y).toFixed(2)})" text-anchor="${label.anchor}"><text x="0" y="0" class="label" style="font-size:14px;paint-order:stroke;stroke:#fbfcfa;stroke-width:5;stroke-linejoin:round${i === 0 ? ";font-weight:700" : ""}">${escapeXml(node.name)}</text><text x="0" y="16" class="small" style="font-size:11px;paint-order:stroke;stroke:#fbfcfa;stroke-width:4">${escapeXml(node.version)}</text></g></g></a>`;
    })
    .join("\n");
  const rootName = graph.nodes[0].name;
  return svgDocument({
    id: "dependency-molecule",
    title: `Dependency molecule: ${rootName}`,
    description: `Static perspective projection of ${graph.nodes.length} packages and ${graph.edges.length} production and optional dependency links. Arrows point to dependencies. Workspace manifests and package-lock.json snapshot; development and peer dependencies are excluded. ${graph.unresolved.length} unresolved dependencies. Open dependency-molecule.html for rotation, zoom, and other roots.`,
    width: 1280,
    height: 790,
    body: `<defs><marker id="molecule-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#8eb6b0"/></marker></defs>
<text x="48" y="48" class="small">CODSEN / DEPENDENCY MOLECULE</text>
<text x="48" y="91" class="title">${escapeXml(rootName)}</text>
<text x="48" y="120" class="subtitle">${graph.nodes.length} packages · ${graph.edges.length} dependency links · static 3D projection</text>
<g transform="translate(0 50)">${lines}${leaders}${circles}</g>
<circle cx="56" cy="708" r="6" fill="#208b7b"/><text x="70" y="712" class="small">Workspace package</text>
<circle cx="252" cy="708" r="6" fill="#dd9a45"/><text x="266" y="712" class="small">External package</text>
<text x="470" y="712" class="small">Arrows point to dependencies · dashed links are optional</text>
<text x="48" y="746" class="small">Current workspace manifests + local npm lockfile · excludes development and peer dependencies${graph.unresolved.length ? ` · ${graph.unresolved.length} unresolved` : ""}</text>
<text x="48" y="768" class="small">Open dependency-molecule.html to rotate, zoom, and choose a package.</text>`,
  });
}

function renderMoleculeHtml(data, preview) {
  const json = JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/gu,
    (character) =>
      `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
  const fallback = preview.replace(/^<\?xml[^>]*>\s*/u, "");
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Codsen dependency molecule</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#fbfcfa;color:#203a43;font:15px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}main{max-width:1280px;margin:auto;padding:28px}h1{font-size:32px;line-height:1.15;margin:10px 0}p{margin:8px 0;color:#526a73}.eyebrow{font-size:12px;font-weight:700;letter-spacing:2px;color:#007c78}.controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:22px 0 12px}select,button{font:inherit;color:inherit;background:white;border:1px solid #aebfbe;border-radius:6px;padding:8px 12px}select{max-width:100%}button{cursor:pointer}button:hover{background:#e3f2ed}a{color:#007c78}a:focus-visible,button:focus-visible,select:focus-visible,svg:focus-visible{outline:3px solid #cf812d;outline-offset:4px}.scene-wrap{border:1px solid #dce5e6;border-radius:12px;background:radial-gradient(ellipse at center,#f0f7f1,#fbfcfa 70%);overflow:hidden}#scene{display:block;width:100%;height:auto;min-height:330px;touch-action:none;cursor:grab}#scene:active{cursor:grabbing}.node-label{font:14px system-ui;fill:#203a43;paint-order:stroke;stroke:#fbfcfa;stroke-width:5px;stroke-linejoin:round}.node-label.root{font-weight:750}.version{font:11px system-ui;fill:#526a73;paint-order:stroke;stroke:#fbfcfa;stroke-width:4px}.legend{display:flex;gap:22px;flex-wrap:wrap;margin:12px 0;font-size:13px}.dot{width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:6px}.muted{font-size:13px;color:#526a73}details{margin-top:20px;border-top:1px solid #dce5e6;padding-top:16px}summary{cursor:pointer}#package-list{font-size:13px;padding-left:20px;overflow-wrap:anywhere}#package-list li{padding:5px 0}#missing{overflow-wrap:anywhere}footer{margin-top:20px;font-size:12px;color:#526a73}.js-only{display:none}.js-enabled .js-only{display:block}.js-enabled .controls{display:flex}.js-enabled .fallback{display:none}.fallback svg{max-width:100%;height:auto}@media(max-width:600px){main{padding:18px}h1{font-size:26px}.controls label{width:100%}.controls select{width:100%}#scene{min-height:400px}}
</style></head><body><main>
<div class="eyebrow">CODSEN / DEPENDENCY MOLECULE</div><h1>A package and everything it depends on</h1>
<p>Explore production dependencies in three dimensions. The selected package stays at the centre.</p>
<div class="fallback">${fallback}<p>Enable JavaScript to rotate the graph and choose another package.</p></div>
<div class="controls js-only"><label for="package">Package</label><select id="package"></select><button id="zoom-in" type="button" aria-label="Zoom in">+</button><button id="zoom-out" type="button" aria-label="Zoom out">−</button><button id="reset" type="button">Reset view</button><label><input id="show-all-labels" type="checkbox"> Show all labels</label><a id="root-link" target="_blank" rel="noopener noreferrer">Package page ↗</a></div>
<div class="js-only"><p id="count" role="status"></p><div class="scene-wrap"><svg id="scene" viewBox="0 0 1280 720" tabindex="0" role="group" aria-label="Interactive dependency molecule" aria-describedby="instructions"><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#8eb6b0"/></marker></defs><g id="links"></g><g id="leaders"></g><g id="nodes"></g></svg></div>
<p id="instructions" class="muted">Drag to rotate. Focus the graph and use arrow keys to rotate, +/− to zoom, and 0 to reset. Click a package or label to open its page. Graphs with more than 30 packages initially label only the root and direct dependencies; hover any node for its name or use the complete list below.</p>
<div class="legend"><span><i class="dot" style="background:#153c38"></i>Selected package</span><span><i class="dot" style="background:#208b7b"></i>Workspace package</span><span><i class="dot" style="background:#dd9a45"></i>External package</span><span>Arrows point to dependencies · dashed links are optional</span></div>
<p id="missing" class="muted"></p><details><summary>Accessible package and dependency list</summary><ul id="package-list"></ul></details></div>
<footer>Snapshot: current workspace manifests and package-lock.json; this is not a live npm registry view. Includes all resolved production and optional dependencies, including platform-specific packages; excludes development dependencies and peer-only relationships. Shared packages and cycles are retained. Inspired by <a href="https://npm.anvaka.com/#/view/3d/string-strip-html" target="_blank" rel="noopener noreferrer">Andrei Kashcha’s npm graph</a>. This file contains its own graph data and renderer and makes no network requests.</footer>
</main><script id="molecule-data" type="application/json">${json}</script><script>
(${startMoleculeExplorer.toString()})(JSON.parse(document.getElementById("molecule-data").textContent), ${projectMolecule.toString()}, ${placeMoleculeLabels.toString()});
document.documentElement.classList.add("js-enabled");
</script></body></html>\n`;
}

function buildMoleculeCharts({ root, interdeps }) {
  const lock = JSON.parse(
    readFileSync(path.join(root, "package-lock.json"), "utf8"),
  );
  if (!lock.packages)
    throw new Error(
      "Dependency molecules require an npm lockfile with a packages map",
    );
  const workspaces = readWorkspaceRecords(root);
  const activeNames = new Set(interdeps.map((entry) => entry.name));
  const roots = workspaces.filter(
    ({ manifest }) =>
      manifest.name !== "@codsen/data" &&
      !manifest.private &&
      activeNames.has(manifest.name),
  );
  const graphs = Object.fromEntries(
    roots.map(({ manifest }) => [
      manifest.name,
      buildDependencyMolecule({
        packages: lock.packages,
        workspaces,
        rootName: manifest.name,
      }),
    ]),
  );
  const defaultRoot = graphs["string-strip-html"]
    ? "string-strip-html"
    : roots[0]?.manifest.name;
  if (!defaultRoot)
    throw new Error(
      "No active workspace roots available for the dependency molecule",
    );
  const graph = graphs[defaultRoot];
  const preview = renderMoleculeSvg(graph);
  return {
    files: {
      "dependency-molecule.html": renderMoleculeHtml(
        { defaultRoot, graphs },
        preview,
      ),
      "dependency-molecule.svg": preview,
    },
    summary: {
      defaultRoot,
      selectableRoots: roots.length,
      packages: graph.nodes.length,
      edges: graph.edges.length,
      externalPackages: graph.nodes.filter((node) => !node.internal).length,
      unresolved: Object.entries(graphs)
        .filter(([, item]) => item.unresolved.length)
        .map(([name, item]) => ({ root: name, dependencies: item.unresolved })),
      source: "current workspace manifests and package-lock.json",
      scope:
        "production and optional dependencies; excludes development dependencies and peer-only relationships",
    },
  };
}

export { buildDependencyMolecule, buildMoleculeCharts };
