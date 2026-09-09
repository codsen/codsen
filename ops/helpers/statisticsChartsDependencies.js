import {
  escapeXml,
  number,
  packageUrl,
  svgDocument,
} from "./statisticsChartsSvg.js";

const ink = "#203a43";
const teal = "#007c78";
const muted = "#526a73";
const coordinate = (value) => Math.round(value * 100) / 100;
const compareNames = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// Outgoing edges always mean "depends on". Unknown outgoing dependencies
// describe the boundary of the supplied graph, never a claim of independence.
export function createDependencyGraph(interdeps) {
  if (!Array.isArray(interdeps)) {
    throw new Error(
      "statistics-charts/createDependencyGraph(): [THROW_ID_01] Expected an array of packages.",
    );
  }
  const byName = new Map();
  for (const entry of interdeps) {
    if (
      !entry ||
      typeof entry.name !== "string" ||
      !entry.name.trim() ||
      !Array.isArray(entry.imports) ||
      entry.imports.some((name) => typeof name !== "string" || !name.trim())
    ) {
      throw new Error(
        "statistics-charts/createDependencyGraph(): [THROW_ID_02] Every package needs a name and an array of dependency names.",
      );
    }
    if (byName.has(entry.name)) {
      throw new Error(
        `statistics-charts/createDependencyGraph(): [THROW_ID_03] Duplicate package: ${entry.name}.`,
      );
    }
    if (new Set(entry.imports).size !== entry.imports.length) {
      throw new Error(
        `statistics-charts/createDependencyGraph(): [THROW_ID_04] Duplicate dependency in ${entry.name}.`,
      );
    }
    byName.set(entry.name, {
      name: entry.name,
      imports: [...entry.imports].sort(compareNames),
      unknownImports: entry.unknownImports === true,
      incoming: [],
      depth: null,
    });
  }
  const nodes = [...byName.values()].sort((a, b) =>
    compareNames(a.name, b.name),
  );
  const edges = [];
  for (const node of nodes) {
    for (const dependency of node.imports) {
      if (!byName.has(dependency)) {
        throw new Error(
          `statistics-charts/createDependencyGraph(): [THROW_ID_05] Missing package ${dependency}, required by ${node.name}.`,
        );
      }
      byName.get(dependency).incoming.push(node.name);
      edges.push({ source: node.name, target: dependency });
    }
  }
  const visiting = new Set();
  function depth(node, trail) {
    if (visiting.has(node.name)) {
      throw new Error(
        `statistics-charts/createDependencyGraph(): [THROW_ID_06] Dependency cycle: ${[...trail, node.name].join(" → ")}.`,
      );
    }
    if (node.depth !== null) return node.depth;
    visiting.add(node.name);
    node.depth = Math.max(
      0,
      ...node.imports.map(
        (name) => 1 + depth(byName.get(name), [...trail, node.name]),
      ),
    );
    visiting.delete(node.name);
    return node.depth;
  }
  for (const node of nodes) depth(node, []);
  return { nodes, edges, byName };
}

function nodeDescription(node) {
  const dependencies = node.unknownImports
    ? "Outgoing dependencies unknown: package outside this checkout."
    : node.imports.length
      ? `Depends on ${node.imports.join(", ")}.`
      : "No internal production dependencies.";
  return `${node.name}. ${dependencies} ${node.incoming.length ? `Used by ${node.incoming.join(", ")}.` : "No recorded incoming dependencies."}`;
}

function definitions(id) {
  return `<defs><marker id="${id}-arrow" viewBox="0 0 7 7" refX="6" refY="3.5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0 0 L7 3.5 L0 7 Z" fill="${teal}"/></marker></defs>
<style>.dependency-edge:hover{stroke:#004d49;stroke-width:2;stroke-opacity:1}.dependency-node:hover text,.dependency-node:focus text{fill:#007c78;text-decoration:underline}.dependency-node:focus{outline:none}.dependency-node:focus rect{stroke:#007c78;stroke-width:2}</style>`;
}

