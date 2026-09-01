import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
// import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
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

async function cleanSourceChangelog(filename, label) {
  try {
    const original = readFileSync(filename, "utf8");
    const cleaned = cleanChangelogs(original, { extras: true }).res;
    await writeGeneratedFile({
      contents: cleaned,
      filename: path.resolve(filename),
      fixCommand: "npm run ci:generate:changelogs",
      mode,
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

await cleanSourceChangelog(path.join("data", "CHANGELOG.md"), "@codsen/data");

for (let packageName of packageNames) {
  try {
    const changelogFilename = path.join(
      "packages",
      packageName,
      "CHANGELOG.md",
    );
    let changelogContents = await cleanSourceChangelog(
      changelogFilename,
      packageName,
    );

    const { value } = unified()
      .data("settings", { fragment: true })
      .use(remarkParse)
      .use(remarkGfm)
      // Typography maps MDAST phrasing nodes; keep it before MDAST becomes HAST.
      .use(remarkTypography)
      .use(remarkRehype)
      // The timeline plugin intentionally receives HAST.
      .use(changelogTimeline, {
        dateDivLocale: "en-UK",
        dateDivMarkup: ({ year, month, day }) =>
          `${day} ${month} <span>${year}</span>`,
      })
      // .use(rehypeFormat)
      .use(rehypeStringify)
      .processSync(changelogContents);

    changelogContents = String(value);
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

await writeGeneratedFile({
  contents: `export const changelogs = ${JSON.stringify(gatheredChangelogs, null, 0)};\n`,
  filename: path.resolve("./data/sources/changelogs.ts"),
  fixCommand: "npm run ci:generate:changelogs",
  mode,
});

console.log(
  `\u001b[${32}m${mode === "check" ? "Verified" : "Generated"} ${gatheredNames.length} changelogs in data/sources/changelogs.ts\u001b[${39}m`,
);
