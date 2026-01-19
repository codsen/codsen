import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
// import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkTypography from "remark-typography";
import { unified } from "unified";
import changelogTimeline from "./remark-conventional-commit-changelog-timeline.esm.js";

// ------------------------------------------------------------------------------

const packageNames = readdirSync(path.resolve("packages"))
  .filter((directory) =>
    statSync(path.join("packages", directory)).isDirectory(),
  )
  .sort();

const gatheredChangelogs = {};

for (let packageName of packageNames) {
  try {
    let changelogContents = readFileSync(
      path.join("packages", packageName, "CHANGELOG.md"),
      "utf8",
    );

    const { value } = unified()
      .data("settings", { fragment: true })
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(changelogTimeline, {
        dateDivLocale: "en-UK",
        dateDivMarkup: ({ year, month, day }) =>
          `${day} ${month} <span>${year}</span>`,
      })
      .use(remarkTypography)
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

writeFileSync(
  path.resolve("./data/sources/changelogs.ts"),
  `export const changelogs = ${JSON.stringify(gatheredChangelogs, null, 0)};\n`,
  "utf8",
);

console.log(
  `\u001b[${32}mGenerated ${gatheredNames.length} changelogs in data/sources/changelogs.ts\u001b[${39}m`,
);
