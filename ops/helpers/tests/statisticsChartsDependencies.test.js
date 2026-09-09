import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";

import {
  buildDependencyCharts,
  createDependencyGraph,
  layoutDependencyTopology,
} from "../statisticsChartsDependencies.js";

const diamond = [
  { name: "top-cli", imports: ["left", "right", "foundation"] },
  { name: "left", imports: ["foundation"] },
  { name: "right", imports: ["foundation"] },
  { name: "foundation", imports: [] },
  { name: "isolate", imports: [] },
  { name: "outside-checkout", imports: [], unknownImports: true },
];

function intersectsInterior([ax, ay], [bx, by], box) {
  if (ax === bx) {
    return (
      ax > box.x &&
      ax < box.x + box.width &&
      Math.max(ay, by) > box.y &&
      Math.min(ay, by) < box.y + box.height
    );
  }
  return (
    ay > box.y &&
    ay < box.y + box.height &&
    Math.max(ax, bx) > box.x &&
    Math.min(ax, bx) < box.x + box.width
  );
}

test("01 - the directed graph preserves shared dependencies, isolates and unknown boundaries", () => {
  const graph = createDependencyGraph(diamond);
  equal(graph.nodes.length, 6, "01.01");
  equal(graph.edges.length, 5, "01.02");
  equal(
    graph.byName.get("foundation").incoming,
    ["left", "right", "top-cli"],
    "01.03",
  );
  equal(graph.byName.get("top-cli").depth, 2, "01.04");
  equal(graph.byName.get("outside-checkout").unknownImports, true, "01.05");
  equal(graph.byName.get("isolate").unknownImports, false, "01.06");
  equal(
    buildDependencyCharts(diamond).summary,
    {
      packageCount: 6,
      directDependencyCount: 5,
      maximumKnownDepth: 2,
      unknownOutgoingPackageCount: 1,
      knownIsolatedPackageCount: 1,
    },
    "01.07",
  );
});

test("02 - reordered input gives identical artifacts without mutating its records", () => {
  const before = JSON.stringify(diamond);
  const reordered = [...diamond]
    .reverse()
    .map((entry) => ({ ...entry, imports: [...entry.imports].reverse() }));
  equal(
    buildDependencyCharts(diamond),
    buildDependencyCharts(reordered),
    "02.01",
  );
  equal(JSON.stringify(diamond), before, "02.02");
});

test("03 - invalid graph inventories fail instead of silently dropping links", () => {
  throws(() => createDependencyGraph(null), /THROW_ID_01/);
  throws(() => createDependencyGraph([{ name: "broken" }]), /THROW_ID_02/);
  throws(
    () =>
      createDependencyGraph([
        { name: "a", imports: [] },
        { name: "a", imports: [] },
      ]),
    /THROW_ID_03/,
  );
  throws(
    () =>
      createDependencyGraph([
        { name: "a", imports: ["b", "b"] },
        { name: "b", imports: [] },
      ]),
    /THROW_ID_04/,
  );
  throws(
    () => createDependencyGraph([{ name: "a", imports: ["missing"] }]),
    /THROW_ID_05.*missing/,
  );
  throws(
    () =>
      createDependencyGraph([
        { name: "a", imports: ["b"] },
        { name: "b", imports: ["a"] },
      ]),
    /THROW_ID_06.*a → b → a/,
  );
  throws(
    () => createDependencyGraph([{ name: "a", imports: ["a"] }]),
    /THROW_ID_06/,
  );
});

test("04 - every SVG has each package and direct edge exactly once with accessible links", () => {
  const { files } = buildDependencyCharts(diamond);
  equal(
    Object.keys(files),
    [
      "interdependencies.svg",
      "dependency-topology.svg",
      "dependency-topology-narrow.svg",
    ],
    "04.01",
  );
  for (const svg of Object.values(files)) {
    equal((svg.match(/data-node=/g) || []).length, diamond.length, "04.02");
    equal((svg.match(/data-source=/g) || []).length, 5, "04.03");
    for (const node of diamond) {
      ok(svg.includes(`href="https://codsen.com/os/${node.name}"`));
      ok(svg.includes(`data-node="${node.name}"`));
    }
    ok(svg.includes("aria-labelledby="));
    ok(svg.includes("<desc"));
    ok(svg.includes("marker-end="));
    ok(svg.includes("Outgoing dependencies unknown"));
    ok(svg.includes("No internal production dependencies"));
    ok(!svg.includes("<script"));
  }
});

test("05 - dense ranks fit the viewport and every dependency flows down without crossing labels", () => {
  const many = [
    { name: "foundation-with-a-long-package-name", imports: [] },
    ...Array.from({ length: 38 }, (_, index) => ({
      name: `middle-${String(index).padStart(2, "0")}-long-package-name`,
      imports: ["foundation-with-a-long-package-name"],
    })),
  ];
  many.push({ name: "top", imports: many.map((node) => node.name) });
  const graph = createDependencyGraph(many);
  for (const columns of [3, 5]) {
    const layout = layoutDependencyTopology(graph, columns);
    ok(layout.width <= (columns === 3 ? 700 : 1280));
    equal(layout.positions.size, many.length, "05.01");
    for (const [name, box] of layout.positions) {
      equal(box.lines.join(""), name, "05.02");
      ok(box.x >= 0 && box.x + box.width <= layout.width);
      ok(box.y >= 0 && box.y + box.height <= layout.height);
      for (const [otherName, other] of layout.positions) {
        if (name === otherName) continue;
        ok(
          box.x + box.width <= other.x ||
            other.x + other.width <= box.x ||
            box.y + box.height <= other.y ||
            other.y + other.height <= box.y,
        );
      }
    }
    for (const route of layout.routes) {
      const source = layout.positions.get(route.source);
      const target = layout.positions.get(route.target);
      ok(source.y + source.height < target.y);
      for (let index = 1; index < route.points.length; index += 1) {
        const previous = route.points[index - 1];
        const current = route.points[index];
        ok(previous[0] === current[0] || previous[1] === current[1]);
        for (const box of layout.positions.values()) {
          ok(
            !intersectsInterior(previous, current, box),
            `${route.source} → ${route.target} must not cross a label box`,
          );
        }
      }
    }
  }
});

test("06 - node names are escaped in SVG text and metadata", () => {
  const { files } = buildDependencyCharts([
    { name: 'example<&"', imports: [] },
  ]);
  for (const svg of Object.values(files)) {
    ok(!svg.includes('data-node="example<&"'));
    ok(svg.includes("example&lt;&amp;&quot;"));
  }
});

test("07 - empty inventories produce valid finite SVG dimensions", () => {
  const { files, summary } = buildDependencyCharts([]);
  equal(summary.packageCount, 0, "07.01");
  for (const svg of Object.values(files)) {
    ok(svg.includes("<svg"));
    ok(!/NaN|Infinity|undefined/.test(svg));
  }
  throws(
    () => layoutDependencyTopology(createDependencyGraph([]), 0),
    /THROW_ID_01/,
  );
});

test.run();
