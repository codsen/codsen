#!/usr/bin/env node
/* eslint-disable no-unused-vars */

import {
  promises as fs,
  F_OK,
  accessSync,
  readdirSync,
  statSync,
  writeFile,
  readFileSync,
} from "fs";
import path from "path";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import changelogTimeline from "remark-conventional-commit-changelog-timeline";
import remarkTypography from "remark-typography";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

// ------------------------------------------------------------------------------

const packageNames = readdirSync(path.resolve("packages")).filter((d) =>
  statSync(path.join("packages", d)).isDirectory()
);

const gatheredChangelogs = {};
let changelogContents;

let uniqueH3 = new Set();

for (let packageName of packageNames) {
  try {
    // read
    changelogContents = readFileSync(
      path.join("packages", packageName, "CHANGELOG.md"),
      "utf8"
    );

    // EXTRAS:
    changelogContents
      .split(/(\r?\n)/)
      .filter((l) => l.startsWith("### "))
      .map((l) => l.slice(4))
      .forEach((l) => {
        uniqueH3.add(l);
      });

    // render markdown
    let { value } = unified()
      .data("settings", { fragment: true })
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(changelogTimeline)
      .use(remarkTypography)
      // .use(rehypeFormat)
      .use(rehypeStringify)
      .processSync(changelogContents);

    changelogContents = value;

    // if (packageName === "email-comb") {
    gatheredChangelogs[packageName] = changelogContents;
    // }
  } catch (error) {
    // nothing happens and we skip it
    continue;
  }
}

// write files
// -----------------------------------------------------------------------------

writeFile(
  path.resolve("./data/sources/changelogs.ts"),
  // path.resolve("./data/sources/changelogs.html"),
  `export const changelogs = ${JSON.stringify(gatheredChangelogs, null, 0)};\n`,
  // gatheredChangelogs["email-comb"],
  // [...uniqueH3].join("\n").trim(),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(
      `\u001b[${32}m${`gatheredChangelogs.ts written OK`}\u001b[${39}m`
    );
  }
);
