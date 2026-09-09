import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";

import { buildDependencyMolecule } from "../statisticsChartsMolecule.js";
import { projectMolecule } from "../statisticsChartsMoleculeClient.js";

function fixture() {
  return {
    rootName: "root",
    workspaces: [
      {
        directory: "packages/root",
        manifest: {
          name: "root",
          version: "1.2.0",
          dependencies: { alpha: "^1", beta: "^1" },
          optionalDependencies: { absent: "^9", alpha: "^2" },
          devDependencies: { development: "*" },
          peerDependencies: { peer: "*" },
        },
      },
    ],
    packages: {
      "packages/root": { version: "0.9.0", dependencies: { stale: "*" } },
      "node_modules/root": { link: true, resolved: "packages/root" },
      "node_modules/alpha": {
        version: "2.0.0",
        dependencies: { shared: "^1", root: "*" },
      },
      "node_modules/beta": {
        version: "1.0.0",
        dependencies: { shared: "^2", alpha: "^2" },
      },
      "node_modules/shared": { version: "1.0.0" },
      "node_modules/beta/node_modules/shared": { version: "2.0.0" },
      "node_modules/development": { version: "1.0.0" },
      "node_modules/peer": { version: "1.0.0" },
    },
  };
}

test("01 - follows the locked closure with workspace overrides, cycles, versions, and optional edges", () => {
  const graph = buildDependencyMolecule(fixture());
  equal(
    graph.nodes.map(({ name, version }) => `${name}@${version}`),
    ["root@1.2.0", "alpha@2.0.0", "beta@1.0.0", "shared@1.0.0", "shared@2.0.0"],
    "01.01",
  );
  equal(
    graph.edges.map(({ from, to, optional, range }) => [
      from,
      to,
      optional,
      range,
    ]),
    [
      [0, 1, true, "^2"],
      [0, 2, false, "^1"],
      [1, 0, false, "*"],
      [1, 3, false, "^1"],
      [2, 1, false, "^2"],
      [2, 4, false, "^2"],
    ],
    "01.02",
  );
  equal(
    graph.unresolved,
    [
      {
        from: "root",
        fromId: "packages/root",
        name: "absent",
        range: "^9",
        optional: true,
      },
    ],
    "01.03",
  );
  equal(
    graph.nodes.map(({ internal }) => internal),
    [true, false, false, false, false],
    "01.04",
  );
});

test("02 - supports scoped links and reports missing and cyclic lock links", () => {
  const input = fixture();
  input.workspaces[0].manifest = {
    name: "root",
    version: "1.0.0",
    dependencies: { "@scope/child": "*", broken: "*", loop: "*", missing: "*" },
  };
  input.workspaces.push({
    directory: "packages/child",
    manifest: {
      name: "@scope/child",
      version: "2.0.0",
      dependencies: { shared: "*" },
    },
  });
  Object.assign(input.packages, {
    "node_modules/@scope/child": { link: true, resolved: "packages/child" },
    "packages/child": { version: "2.0.0" },
    "node_modules/broken": { link: true, resolved: "packages/absent" },
    "node_modules/loop": { link: true, resolved: "node_modules/loop" },
  });
  const graph = buildDependencyMolecule(input);
  equal(
    graph.nodes.map(({ name }) => name),
    ["root", "@scope/child", "shared"],
    "02.01",
  );
  equal(
    graph.unresolved.map(({ name }) => name),
    ["broken", "loop", "missing"],
    "02.02",
  );
  equal(
    graph.edges.map(({ from, to }) => [from, to]),
    [
      [0, 1],
      [1, 2],
    ],
    "02.03",
  );
});

test("03 - bakes deterministic coordinates with the root fixed and a real depth axis", () => {
  const graph = buildDependencyMolecule(fixture());
  equal(graph, buildDependencyMolecule(fixture()), "03.01");
  equal(
    [graph.nodes[0].x, graph.nodes[0].y, graph.nodes[0].z],
    [0, 0, 0],
    "03.02",
  );
  ok(graph.nodes.slice(1).some(({ z }) => z !== 0));
  const before = projectMolecule(graph.nodes);
  const after = projectMolecule(graph.nodes, Math.PI / 2, 0.2, 1.2);
  equal(
    after[0],
    before[0].scale === 1 ? { x: 640, y: 360, depth: 0, scale: 1.2 } : null,
    "03.03",
  );
  ok(before.slice(1).some((point, i) => point.x !== after[i + 1].x));
  ok(
    after.every(
      (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
    ),
  );
});

test("04 - dependency-free roots stay valid and unknown roots fail explicitly", () => {
  const input = fixture();
  input.workspaces[0].manifest = { name: "root", version: "1.0.0" };
  const graph = buildDependencyMolecule(input);
  equal(graph.nodes.length, 1, "04.01");
  equal(graph.edges, [], "04.02");
  equal(graph.unresolved, [], "04.03");
  throws(
    () => buildDependencyMolecule({ ...input, rootName: "absent" }),
    /not a workspace/,
  );
});

test.run();
