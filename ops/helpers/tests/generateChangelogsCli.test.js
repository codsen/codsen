import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";

const script = fileURLToPath(
  new URL("../../scripts/generate-changelogs.js", import.meta.url),
);
const source =
  "# Changelog\n\n## 1.0.0\n\n- WIP remove this line\n- Retained release note\n";
const dataFilename = "data/CHANGELOG.md";
const firstFilename = "packages/a-first/CHANGELOG.md";
const lastFilename = "packages/z-last/CHANGELOG.md";
const outputFilename = "data/sources/changelogs.ts";
const filenames = [dataFilename, firstFilename, lastFilename, outputFilename];

function fixture({ data = source, last = source, missingLast = false } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "generate changelogs "));
  const contents = [data, source, last, "original aggregate\n"];
  for (let i = 0; i < filenames.length; i += 1) {
    const filename = path.join(root, filenames[i]);
    mkdirSync(path.dirname(filename), { recursive: true });
    if (!missingLast || filenames[i] !== lastFilename) {
      writeFileSync(filename, contents[i]);
    }
  }
  return root;
}

function snapshot(root) {
  return filenames.map((filename) => {
    const absolute = path.join(root, filename);
    return existsSync(absolute)
      ? {
          contents: readFileSync(absolute, "utf8"),
          mtime: statSync(absolute).mtimeMs,
        }
      : null;
  });
}

function run(root, ...args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
    timeout: 10000,
  });
}

test("01 - an empty later cleaned source leaves every file untouched", () => {
  for (const ending of ["", "\n", "\r\n"]) {
    const root = fixture({ last: `WIP${ending}` });
    try {
      const before = snapshot(root);
      const result = run(root);
      equal(result.status, 1, "01.01");
      match(
        result.stderr,
        /z-last changelog:.*cleaned changelog is empty/,
        "01.02",
      );
      equal(snapshot(root), before, "01.03");
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  }
});

test("02 - a nonempty source with an empty timeline leaves every file untouched", () => {
  const root = fixture({ last: "# Changelog\n\n" });
  try {
    const before = snapshot(root);
    const result = run(root);
    equal(result.status, 1, "02.01");
    match(
      result.stderr,
      /z-last changelog: rendered changelog is empty/,
      "02.02",
    );
    equal(snapshot(root), before, "02.03");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("03 - a missing later source leaves earlier sources and output untouched", () => {
  const root = fixture({ missingLast: true });
  try {
    const before = snapshot(root);
    const result = run(root);
    equal(result.status, 1, "03.01");
    match(result.stderr, /z-last changelog:.*ENOENT/, "03.02");
    equal(snapshot(root), before, "03.03");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("04 - an empty aggregate-package source is rejected before writing", () => {
  for (const data of ["", " \n\t", "WIP\n"]) {
    const root = fixture({ data });
    try {
      const before = snapshot(root);
      const result = run(root);
      equal(result.status, 1, "04.01");
      match(
        result.stderr,
        /@codsen\/data changelog: cleaned changelog is empty/,
        "04.02",
      );
      equal(snapshot(root), before, "04.03");
    } finally {
      rmSync(root, { force: true, recursive: true });
    }
  }
});

test("05 - valid generation writes cleaned sources and complete timelines idempotently", () => {
  const root = fixture();
  try {
    const result = run(root);
    equal(result.status, 0, "05.01");
    for (const filename of [dataFilename, firstFilename, lastFilename]) {
      equal(
        readFileSync(path.join(root, filename), "utf8"),
        "# Changelog\n\n## 1.0.0\n\n- Retained release note\n",
        "05.02",
      );
    }
    const generated = readFileSync(path.join(root, outputFilename), "utf8");
    const timelines = JSON.parse(
      generated.slice("export const changelogs = ".length, -2),
    );
    equal(Object.keys(timelines), ["a-first", "z-last"], "05.03");
    for (const timeline of Object.values(timelines)) {
      ok(timeline.trim(), "05.04");
      match(timeline, /Retained release note/, "05.05");
      equal(timeline.includes("WIP"), false, "05.06");
    }
    const before = snapshot(root);
    equal(run(root, "--check").status, 0, "05.07");
    equal(run(root).status, 0, "05.08");
    equal(snapshot(root), before, "05.09");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test("06 - stale check mode reports its repair command without changing files", () => {
  const root = fixture();
  try {
    const before = snapshot(root);
    const result = run(root, "--check");
    equal(result.status, 1, "06.01");
    match(
      result.stderr,
      /Generated file is stale: data[\\/]CHANGELOG\.md/,
      "06.02",
    );
    match(result.stderr, /npm run ci:generate:changelogs/, "06.03");
    equal(snapshot(root), before, "06.04");
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

test.run();
