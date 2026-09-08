import {
  detectEol,
  type EolChar,
  formatDiagnosticValue,
  isStr,
} from "codsen-utils";
import { version as v } from "../package.json";
import { protectedLiteralLines } from "./literals";
import { findRemovedLines } from "./sections";
import { removeVersionLink } from "./version-links";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  extras: boolean;
}

const defaults: Opts = {
  extras: false,
};

function cleanChangelogs(
  changelog: string,
  opts?: Partial<Opts>,
): {
  version: string;
  res: string;
} {
  // validate the first input argument:
  if (changelog === undefined) {
    throw new Error(
      `lerna-clean-changelogs/cleanChangelogs(): [THROW_ID_01] The first input argument is missing!`,
    );
  } else if (!isStr(changelog)) {
    throw new Error(
      `lerna-clean-changelogs/cleanChangelogs(): [THROW_ID_02] The first input argument must be a string! It was given as ${
        Array.isArray(changelog) ? "array" : typeof changelog
      }, equal to:\n${formatDiagnosticValue(changelog, 4)}`,
    );
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV && console.log();

  let currentLineBreakStyle: EolChar = detectEol(changelog) || "\n";

  DEV &&
    console.log(
      `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentLineBreakStyle`}\u001b[${39}m`} = ${JSON.stringify(
        currentLineBreakStyle,
        null,
        4,
      )}`,
    );

  let final;
  let lastLineWasEmpty = false;

  if (typeof changelog === "string" && changelog?.trim()) {
    DEV && console.log();
    /* c8 ignore next */
    let changelogEndedWithLinebreak =
      isStr(changelog) &&
      !!changelog.length &&
      (changelog[~-changelog.length] === "\n" ||
        changelog[~-changelog.length] === "\r");

    let linesArr: string[] = [];
    let literalLines: Set<number> | undefined;
    let headingExclusions =
      resolvedOpts.extras && changelog.includes("<")
        ? new Set<number>()
        : undefined;
    // Code needs a fence run, four spaces or a tab; heading links also need
    // the existing HTML block boundaries when extras is enabled.
    if (/```|~~~| {4}|\t/.test(changelog) || headingExclusions) {
      linesArr = changelog.split(/\r?\n/);
      // The final empty split item represents the EOF newline appended below.
      if (changelogEndedWithLinebreak && linesArr[linesArr.length - 1] === "") {
        linesArr.pop();
      }
      literalLines = protectedLiteralLines(linesArr, headingExclusions);
      if (!headingExclusions?.size) headingExclusions = undefined;
    }
    if (!literalLines && !headingExclusions) {
      // Preserve the established non-literal cleanup.
      changelog = changelog
        .trim()
        .replace(
          /(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g,
          "$1commit/",
        );
      linesArr = changelog.split(/\r?\n/);
    } else {
      let first = 0;
      let end = linesArr.length;
      while (
        first < end &&
        !literalLines?.has(first) &&
        !linesArr[first].trim()
      ) {
        first += 1;
      }
      while (
        end > first &&
        !literalLines?.has(end - 1) &&
        !linesArr[end - 1].trim()
      ) {
        end -= 1;
      }
      if (first || end !== linesArr.length) {
        if (literalLines) {
          const rebased = new Set<number>();
          for (const index of literalLines) {
            if (index >= first && index < end) rebased.add(index - first);
          }
          literalLines = rebased;
        }
        if (headingExclusions) {
          const rebased = new Set<number>();
          for (const index of headingExclusions) {
            if (index >= first && index < end) rebased.add(index - first);
          }
          headingExclusions = rebased;
        }
        linesArr = linesArr.slice(first, end);
      }
      if (!literalLines?.has(0)) {
        linesArr[0] = linesArr[0].replace(/^\s+/, "");
      }
      if (!literalLines?.has(linesArr.length - 1)) {
        linesArr[linesArr.length - 1] = linesArr[linesArr.length - 1].replace(
          /\s+$/,
          "",
        );
      }
      for (let i = 0; i < linesArr.length; i += 1) {
        if (!literalLines?.has(i)) {
          linesArr[i] = linesArr[i].replace(
            /(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g,
            "$1commit/",
          );
        }
      }
    }
    DEV &&
      console.log(
        `${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
          linesArr,
          null,
          4,
        )}`,
      );

    if (resolvedOpts.extras) {
      // ███
      // 1. remove links from titles, for example, turn:
      // ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
      // into:
      // ## 2.9.1 (2018-12-27)
      linesArr.forEach((line, i) => {
        if (literalLines?.has(i)) return;
        if (!headingExclusions?.has(i)) linesArr[i] = removeVersionLink(line);
        if (i && linesArr[i]?.startsWith("# ")) {
          linesArr[i] = `#${linesArr[i]}`;
        }
      });
      DEV &&
        console.log(
          `AFTER STEP 1, ${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
            linesArr,
            null,
            4,
          )}`,
        );
    }

    // ███
    // 2. remove bump-only entries, for example
    // "## 2.9.2 (2018-12-27)",
    // "",
    // "**Note:** Version bump only for package ranges-apply",
    //
    // and also remove anything containing "WIP" (case-insensitive)

    const removedLines = findRemovedLines(
      linesArr,
      resolvedOpts.extras,
      literalLines,
    );
    let newLinesArr = [];
    for (let i = linesArr.length; i--; ) {
      DEV &&
        console.log(
          `----------------${`\u001b[${36}m${i}\u001b[${39}m`}\n${`\u001b[${33}m${`linesArr[i]`}\u001b[${39}m`} = ${JSON.stringify(
            linesArr[i],
            null,
            4,
          )}`,
        );
      if (literalLines?.has(i)) {
        newLinesArr.push(linesArr[i]);
        lastLineWasEmpty = false;
        continue;
      }
      if (removedLines?.has(i)) continue;
      if (!linesArr[i]?.trim()) {
        // maybe this line is empty or contains only whitespace characters (spaces, tabs etc)?
        if (newLinesArr.length && !lastLineWasEmpty) {
          // we push trimmed lines to prevent accidental whitespace characters
          // sitting on an empty line:
          newLinesArr.push(linesArr[i]?.trim());
          lastLineWasEmpty = true;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`lastLineWasEmpty`}\u001b[${39}m`} = ${lastLineWasEmpty}`,
            );
        }
      }
      // Normalize list markers without turning thematic breaks into list items.
      else if (
        linesArr[i][0] === "*" &&
        linesArr[i][1] === " " &&
        !/^(?:\*[ \t]*){3,}$/.test(linesArr[i])
      ) {
        newLinesArr.push(`- ${linesArr[i].slice(2)}`);
      } else {
        newLinesArr.push(linesArr[i]);
      }

      // reset:
      if (linesArr[i]?.trim()) {
        lastLineWasEmpty = false;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`lastLineWasEmpty`}\u001b[${39}m`} = ${lastLineWasEmpty}`,
          );
      }
    }

    // Removing an initial section can expose a blank line at the new boundary.
    if (newLinesArr[newLinesArr.length - 1] === "") newLinesArr.pop();

    /* c8 ignore next */
    final = `${newLinesArr.reverse().join(currentLineBreakStyle)}${
      changelogEndedWithLinebreak ? currentLineBreakStyle : ""
    }`;
  }

  return {
    version,
    res: final ?? changelog,
  };
}

export { cleanChangelogs, defaults, version };
