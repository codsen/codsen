/**
 * @name lerna-clean-changelogs
 * @fileoverview Removes frivolous entries from commitizen generated changelogs
 * @version 2.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/lerna-clean-changelogs/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.lernaCleanChangelogs = {}));
}(this, (function (exports) { 'use strict';

var version$1 = "2.0.16";

const version = version$1;
function isStr(something) {
    return typeof something === "string";
}
function cleanChangelogs(changelogContents) {
    // validate the first input argument:
    if (changelogContents === undefined) {
        throw new Error(`lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!`);
    }
    else if (!isStr(changelogContents)) {
        throw new Error(`lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ${Array.isArray(changelogContents) ? "array" : typeof changelogContents}, equal to:\n${JSON.stringify(changelogContents, null, 4)}`);
    }
    let final;
    let lastLineWasEmpty = false;
    if (typeof changelogContents === "string" &&
        changelogContents.length &&
        (!changelogContents.includes("\n") || !changelogContents.includes("\r"))) {
        const changelogEndedWithLinebreak = isStr(changelogContents) &&
            changelogContents.length &&
            (changelogContents[changelogContents.length - 1] === "\n" ||
                changelogContents[changelogContents.length - 1] === "\r");
        // eslint-disable-next-line no-param-reassign
        changelogContents = changelogContents
            .trim()
            .replace(/(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g, "$1commit/");
        const linesArr = changelogContents.split(/\r?\n/);
        // console.log(
        //   `${`\u001b[${33}m${`linesArr`}\u001b[${39}m`} = ${JSON.stringify(
        //     linesArr,
        //     null,
        //     4
        //   )}`
        // );
        // ███
        // 1. remove links from titles, for example, turn:
        // ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
        // into:
        // ## 2.9.1 (2018-12-27)
        linesArr.forEach((line, i) => {
            if (line.startsWith("#")) {
                linesArr[i] = line.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g, "$1 $2");
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
        // ███
        // 2. remove bump-only entries, for example
        // "## 2.9.2 (2018-12-27)",
        // "",
        // "**Note:** Version bump only for package ranges-apply",
        //
        // and also remove anything containing "WIP" (case-insensitive)
        const newLinesArr = [];
        for (let i = linesArr.length; i--;) {
            if (linesArr[i].startsWith("**Note:** Version bump only") ||
                linesArr[i].toLowerCase().includes("wip")) {
                // delete all the blank lines above the culprit:
                while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim() && i) {
                    i -= 1;
                }
                // after that, delete the title, but only if there were no other entries:
                if (i &&
                    isStr(linesArr[i - 1]) &&
                    linesArr[i - 1].trim().startsWith("#")) {
                    i -= 1;
                }
                // delete all the blank lines above the culprit:
                while (isStr(linesArr[i - 1]) && !linesArr[i - 1].trim() && i) {
                    i -= 1;
                }
            }
            else if (!linesArr[i].trim()) {
                // maybe this line is empty or contains only whitespace characters (spaces, tabs etc)?
                if (!lastLineWasEmpty) {
                    // we push trimmed lines to prevent accidental whitespace characters
                    // sitting on an empty line:
                    newLinesArr.unshift(linesArr[i].trim());
                    lastLineWasEmpty = true;
                }
            }
            // fix asterisk list items into dash (Prettier default):
            else if (linesArr[i][0] === "*" && linesArr[i][1] === " ") {
                newLinesArr.unshift(`- ${linesArr[i].slice(2)}`);
            }
            else {
                newLinesArr.unshift(linesArr[i]);
            }
            // reset:
            if (linesArr[i].trim()) {
                lastLineWasEmpty = false;
            }
        }
        final = `${newLinesArr.join("\n")}${changelogEndedWithLinebreak ? "\n" : ""}`;
    }
    return {
        version,
        res: final || changelogContents,
    };
}

exports.cleanChangelogs = cleanChangelogs;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
