import { isStr, EolChar, detectEol } from "codsen-utils";
import { version as v } from "../package.json";

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
  opts?: Partial<Opts>
): {
  version: string;
  res: string;
} {
  // validate the first input argument:
  if (changelog === undefined) {
    throw new Error(
      `lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!`
    );
  } else if (!isStr(changelog)) {
    throw new Error(
      `lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ${
        Array.isArray(changelog) ? "array" : typeof changelog
      }, equal to:\n${JSON.stringify(changelog, null, 4)}`
    );
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV && console.log(`037`);

  let currentLineBreakStyle: EolChar = detectEol(changelog) || "\n";

  DEV &&
    console.log(
      `043 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currentLineBreakStyle`}\u001b[${39}m`} = ${JSON.stringify(
        currentLineBreakStyle,
        null,
        4
      )}`
    );

  let final;
  let lastLineWasEmpty = false;

  if (typeof changelog === "string" && changelog?.trim()) {
    DEV && console.log(`054`);
    /* c8 ignore next */
    let changelogEndedWithLinebreak =
      isStr(changelog) &&
      !!changelog.length &&
      (changelog[~-changelog.length] === "\n" ||
        changelog[~-changelog.length] === "\r");

    // eslint-disable-next-line no-param-reassign
    changelog = changelog
      ?.trim()
      .replace(
        /(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g,
        "$1commit/"
      );
    let linesArr = changelog.split(/\r?\n/);
    DEV &&
      console.log(
        `072 ${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
          linesArr,
          null,
          4
        )}`
      );

    if (resolvedOpts.extras) {
      // ███
      // 1. remove links from titles, for example, turn:
      // ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
      // into:
      // ## 2.9.1 (2018-12-27)
      linesArr.forEach((line, i) => {
        if (line?.startsWith("#")) {
          linesArr[i] = line.replace(
            /(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g,
            "$1 $2"
          );
        }
        if (i && linesArr[i]?.startsWith("# ")) {
          linesArr[i] = `#${linesArr[i]}`;
        }
      });
      DEV &&
        console.log(
          `098 AFTER STEP 1, ${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
            linesArr,
            null,
            4
          )}`
        );
    }

    // ███
    // 2. remove bump-only entries, for example
    // "## 2.9.2 (2018-12-27)",
    // "",
    // "**Note:** Version bump only for package ranges-apply",
    //
    // and also remove anything containing "WIP" (case-insensitive)

    let newLinesArr = [];
    for (let i = linesArr.length; i--; ) {
      DEV &&
        console.log(
          `----------------${`\u001b[${36}m${i}\u001b[${39}m`}\n${`\u001b[${33}m${`linesArr[i]`}\u001b[${39}m`} = ${JSON.stringify(
            linesArr[i],
            null,
            4
          )}`
        );
      if (
        linesArr[i]?.startsWith("**Note:** Version bump only") ||
        (resolvedOpts.extras && linesArr[i].toLowerCase().includes("wip"))
      ) {
        // delete all the blank lines above the culprit:
        while (i && isStr(linesArr[~-i]) && !linesArr[~-i]?.trim()) {
          i -= 1;
        }
        // after that, delete the title, but only if there were no other entries:
        if (
          i &&
          isStr(linesArr[~-i]) &&
          linesArr[~-i]?.trim()?.startsWith("#")
        ) {
          i -= 1;
        }
        // delete all the blank lines above the culprit:
        while (i && isStr(linesArr[~-i]) && !linesArr[~-i]?.trim()) {
          i -= 1;
        }
      } else if (!linesArr[i]?.trim()) {
        // maybe this line is empty or contains only whitespace characters (spaces, tabs etc)?
        if (!lastLineWasEmpty) {
          // we push trimmed lines to prevent accidental whitespace characters
          // sitting on an empty line:
          newLinesArr.unshift(linesArr[i]?.trim());
          lastLineWasEmpty = true;
          DEV &&
            console.log(
              `153 SET ${`\u001b[${33}m${`lastLineWasEmpty`}\u001b[${39}m`} = ${lastLineWasEmpty}`
            );
        }
      }
      // fix asterisk list items into dash (Prettier default):
      else if (linesArr[i][0] === "*" && linesArr[i][1] === " ") {
        newLinesArr.unshift(`- ${linesArr[i].slice(2)}`);
      } else {
        newLinesArr.unshift(linesArr[i]);
      }

      // reset:
      if (linesArr[i]?.trim()) {
        lastLineWasEmpty = false;
        DEV &&
          console.log(
            `169 SET ${`\u001b[${33}m${`lastLineWasEmpty`}\u001b[${39}m`} = ${lastLineWasEmpty}`
          );
      }
    }

    /* c8 ignore next */
    final = `${newLinesArr.join(currentLineBreakStyle)}${
      changelogEndedWithLinebreak ? currentLineBreakStyle : ""
    }`;
  }

  return {
    version,
    res: final || changelog,
  };
}

export { cleanChangelogs, defaults, version };
