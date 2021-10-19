import { version as v } from "../package.json";
const version: string = v;

function isStr(something: string): any {
  return typeof something === "string";
}

function cleanChangelogs(
  changelogContents: string,
  extras = false
): {
  version: string;
  res: string;
} {
  // validate the first input argument:
  if (changelogContents === undefined) {
    throw new Error(
      `lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!`
    );
  } else if (!isStr(changelogContents)) {
    throw new Error(
      `lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ${
        Array.isArray(changelogContents) ? "array" : typeof changelogContents
      }, equal to:\n${JSON.stringify(changelogContents, null, 4)}`
    );
  }

  let final;
  let lastLineWasEmpty = false;

  if (
    typeof changelogContents === "string" &&
    changelogContents.length &&
    (!changelogContents.includes("\n") || !changelogContents.includes("\r"))
  ) {
    /* istanbul ignore next */
    const changelogEndedWithLinebreak =
      isStr(changelogContents) &&
      changelogContents.length &&
      (changelogContents[changelogContents.length - 1] === "\n" ||
        changelogContents[changelogContents.length - 1] === "\r");

    // eslint-disable-next-line no-param-reassign
    changelogContents = changelogContents
      .trim()
      .replace(
        /(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g,
        "$1commit/"
      );
    const linesArr = changelogContents.split(/\r?\n/);
    // console.log(
    //   `${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
    //     linesArr,
    //     null,
    //     4
    //   )}`
    // );

    if (extras) {
      // ███
      // 1. remove links from titles, for example, turn:
      // ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
      // into:
      // ## 2.9.1 (2018-12-27)
      linesArr.forEach((line, i) => {
        if (line.startsWith("#")) {
          linesArr[i] = line.replace(
            /(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g,
            "$1 $2"
          );
        }
        if (i && linesArr[i].startsWith("# ")) {
          linesArr[i] = `#${linesArr[i]}`;
        }
      });
      // console.log(
      //   `062 AFTER STEP 1, ${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
      //     linesArr,
      //     null,
      //     4
      //   )}`
      // );
    }

    // ███
    // 2. remove bump-only entries, for example
    // "## 2.9.2 (2018-12-27)",
    // "",
    // "**Note:** Version bump only for package ranges-apply",
    //
    // and also remove anything containing "WIP" (case-insensitive)

    const newLinesArr = [];
    for (let i = linesArr.length; i--; ) {
      console.log(
        `----------------${`\u001b[${36}m${i}\u001b[${39}m`}\n${`\u001b[${33}m${`linesArr[i]`}\u001b[${39}m`} = ${JSON.stringify(
          linesArr[i],
          null,
          4
        )}`
      );
      if (
        linesArr[i].startsWith("**Note:** Version bump only") ||
        (extras && linesArr[i].toLowerCase().includes("wip"))
      ) {
        // delete all the blank lines above the culprit:
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim() && i) {
          i -= 1;
        }
        // after that, delete the title, but only if there were no other entries:
        if (
          i &&
          isStr(linesArr[i - 1]) &&
          linesArr[i - 1].trim().startsWith("#")
        ) {
          i -= 1;
        }
        // delete all the blank lines above the culprit:
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim() && i) {
          i -= 1;
        }
      } else if (!linesArr[i].trim()) {
        // maybe this line is empty or contains only whitespace characters (spaces, tabs etc)?
        if (!lastLineWasEmpty) {
          // we push trimmed lines to prevent accidental whitespace characters
          // sitting on an empty line:
          newLinesArr.unshift(linesArr[i].trim());
          lastLineWasEmpty = true;
          console.log(
            `130 SET ${`\u001b[${33}m${`lastLineWasEmpty`}\u001b[${39}m`} = ${lastLineWasEmpty}`
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
      if (linesArr[i].trim()) {
        lastLineWasEmpty = false;
        console.log(
          `145 SET ${`\u001b[${33}m${`lastLineWasEmpty`}\u001b[${39}m`} = ${lastLineWasEmpty}`
        );
      }
    }

    /* istanbul ignore next */
    final = `${newLinesArr.join("\n")}${
      changelogEndedWithLinebreak ? "\n" : ""
    }`;
  }

  return {
    version,
    res: final || changelogContents,
  };
}

export { cleanChangelogs, version };
