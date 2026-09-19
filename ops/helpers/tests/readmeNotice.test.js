import { rejects } from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "uvu";
import { equal } from "uvu/assert";
import readme from "../../lect/plugins/readme.js";

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "readme-notice-"));
  return {
    root,
    currentYear: 2026,
    pack: { name: "example", description: "Example" },
    packageManifests: [],
  };
}

test("01 - notices precede installation and repeated generation preserves the file", async () => {
  const state = fixture();
  const notice =
    "**Use [replacement](https://example.com/replacement).**\n\nRead the migration guide before switching.";
  state.pack.lect = { readme: { notice: ` ${notice} ` } };
  try {
    await readme({ state });
    const filename = path.join(state.root, "README.md");
    const contents = readFileSync(filename, "utf8");
    equal(
      contents.includes(`</p>\n\n${notice}\n\n**No dependencies`),
      true,
      "01.01",
    );
    equal(
      contents.indexOf(notice) < contents.indexOf("## Install"),
      true,
      "01.02",
    );
    const before = statSync(filename);
    await readme({ state });
    await readme({ state, mode: "check" });
    equal(statSync(filename).mtimeMs, before.mtimeMs, "01.03");
    equal(readFileSync(filename, "utf8"), contents, "01.04");

    state.pack.lect.readme.notice = "Updated migration notice.";
    await rejects(readme({ state, mode: "check" }), /Generated file is stale/);
    equal(readFileSync(filename, "utf8"), contents, "01.05");
    await readme({ state });
    equal(readFileSync(filename, "utf8").includes(notice), false, "01.06");
    await readme({ state, mode: "check" });
  } finally {
    rmSync(state.root, { recursive: true, force: true });
  }
});

test("02 - removing a notice restores the README for packages without notices", async () => {
  const state = fixture();
  try {
    await readme({ state });
    const filename = path.join(state.root, "README.md");
    const original = readFileSync(filename, "utf8");
    state.pack.lect = { readme: { notice: "Migration notice." } };
    await readme({ state });
    delete state.pack.lect.readme.notice;
    await rejects(readme({ state, mode: "check" }), /Generated file is stale/);
    await readme({ state });
    equal(readFileSync(filename, "utf8"), original, "02.01");
    await readme({ state, mode: "check" });
  } finally {
    rmSync(state.root, { recursive: true, force: true });
  }
});

test("03 - malformed notices fail before overwriting the README", async () => {
  const state = fixture();
  try {
    await readme({ state });
    const filename = path.join(state.root, "README.md");
    const original = readFileSync(filename, "utf8");
    for (const notice of [null, false, 42, {}, [], "", " \n "]) {
      state.pack.lect = { readme: { notice } };
      await rejects(readme({ state }), /lect\.readme\.notice/);
    }
    equal(readFileSync(filename, "utf8"), original, "03.01");
  } finally {
    rmSync(state.root, { recursive: true, force: true });
  }
});

test.run();