function graphDescription(graph) {
  return `${number(graph.nodes.length)} active packages and ${number(graph.edges.length)} known direct production dependency links. Arrows point from a package to its dependency. Dashed nodes have unknown outgoing dependencies because their packages are outside the checkout. Each package links to its codsen.com page.`;
}

function circularChart(graph) {
  const id = "codsen-interdependencies";
  // At the top seam, flipping the left-hand labels brings the two font ascent
  // boxes towards each other. Leave an extra five degrees there, while keeping
  // the ordinary arc spacing unchanged everywhere else.
  const seamPadding = 0.09;
  const availableAngle = 2 * Math.PI - seamPadding;
  const angularStep = availableAngle / Math.max(1, graph.nodes.length);
  const radius = Math.max(240, (graph.nodes.length * 14) / availableAngle);
  const labelSpace = Math.max(
    170,
    ...graph.nodes.map((node) => node.name.length * 6.2 + 18),
  );
  const width = Math.max(
    960,
    Math.ceil((2 * (radius + labelSpace + 20)) / 40) * 40,
  );
  const height = width + 132;
  const cx = width / 2;
  const cy = width / 2 + 85;
  const positions = new Map(
    graph.nodes.map((node, index) => {
      const angle = (index + 0.5) * angularStep + seamPadding / 2 - Math.PI / 2;
      return [
        node.name,
        {
          angle,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        },
      ];
    }),
  );
  const body = [
    definitions(id),
    '<text x="36" y="42" class="title">How Codsen packages connect</text>',
    `<text x="36" y="69" class="subtitle">${number(graph.nodes.length)} active packages · ${number(graph.edges.length)} known direct dependencies</text>`,
    `<circle cx="${coordinate(cx)}" cy="${coordinate(cy)}" r="${coordinate(radius)}" fill="none" stroke="#dce5e6"/>`,
  ];
  for (const edge of graph.edges) {
    const source = positions.get(edge.source);
    const target = positions.get(edge.target);
    const inner = radius * 0.34;
    const targetRadius = radius - 7;
    const d = `M${coordinate(source.x)},${coordinate(source.y)} C${coordinate(cx + inner * Math.cos(source.angle))},${coordinate(cy + inner * Math.sin(source.angle))} ${coordinate(cx + inner * Math.cos(target.angle))},${coordinate(cy + inner * Math.sin(target.angle))} ${coordinate(cx + targetRadius * Math.cos(target.angle))},${coordinate(cy + targetRadius * Math.sin(target.angle))}`;
    body.push(
      `<path class="dependency-edge" data-source="${escapeXml(edge.source)}" data-target="${escapeXml(edge.target)}" d="${d}" fill="none" stroke="${teal}" stroke-width="0.9" stroke-opacity="0.23" marker-end="url(#${id}-arrow)"><title>${escapeXml(`${edge.source} → ${edge.target} (depends on)`)}</title></path>`,
    );
  }
  for (const node of graph.nodes) {
    const { angle, x, y } = positions.get(node.name);
    const left = Math.cos(angle) < -0.0001;
    const rotation = (angle * 180) / Math.PI;
    body.push(
      `<a class="dependency-node" data-node="${escapeXml(node.name)}" href="${escapeXml(packageUrl(node.name))}" target="_top" aria-label="${escapeXml(nodeDescription(node))}"><title>${escapeXml(nodeDescription(node))}</title><circle cx="${coordinate(x)}" cy="${coordinate(y)}" r="3" fill="${node.unknownImports ? "#fbfcfa" : teal}" stroke="${node.unknownImports ? muted : teal}"${node.unknownImports ? ' stroke-dasharray="1.5 1.5"' : ""}/><text transform="translate(${coordinate(cx)} ${coordinate(cy)}) rotate(${coordinate(rotation)}) translate(${coordinate(radius + 10)} 0)${left ? " rotate(180)" : ""}" text-anchor="${left ? "end" : "start"}" dominant-baseline="middle" font-size="11.5" fill="${node.unknownImports ? muted : ink}">${escapeXml(node.name)}</text></a>`,
    );
  }
  body.push(
    `<path d="M36 ${height - 34} H72" stroke="${teal}" marker-end="url(#${id}-arrow)"/><text x="84" y="${height - 30}" class="small">Package → dependency</text><circle cx="325" cy="${height - 34}" r="4" fill="none" stroke="${muted}" stroke-dasharray="2 2"/><text x="339" y="${height - 30}" class="small">Dashed: outgoing dependencies unknown</text>`,
  );
  return svgDocument({
    id,
    title: "Codsen circular package dependencies",
    description: graphDescription(graph),
    width,
    height,
    body: body.join("\n"),
  });
}

