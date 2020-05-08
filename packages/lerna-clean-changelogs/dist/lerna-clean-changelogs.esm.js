/**
 * lerna-clean-changelogs
 * Cleans all the crap from Lerna and Conventional Commits-generated changelogs
 * Version: 1.3.55
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs
 */

var version = "1.3.55";

function isStr(something) {
  return typeof something === "string";
}
function c(changelogContents) {
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
    const changelogEndedWithLinebreak =
      isStr(changelogContents) &&
      changelogContents.length &&
      (changelogContents[changelogContents.length - 1] === "\n" ||
        changelogContents[changelogContents.length - 1] === "\r");
    changelogContents = changelogContents.trim();
    const linesArr = changelogContents.split(/\r?\n/);
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
    const newLinesArr = [];
    for (let i = linesArr.length; i--; ) {
      if (
        linesArr[i].startsWith("**Note:** Version bump only") ||
        linesArr[i].toLowerCase().includes("wip")
      ) {
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim() && i) {
          i -= 1;
        }
        if (
          i &&
          isStr(linesArr[i - 1]) &&
          linesArr[i - 1].trim().startsWith("#")
        ) {
          i -= 1;
        }
        while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim() && i) {
          i -= 1;
        }
      } else if (!linesArr[i].trim()) {
        if (!lastLineWasEmpty) {
          newLinesArr.unshift(linesArr[i].trim());
          lastLineWasEmpty = true;
        }
      }
      else if (linesArr[i][0] === "*" && linesArr[i][1] === " ") {
        newLinesArr.unshift(`- ${linesArr[i].slice(2)}`);
      } else {
        newLinesArr.unshift(linesArr[i]);
      }
      if (linesArr[i].trim()) {
        lastLineWasEmpty = false;
      }
    }
    final = `${newLinesArr.join("\n")}${
      changelogEndedWithLinebreak ? "\n" : ""
    }`;
  }
  return {
    version,
    res: final || changelogContents,
  };
}

export default c;
