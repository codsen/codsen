/**
 * string-collapse-white-space
 * Efficient collapsing of white space with optional outer- and/or line-trimming and HTML tag recognition
 * Version: 5.2.19
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-white-space
 */

import replaceSlicesArr from 'ranges-apply';
import rangesMerge from 'ranges-merge';
import { matchLeftIncl } from 'string-match-left-right';

function collapse(str, originalOpts) {
  function charCodeBetweenInclusive(character, from, end) {
    return character.charCodeAt(0) >= from && character.charCodeAt(0) <= end;
  }
  function isSpaceOrLeftBracket(character) {
    return (
      typeof character === "string" && (character === "<" || !character.trim())
    );
  }
  if (typeof str !== "string") {
    throw new Error(
      `string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(
      `string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (!str.length) {
    return "";
  }
  const finalIndexesToDelete = [];
  const defaults = {
    trimStart: true,
    trimEnd: true,
    trimLines: false,
    trimnbsp: false,
    recogniseHTML: true,
    removeEmptyLines: false,
    returnRangesOnly: false,
    limitConsecutiveEmptyLinesTo: 0,
  };
  const opts = { ...defaults, ...originalOpts };
  let preliminaryIndexesToDelete;
  if (opts.recogniseHTML) {
    preliminaryIndexesToDelete = [];
  }
  let spacesEndAt = null;
  let whiteSpaceEndsAt = null;
  let lineWhiteSpaceEndsAt = null;
  let endingOfTheLine = false;
  let stateWithinTag = false;
  let whiteSpaceWithinTagEndsAt = null;
  let tagMatched = false;
  let tagCanEndHere = false;
  const count = {};
  let bail = false;
  const resetCounts = (obj) => {
    obj.equalDoubleQuoteCombo = 0;
    obj.equalOnly = 0;
    obj.doubleQuoteOnly = 0;
    obj.spacesBetweenLetterChunks = 0;
    obj.linebreaks = 0;
  };
  let bracketJustFound = false;
  if (opts.recogniseHTML) {
    resetCounts(count);
  }
  let lastLineBreaksLastCharIndex;
  let consecutiveLineBreakCount = 0;
  for (let i = str.length; i--; ) {
    if (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n")) {
      consecutiveLineBreakCount += 1;
    } else if (str[i].trim()) {
      consecutiveLineBreakCount = 0;
    }
    if (str[i] === " ") {
      if (spacesEndAt === null) {
        spacesEndAt = i;
      }
    } else if (spacesEndAt !== null) {
      if (i + 1 !== spacesEndAt) {
        finalIndexesToDelete.push([i + 1, spacesEndAt]);
      }
      spacesEndAt = null;
    }
    if (
      str[i].trim() === "" &&
      ((!opts.trimnbsp && str[i] !== "\xa0") || opts.trimnbsp)
    ) {
      if (whiteSpaceEndsAt === null) {
        whiteSpaceEndsAt = i;
      }
      if (str[i] !== "\n" && str[i] !== "\r" && lineWhiteSpaceEndsAt === null) {
        lineWhiteSpaceEndsAt = i + 1;
      }
      if (str[i] === "\n" || str[i] === "\r") {
        if (lineWhiteSpaceEndsAt !== null) {
          if (opts.trimLines) {
            finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
          }
          lineWhiteSpaceEndsAt = null;
        }
        if (str[i - 1] !== "\n" && str[i - 1] !== "\r") {
          lineWhiteSpaceEndsAt = i;
          endingOfTheLine = true;
        }
      }
      if (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n")) {
        const sliceFrom = i + 1;
        let sliceTo;
        if (Number.isInteger(lastLineBreaksLastCharIndex)) {
          sliceTo = lastLineBreaksLastCharIndex + 1;
          if (
            opts.removeEmptyLines &&
            lastLineBreaksLastCharIndex !== undefined &&
            str.slice(sliceFrom, sliceTo).trim() === ""
          ) {
            if (
              consecutiveLineBreakCount >
              opts.limitConsecutiveEmptyLinesTo + 1
            ) {
              finalIndexesToDelete.push([
                i + 1,
                lastLineBreaksLastCharIndex + 1,
              ]);
            }
          }
        }
        lastLineBreaksLastCharIndex = i;
      }
    } else {
      if (whiteSpaceEndsAt !== null) {
        if (
          i + 1 !== whiteSpaceEndsAt + 1 &&
          whiteSpaceEndsAt === str.length - 1 &&
          opts.trimEnd
        ) {
          finalIndexesToDelete.push([i + 1, whiteSpaceEndsAt + 1]);
        }
        whiteSpaceEndsAt = null;
      }
      if (lineWhiteSpaceEndsAt !== null) {
        if (endingOfTheLine && opts.trimLines) {
          endingOfTheLine = false;
          if (lineWhiteSpaceEndsAt !== i + 1) {
            finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
          }
        }
        lineWhiteSpaceEndsAt = null;
      }
    }
    if (i === 0) {
      if (whiteSpaceEndsAt !== null && opts.trimStart) {
        finalIndexesToDelete.push([0, whiteSpaceEndsAt + 1]);
      } else if (spacesEndAt !== null) {
        finalIndexesToDelete.push([i + 1, spacesEndAt + 1]);
      }
    }
    if (opts.recogniseHTML) {
      if (str[i].trim() === "") {
        if (stateWithinTag && !tagCanEndHere) {
          tagCanEndHere = true;
        }
        if (tagMatched && !whiteSpaceWithinTagEndsAt) {
          whiteSpaceWithinTagEndsAt = i + 1;
        }
        if (
          tagMatched &&
          str[i - 1] !== undefined &&
          str[i - 1].trim() !== "" &&
          str[i - 1] !== "<" &&
          str[i - 1] !== "/"
        ) {
          tagMatched = false;
          stateWithinTag = false;
          preliminaryIndexesToDelete = [];
        }
        if (
          !bail &&
          !bracketJustFound &&
          str[i].trim() === "" &&
          str[i - 1] !== "<" &&
          (str[i + 1] === undefined ||
            (str[i + 1].trim() !== "" && str[i + 1].trim() !== "/"))
        ) {
          if (
            str[i - 1] === undefined ||
            (str[i - 1].trim() !== "" &&
              str[i - 1] !== "<" &&
              str[i - 1] !== "/")
          ) {
            count.spacesBetweenLetterChunks += 1;
          } else {
            for (let y = i - 1; y--; ) {
              if (str[y].trim() !== "") {
                if (str[y] === "<") {
                  bail = true;
                } else if (str[y] !== "/") {
                  count.spacesBetweenLetterChunks += i - y;
                }
                break;
              }
            }
          }
        }
      } else {
        if (str[i] === "=") {
          count.equalOnly += 1;
          if (str[i + 1] === '"') {
            count.equalDoubleQuoteCombo += 1;
          }
        } else if (str[i] === '"') {
          count.doubleQuoteOnly += 1;
        }
        if (bracketJustFound) {
          bracketJustFound = false;
        }
        if (whiteSpaceWithinTagEndsAt !== null) {
          preliminaryIndexesToDelete.push([i + 1, whiteSpaceWithinTagEndsAt]);
          whiteSpaceWithinTagEndsAt = null;
        }
        if (str[i] === ">") {
          resetCounts(count);
          bracketJustFound = true;
          if (stateWithinTag) {
            preliminaryIndexesToDelete = [];
          } else {
            stateWithinTag = true;
            if (
              str[i - 1] !== undefined &&
              str[i - 1].trim() === "" &&
              !whiteSpaceWithinTagEndsAt
            ) {
              whiteSpaceWithinTagEndsAt = i;
            }
          }
          if (!tagCanEndHere) {
            tagCanEndHere = true;
          }
        } else if (str[i] === "<") {
          stateWithinTag = false;
          if (bail) {
            bail = false;
          }
          if (
            count.spacesBetweenLetterChunks > 0 &&
            count.equalDoubleQuoteCombo === 0
          ) {
            tagMatched = false;
            preliminaryIndexesToDelete = [];
          }
          if (tagMatched) {
            if (preliminaryIndexesToDelete.length) {
              preliminaryIndexesToDelete.forEach(([rangeStart, rangeEnd]) =>
                finalIndexesToDelete.push([rangeStart, rangeEnd])
              );
            }
            tagMatched = false;
          }
          resetCounts(count);
        } else if (stateWithinTag && str[i] === "/") {
          whiteSpaceWithinTagEndsAt = i;
        } else if (stateWithinTag && !tagMatched) {
          if (tagCanEndHere && charCodeBetweenInclusive(str[i], 97, 122)) {
            tagCanEndHere = false;
            if (charCodeBetweenInclusive(str[i], 97, 110)) {
              if (
                (str[i] === "a" &&
                  ((str[i - 1] === "e" &&
                    matchLeftIncl(str, i, ["area", "textarea"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                    (str[i - 1] === "t" &&
                      matchLeftIncl(str, i, ["data", "meta"], {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      })) ||
                    isSpaceOrLeftBracket(str[i - 1]))) ||
                (str[i] === "b" &&
                  (matchLeftIncl(str, i, ["rb", "sub"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }) ||
                    isSpaceOrLeftBracket(str[i - 1]))) ||
                (str[i] === "c" &&
                  matchLeftIncl(str, i, "rtc", {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "d" &&
                  ((str[i - 1] === "a" &&
                    matchLeftIncl(str, i, ["head", "thead"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                    matchLeftIncl(
                      str,
                      i,
                      ["kbd", "dd", "embed", "legend", "td"],
                      { cb: isSpaceOrLeftBracket, i: true }
                    ))) ||
                (str[i] === "e" &&
                  (matchLeftIncl(str, i, "source", {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }) ||
                    (str[i - 1] === "d" &&
                      matchLeftIncl(str, i, ["aside", "code"], {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      })) ||
                    (str[i - 1] === "l" &&
                      matchLeftIncl(
                        str,
                        i,
                        ["table", "article", "title", "style"],
                        { cb: isSpaceOrLeftBracket, i: true }
                      )) ||
                    (str[i - 1] === "m" &&
                      matchLeftIncl(str, i, ["iframe", "time"], {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      })) ||
                    (str[i - 1] === "r" &&
                      matchLeftIncl(str, i, ["pre", "figure", "picture"], {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      })) ||
                    (str[i - 1] === "t" &&
                      matchLeftIncl(
                        str,
                        i,
                        ["template", "cite", "blockquote"],
                        { cb: isSpaceOrLeftBracket, i: true }
                      )) ||
                    matchLeftIncl(str, i, "base", {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    }) ||
                    isSpaceOrLeftBracket(str[i - 1]))) ||
                (str[i] === "g" &&
                  matchLeftIncl(str, i, ["img", "strong", "dialog", "svg"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "h" &&
                  matchLeftIncl(str, i, ["th", "math"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "i" &&
                  (matchLeftIncl(str, i, ["bdi", "li"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }) ||
                    isSpaceOrLeftBracket(str[i - 1]))) ||
                (str[i] === "k" &&
                  matchLeftIncl(str, i, ["track", "link", "mark"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "l" &&
                  matchLeftIncl(
                    str,
                    i,
                    ["html", "ol", "ul", "dl", "label", "del", "small", "col"],
                    { cb: isSpaceOrLeftBracket, i: true }
                  )) ||
                (str[i] === "m" &&
                  matchLeftIncl(str, i, ["param", "em", "menuitem", "form"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "n" &&
                  ((str[i - 1] === "o" &&
                    matchLeftIncl(
                      str,
                      i,
                      ["section", "caption", "figcaption", "option", "button"],
                      { cb: isSpaceOrLeftBracket, i: true }
                    )) ||
                    matchLeftIncl(str, i, ["span", "keygen", "dfn", "main"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })))
              ) {
                tagMatched = true;
              }
            }
            else if (
              (str[i] === "o" &&
                matchLeftIncl(str, i, ["bdo", "video", "audio"], {
                  cb: isSpaceOrLeftBracket,
                  i: true,
                })) ||
              (str[i] === "p" &&
                (isSpaceOrLeftBracket(str[i - 1]) ||
                  (str[i - 1] === "u" &&
                    matchLeftIncl(
                      str,
                      i,
                      ["hgroup", "colgroup", "optgroup", "sup"],
                      { cb: isSpaceOrLeftBracket, i: true }
                    )) ||
                  matchLeftIncl(str, i, ["map", "samp", "rp"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }))) ||
              (str[i] === "q" && isSpaceOrLeftBracket(str[i - 1])) ||
              (str[i] === "r" &&
                ((str[i - 1] === "e" &&
                  matchLeftIncl(str, i, ["header", "meter", "footer"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                  matchLeftIncl(
                    str,
                    i,
                    ["var", "br", "abbr", "wbr", "hr", "tr"],
                    { cb: isSpaceOrLeftBracket, i: true }
                  ))) ||
              (str[i] === "s" &&
                ((str[i - 1] === "s" &&
                  matchLeftIncl(str, i, ["address", "progress"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                  matchLeftIncl(str, i, ["canvas", "details", "ins"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }) ||
                  isSpaceOrLeftBracket(str[i - 1]))) ||
              (str[i] === "t" &&
                ((str[i - 1] === "c" &&
                  matchLeftIncl(str, i, ["object", "select"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                  (str[i - 1] === "o" &&
                    matchLeftIncl(str, i, ["slot", "tfoot"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                  (str[i - 1] === "p" &&
                    matchLeftIncl(str, i, ["script", "noscript"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                  (str[i - 1] === "u" &&
                    matchLeftIncl(str, i, ["input", "output"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                  matchLeftIncl(str, i, ["fieldset", "rt", "datalist", "dt"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }))) ||
              (str[i] === "u" &&
                (isSpaceOrLeftBracket(str[i - 1]) ||
                  matchLeftIncl(str, i, "menu", {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }))) ||
              (str[i] === "v" &&
                matchLeftIncl(str, i, ["nav", "div"], {
                  cb: isSpaceOrLeftBracket,
                  i: true,
                })) ||
              (str[i] === "y" &&
                matchLeftIncl(str, i, ["ruby", "body", "tbody", "summary"], {
                  cb: isSpaceOrLeftBracket,
                  i: true,
                }))
            ) {
              tagMatched = true;
            }
          } else if (
            tagCanEndHere &&
            charCodeBetweenInclusive(str[i], 49, 54)
          ) {
            tagCanEndHere = false;
            if (
              str[i - 1] === "h" &&
              (str[i - 2] === "<" || str[i - 2].trim() === "")
            ) {
              tagMatched = true;
            }
          } else if (str[i] === "=" || str[i] === '"') {
            tagCanEndHere = false;
          }
        }
      }
    }
  }
  if (opts.returnRangesOnly) {
    return rangesMerge(finalIndexesToDelete);
  }
  return finalIndexesToDelete.length
    ? replaceSlicesArr(str, finalIndexesToDelete)
    : str;
}

export default collapse;
