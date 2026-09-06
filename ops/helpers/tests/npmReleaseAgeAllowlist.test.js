import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import { renderNpmReleaseAgeAllowlist } from "../npmReleaseAgeAllowlist.js";

const begin = "; BEGIN generated Codsen release-age exclusions";
const end = "; END generated Codsen release-age exclusions";

function workspace(name, fields = {}) {
  return {
    directory: name === "@codsen/data" ? "data" : `packages/${name}`,
    manifest: { name, ...fields },
  };
}

function exclusions(contents) {
  return contents
    .split(/\r?\n/)
    .filter((line) => line.startsWith("min-release-age-exclude[]="));
}

test("01 - lists exact published workspace names without trusting dependencies", () => {
  const records = [
    workspace("zebra"),
    workspace("internal-tool", { private: true }),
    workspace("html-entity-codec", {
      dependencies: { "third-party": "^1.0.0", "@codsen/outside": "^1.0.0" },
      devDependencies: { "build-tool": "^1.0.0" },
      optionalDependencies: { "optional-tool": "^1.0.0" },
      peerDependencies: { "peer-tool": "^1.0.0" },
    }),
    workspace("@codsen/data"),
    workspace("alpha", { private: false }),
  ];
  const output = renderNpmReleaseAgeAllowlist("min-release-age=3", records);

  equal(
    exclusions(output),
    [
      "min-release-age-exclude[]=@codsen/data",
      "min-release-age-exclude[]=alpha",
      "min-release-age-exclude[]=html-entity-codec",
      "min-release-age-exclude[]=zebra",
    ],
    "01.01",
  );
  match(output, /^min-release-age=3\n/, "01.02");
  match(output, /^; Regenerate with npm run ci:generate:npmrc$/m, "01.03");
  equal(output.includes(`${begin}\n`), true, "01.04");
  equal(output.includes(end), true, "01.05");
  equal(renderNpmReleaseAgeAllowlist(output, records), output, "01.06");
});

test("02 - regeneration tracks additions, removals, renames and private changes", () => {
  const before = renderNpmReleaseAgeAllowlist("", [
    workspace("retained"),
    workspace("removed"),
    workspace("old-name"),
    workspace("now-private"),
    workspace("now-public", { private: true }),
  ]);
  const after = renderNpmReleaseAgeAllowlist(before, [
    workspace("retained"),
    workspace("added"),
    { directory: "packages/old-name", manifest: { name: "new-name" } },
    workspace("now-private", { private: true }),
    workspace("now-public"),
  ]);

  equal(
    exclusions(after),
    [
      "min-release-age-exclude[]=added",
      "min-release-age-exclude[]=new-name",
      "min-release-age-exclude[]=now-public",
      "min-release-age-exclude[]=retained",
    ],
    "02.01",
  );
  equal(exclusions(renderNpmReleaseAgeAllowlist(after, [])), [], "02.02");
});

test("03 - replaces only the block and preserves CRLF and manual settings", () => {
  const prefix =
    "; Local settings\r\nmin-release-age=7\r\nmin-release-age-exclude[]=manual-before\r\n\r\n";
  const suffix =
    "\r\n\r\nregistry=https://registry.npmjs.org/\r\nmin-release-age-exclude[]=manual-after";
  const input = `${prefix}${begin}\r\nmin-release-age-exclude[]=stale\r\n${end}${suffix}`;
  const records = [workspace("html-entity-codec")];
  const output = renderNpmReleaseAgeAllowlist(input, records);

  equal(output.slice(0, output.indexOf(begin)), prefix, "03.01");
  equal(output.slice(output.indexOf(end) + end.length), suffix, "03.02");
  equal(
    exclusions(output),
    [
      "min-release-age-exclude[]=manual-before",
      "min-release-age-exclude[]=html-entity-codec",
      "min-release-age-exclude[]=manual-after",
    ],
    "03.03",
  );
  equal(output.replaceAll("\r\n", "").includes("\n"), false, "03.04");
  equal(renderNpmReleaseAgeAllowlist(output, records), output, "03.05");
});

test("04 - rejects incomplete, reversed and duplicate generated blocks", () => {
  const malformed = [
    `${begin}\n`,
    `${end}\n`,
    `${end}\n${begin}\n`,
    `${begin}\n${begin}\n${end}\n`,
    `${begin}\n${end}\n${end}\n`,
    `${begin}\n${end}\n${begin}\n${end}\n`,
  ];

  for (const [index, contents] of malformed.entries()) {
    throws(
      () => renderNpmReleaseAgeAllowlist(contents, [workspace("example")]),
      /marker|block|generated|release-age/i,
      `04.${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("05 - CLI bootstraps without dependencies and checks drift without writes", () => {
  const root = mkdtempSync(path.join(tmpdir(), "npm-release-age-"));
  try {
    for (const relative of [
      "scripts/generate-npmrc.js",
      "helpers/npmReleaseAgeAllowlist.js",
      "helpers/generatedFiles.js",
      "helpers/writeFileAtomically.js",
      "helpers/workspaceInventory.js",
      "helpers/workspaceInventoryFile.js",
    ]) {
      const destination = path.join(root, "ops", relative);
      mkdirSync(path.dirname(destination), { recursive: true });
      copyFileSync(
        path.resolve(import.meta.dirname, "../..", relative),
        destination,
      );
    }
    const writeJson = (relative, value) => {
      const filename = path.join(root, relative);
      mkdirSync(path.dirname(filename), { recursive: true });
      writeFileSync(filename, JSON.stringify(value));
    };
    writeJson("package.json", {
      private: true,
      type: "module",
      workspaces: ["packages/*", "data"],
    });
    writeJson("lerna.json", { packages: ["packages/*", "data"] });
    writeJson("packages/example/package.json", { name: "html-entity-codec" });
    writeJson("data/package.json", { name: "@codsen/data" });
    const filename = path.join(root, ".npmrc");
    const original = "min-release-age=3\n";
    writeFileSync(filename, original);
    const invoke = (...args) =>
      spawnSync(
        process.execPath,
        [path.join(root, "ops/scripts/generate-npmrc.js"), ...args],
        {
          cwd: path.join(root, "packages/example"),
          encoding: "utf8",
        },
      );

    const stale = invoke("--check");
    equal(stale.status, 1, "05.01");
    match(stale.stderr, /npm run ci:generate:npmrc/, "05.02");
    equal(readFileSync(filename, "utf8"), original, "05.03");
    equal(invoke().status, 0, "05.04");
    const generated = readFileSync(filename, "utf8");
    equal(
      exclusions(generated),
      [
        "min-release-age-exclude[]=@codsen/data",
        "min-release-age-exclude[]=html-entity-codec",
      ],
      "05.05",
    );
    const modified = statSync(filename).mtimeMs;
    equal(invoke().status, 0, "05.06");
    equal(statSync(filename).mtimeMs, modified, "05.07");
    equal(invoke("--check").status, 0, "05.08");
    writeJson("packages/example/package.json", { name: "renamed" });
    equal(invoke("--check").status, 1, "05.09");
    equal(readFileSync(filename, "utf8"), generated, "05.10");
    equal(statSync(filename).mtimeMs, modified, "05.11");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test.run();
