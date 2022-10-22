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
// import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

// ------------------------------------------------------------------------------

const packageNames = readdirSync(path.resolve("packages")).filter((d) =>
  statSync(path.join("packages", d)).isDirectory()
);

const gatheredChangelogs = {};
let changelogContents;

for (let packageName of packageNames) {
  try {
    // read
    changelogContents = readFileSync(
      path.join("packages", packageName, "CHANGELOG.md"),
      "utf8"
    );

    // render markdown
    let { value } = unified()
      .data("settings", { fragment: true })
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
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
  `export const changelogs = ${JSON.stringify(gatheredChangelogs, null, 4)};\n`,
  (err) => {
    if (err) {
      throw err;
    }
    console.log(
      `\u001b[${32}m${`gatheredChangelogs.ts written OK`}\u001b[${39}m`
    );
  }
);