function wrapName(name, limit = 27) {
  const lines = [];
  let line = "";
  for (const token of name.match(/[^-]+-?/g) || [name]) {
    if (line && line.length + token.length > limit) {
      lines.push(line);
      line = "";
    }
    line += token;
    while (line.length > limit) {
      lines.push(line.slice(0, limit));
      line = line.slice(limit);
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Vertical gutters keep long links out of label boxes. Bands preserve longest
// known dependency depth even when a rank needs more than one row of labels.
export function layoutDependencyTopology(graph, columns = 5) {
  if (!Number.isInteger(columns) || columns < 1) {
    throw new Error(
      "statistics-charts/layoutDependencyTopology(): [THROW_ID_01] Columns must be a positive integer.",
    );
  }
  const margin = 32;
  const gap = 24;
  const nodeWidth = 190;
  const rowGap = 15;
  const width = margin * 2 + columns * nodeWidth + (columns - 1) * gap;
  const positions = new Map();
  const bands = [];
  const maximumDepth = Math.max(0, ...graph.nodes.map((node) => node.depth));
  let y = columns < 4 ? 152 : 124;
  for (let depth = maximumDepth; depth >= 0; depth -= 1) {
    const nodes = graph.nodes.filter((node) => node.depth === depth);
    // Group unknown boundaries last without changing the meaning of the rank.
    nodes.sort(
      (a, b) =>
        Number(a.unknownImports) - Number(b.unknownImports) ||
        compareNames(a.name, b.name),
    );
    const band = { depth, y, nodes, height: 0 };
    y += 29;
    for (let start = 0; start < nodes.length; start += columns) {
      const row = nodes.slice(start, start + columns);
      const lineCount = Math.max(
        ...row.map((node) => wrapName(node.name).length),
      );
      const nodeHeight = Math.max(36, lineCount * 13 + 14);
      row.forEach((node, column) => {
        positions.set(node.name, {
          x: margin + column * (nodeWidth + gap),
          y,
          width: nodeWidth,
          height: nodeHeight,
          column,
          lines: wrapName(node.name),
          band,
        });
      });
      y += nodeHeight + rowGap;
    }
    y += 17;
    band.height = y - band.y;
    bands.push(band);
  }
  const routes = graph.edges.map((edge, index) => {
    const source = positions.get(edge.source);
    const target = positions.get(edge.target);
    const lane = index % 4;
    const sx = source.x + source.width;
    const sy = source.y + source.height / 2;
    const tx = target.x;
    const ty = target.y + target.height / 2;
    const sourceGutter = sx + 6 + lane * 3;
    const targetGutter = tx - 6 - lane * 3;
    const crossY = target.band.y - 10 - lane * 3;
    return {
      ...edge,
      points: [
        [sx, sy],
        [sourceGutter, sy],
        [sourceGutter, crossY],
        [targetGutter, crossY],
        [targetGutter, ty],
        [tx - 2, ty],
      ],
    };
  });
  return { width, height: y + 66, positions, routes, bands, columns };
}

function topologyChart(graph, columns) {
  const layout = layoutDependencyTopology(graph, columns);
  const id = `codsen-dependency-topology-${columns}`;
  const { width, height } = layout;
  const narrow = columns < 4;
  const body = [
    definitions(id),
    '<text x="32" y="40" class="title">The dependency topology</text>',
    `<text x="32" y="66" class="subtitle">${number(graph.nodes.length)} active packages · ${number(graph.edges.length)} known direct dependencies</text>`,
    '<path d="M32 89 H64" stroke="#007c78" marker-end="url(#' +
      id +
      '-arrow)"/><text x="76" y="93" class="small">Package → dependency · arrows flow to lower bands</text>',
    `<text x="${narrow ? 32 : 617}" y="${narrow ? 116 : 93}" class="small">Dashed boxes: outgoing dependencies unknown</text>`,
  ];
  for (const band of layout.bands) {
    body.push(
      `<path d="M32 ${band.y + 17} H${width - 32}" stroke="#dce5e6"/><rect x="28" y="${band.y - 1}" width="98" height="23" fill="#fbfcfa"/><text x="32" y="${band.y + 16}" font-size="10.5" letter-spacing="0.8" font-weight="600" fill="${muted}">DEPTH ${band.depth} · ${number(band.nodes.length)}</text>`,
    );
  }
  for (const route of layout.routes) {
    const d = route.points
      .map(
        ([x, y], index) =>
          `${index ? "L" : "M"}${coordinate(x)},${coordinate(y)}`,
      )
      .join(" ");
    body.push(
      `<path class="dependency-edge" data-source="${escapeXml(route.source)}" data-target="${escapeXml(route.target)}" d="${d}" fill="none" stroke="${teal}" stroke-width="0.85" stroke-opacity="0.25" stroke-linejoin="round" marker-end="url(#${id}-arrow)"><title>${escapeXml(`${route.source} → ${route.target} (depends on)`)}</title></path>`,
    );
  }
  for (const node of graph.nodes) {
    const position = layout.positions.get(node.name);
    const { x, y, width: nodeWidth, height: nodeHeight, lines } = position;
    const textY = y + nodeHeight / 2 - ((lines.length - 1) * 13) / 2 + 4;
    body.push(
      `<a class="dependency-node" data-node="${escapeXml(node.name)}" data-depth="${node.depth}" href="${escapeXml(packageUrl(node.name))}" target="_top" aria-label="${escapeXml(nodeDescription(node))}"><title>${escapeXml(nodeDescription(node))}</title><rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="5" fill="${node.unknownImports ? "#f5f6f3" : "#ffffff"}" stroke="${node.unknownImports ? muted : "#bdcecf"}"${node.unknownImports ? ' stroke-dasharray="4 3"' : ""}/><text x="${x + 10}" y="${coordinate(textY)}" font-size="11.5" fill="${ink}">${lines.map((line, index) => `<tspan x="${x + 10}" dy="${index ? 13 : 0}">${escapeXml(line)}</tspan>`).join("")}</text></a>`,
    );
  }
  body.push(
    `<text x="32" y="${height - 39}" class="small">Depth = longest known dependency chain; zero means none are recorded.</text><text x="32" y="${height - 19}" class="small">Only direct production dependencies between active Codsen packages are shown.</text>`,
  );
  return svgDocument({
    id,
    title: "Codsen active package dependency topology",
    description: `${graphDescription(graph)} Bands run from the longest dependency chains at the top to packages without recorded internal dependencies at the bottom. The graph shares dependency nodes instead of duplicating them into a tree.`,
    width,
    height,
    body: body.join("\n"),
  });
}

export function buildDependencyCharts(interdeps) {
  const graph = createDependencyGraph(interdeps);
  return {
    files: {
      "interdependencies.svg": circularChart(graph),
      "dependency-topology.svg": topologyChart(graph, 5),
      "dependency-topology-narrow.svg": topologyChart(graph, 3),
    },
    summary: {
      packageCount: graph.nodes.length,
      directDependencyCount: graph.edges.length,
      maximumKnownDepth: Math.max(0, ...graph.nodes.map((node) => node.depth)),
      unknownOutgoingPackageCount: graph.nodes.filter(
        (node) => node.unknownImports,
      ).length,
      knownIsolatedPackageCount: graph.nodes.filter(
        (node) =>
          !node.unknownImports && !node.imports.length && !node.incoming.length,
      ).length,
    },
  };
}
