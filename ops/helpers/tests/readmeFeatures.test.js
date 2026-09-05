import { rejects } from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "uvu";
import { equal } from "uvu/assert";
import readme from "../../lect/plugins/readme.js";

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), "readme-features-"));
  return {
    root,
    currentYear: 2026,
    pack: { name: "example", description: "Example" },
    packageManifests: [],
  };
}

test("01 - opted-in features precede installation and survive check mode", async () => {
  const state = fixture();
  state.pack.lect = {
    readme: {
      features: {
        summary: " Match your own vocabulary. ",
        items: [" Preserve exact strings. ", "Explain **every** suggestion."],
      },
    },
  };
  try {
    await readme({ state });
    const filename = path.join(state.root, "README.md");
    const contents = readFileSync(filename, "utf8");
    equal(
      contents.slice(
        contents.indexOf("## Features"),
        contents.indexOf("## Install"),
      ),
      "## Features\n\nMatch your own vocabulary.\n\n- Preserve exact strings.\n- Explain **every** suggestion.\n\n",
      "01.01",
    );
    await readme({ state, mode: "check" });
    equal(readFileSync(filename, "utf8"), contents, "01.02");
    delete state.pack.lect;
    await rejects(readme({ state, mode: "check" }));
    equal(readFileSync(filename, "utf8"), contents, "01.03");
    await readme({ state });
    equal(
      readFileSync(filename, "utf8").includes("## Features"),
      false,
      "01.04",
    );
  } finally {
    rmSync(state.root, { recursive: true, force: true });
  }
});

test("02 - packages without feature copy keep their existing README shape", async () => {
  const state = fixture();
  try {
    await readme({ state });
    const contents = readFileSync(path.join(state.root, "README.md"), "utf8");
    equal(contents.includes("## Features"), false, "02.01");
    equal(
      contents.includes("## Install\n\n```bash\nnpm i example\n```"),
      true,
      "02.02",
    );
  } finally {
    rmSync(state.root, { recursive: true, force: true });
  }
});

test("03 - malformed feature copy fails before overwriting the README", async () => {
  const state = fixture();
  try {
    await readme({ state });
    const filename = path.join(state.root, "README.md");
    const contents = readFileSync(filename, "utf8");
    for (const features of [
      null,
      "summary",
      { summary: " ", items: ["Feature"] },
      { summary: "Summary", items: [] },
      { summary: "Summary", items: [42] },
      { summary: "Summary", items: [" "] },
    ]) {
      state.pack.lect = { readme: { features } };
      await rejects(readme({ state }), /lect\.readme\.features/);
    }
    equal(readFileSync(filename, "utf8"), contents, "03.01");
  } finally {
    rmSync(state.root, { recursive: true, force: true });
  }
});

test.run();
