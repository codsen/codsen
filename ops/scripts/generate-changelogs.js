import {
  // promises as fs,
  // F_OK,
  // accessSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFile,
} from "node:fs";
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

const packageNames = readdirSync(path.resolve("packages")).filter((d) =>
  statSync(path.join("packages", d)).isDirectory(),
);

const gatheredChangelogs = {};
let changelogContents;

let uniqueH3 = new Set();

for (let packageName of packageNames) {
  try {
    // read
    changelogContents = readFileSync(
      path.join("packages", packageName, "CHANGELOG.md"),
      "utf8",
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
      .use(changelogTimeline, {
        dateDivLocale: "en-UK",
        dateDivMarkup: ({ year, month, day }) =>
          `${day} ${month} <span>${year}</span>`,
      })
      .use(remarkTypography)
      // .use(rehypeFormat)
      .use(rehypeStringify)
      .processSync(changelogContents);

    changelogContents = value;

    // if (packageName === "email-comb") {
    gatheredChangelogs[packageName] = changelogContents;
    // }
  } catch (_error) {}
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
      `\u001b[${32}m${`gatheredChangelogs.ts written OK`}\u001b[${39}m`,
    );
  },
);
