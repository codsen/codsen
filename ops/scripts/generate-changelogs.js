import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { cleanChangelogs } from "../../packages/lerna-clean-changelogs/dist/lerna-clean-changelogs.esm.js";
import changelogTimeline from "../../packages/remark-conventional-commit-changelog-timeline/dist/remark-conventional-commit-changelog-timeline.esm.js";
import remarkTypography from "../../packages/remark-typography/dist/remark-typography.esm.js";
import { writeGeneratedFile } from "../helpers/generatedFiles.js";

const arguments_ = process.argv.slice(2);
if (arguments_.some((argument) => argument !== "--check")) {
  throw new Error(
    `generate-changelogs.js: unsupported argument(s): ${arguments_.join(", ")}`,
  );
}
const mode = arguments_.includes("--check") ? "check" : "write";

// ------------------------------------------------------------------------------

const packageNames = readdirSync(path.resolve("packages"))
  .filter((directory) =>
    statSync(path.join("packages", directory)).isDirectory(),
  )
  .sort();

const gatheredChangelogs = {};
const pendingFiles = [];
// Typography remains a separate editorial step. The timeline renderer itself
// reads Markdown directly and has no Unified or HTML-parser dependency.
const typography = remark().use(remarkGfm).use(remarkTypography);

function cleanSourceChangelog(filename, label) {
  try {
    const original = readFileSync(filename, "utf8");
    const cleaned = cleanChangelogs(original, { extras: true }).res;
    if (!cleaned.trim()) {
      throw new Error("cleaned changelog is empty");
    }
    pendingFiles.push({
      contents: cleaned,
      filename: path.resolve(filename),
    });
    return cleaned;
  } catch (error) {
    throw new Error(
      `Could not clean the ${label} changelog: ${error.message}`,
      {
        cause: error,
      },
    );
  }
}

cleanSourceChangelog(path.join("data", "CHANGELOG.md"), "@codsen/data");

for (let packageName of packageNames) {
  try {
    const changelogFilename = path.join(
      "packages",
      packageName,
      "CHANGELOG.md",
    );
    let changelogContents = cleanSourceChangelog(
      changelogFilename,
      packageName,
    );

    changelogContents = changelogTimeline(
      String(typography.processSync(changelogContents)),
    );
    if (!changelogContents.trim()) {
      throw new Error("rendered changelog is empty");
    }
    gatheredChangelogs[packageName] = changelogContents;
  } catch (error) {
    throw new Error(
      `Could not generate the ${packageName} changelog: ${error.message}`,
      { cause: error },
    );
  }
}

const gatheredNames = Object.keys(gatheredChangelogs).sort();
if (JSON.stringify(gatheredNames) !== JSON.stringify(packageNames)) {
  throw new Error(
    `Expected ${packageNames.length} changelogs, generated ${gatheredNames.length}`,
  );
}

pendingFiles.push({
  contents: `export const changelogs = ${JSON.stringify(gatheredChangelogs, null, 0)};\n`,
  filename: path.resolve("./data/sources/changelogs.ts"),
});

// Read, clean and render every source before replacing any file. A bad later
// changelog must not leave earlier sources changed after generation fails.
for (const pendingFile of pendingFiles) {
  await writeGeneratedFile({
    ...pendingFile,
    fixCommand: "npm run ci:generate:changelogs",
    mode,
  });
}

console.log(
  `\u001b[${32}m${mode === "check" ? "Verified" : "Generated"} ${gatheredNames.length} changelogs in data/sources/changelogs.ts\u001b[${39}m`,
);
