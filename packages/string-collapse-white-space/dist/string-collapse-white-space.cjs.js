/**
 * string-collapse-white-space
 * Efficient collapsing of white space with optional outer- and/or line-trimming and HTML tag recognition
 * Version: 5.2.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-white-space
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var replaceSlicesArr = _interopDefault(require('ranges-apply'));
var rangesMerge = _interopDefault(require('ranges-merge'));
var stringMatchLeftRight = require('string-match-left-right');

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function collapse(str, originalOpts) {
  function isStr(something) {
    return typeof something === "string";
  }
  function charCodeBetweenInclusive(character, from, end) {
    return character.charCodeAt(0) >= from && character.charCodeAt(0) <= end;
  }
  function isSpaceOrLeftBracket(character) {
    return isStr(character) && (character === "<" || character.trim() === "");
  }
  if (typeof str !== "string") {
    throw new Error("string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (originalOpts !== undefined && originalOpts !== null && !isObj(originalOpts)) {
    throw new Error("string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  if (str.length === 0) {
    return "";
  }
  var isNum = Number.isInteger;
  var finalIndexesToDelete = [];
  var defaults = {
    trimStart: true,
    trimEnd: true,
    trimLines: false,
    trimnbsp: false,
    recogniseHTML: true,
    removeEmptyLines: false,
    returnRangesOnly: false,
    limitConsecutiveEmptyLinesTo: 0
  };
  var opts = Object.assign({}, defaults, originalOpts);
  var preliminaryIndexesToDelete;
  if (opts.recogniseHTML) {
    preliminaryIndexesToDelete = [];
  }
  var spacesEndAt = null;
  var whiteSpaceEndsAt = null;
  var lineWhiteSpaceEndsAt = null;
  var endingOfTheLine = false;
  var stateWithinTag = false;
  var whiteSpaceWithinTagEndsAt = null;
  var tagMatched = false;
  var tagCanEndHere = false;
  var count;
  var bail = false;
  var resetCounts = function resetCounts() {
    return {
      equalDoubleQuoteCombo: 0,
      equalOnly: 0,
      doubleQuoteOnly: 0,
      spacesBetweenLetterChunks: 0,
      linebreaks: 0
    };
  };
  var bracketJustFound = false;
  if (opts.recogniseHTML) {
    count = resetCounts();
  }
  var lastLineBreaksLastCharIndex;
  var consecutiveLineBreakCount = 0;
  for (var i = str.length; i--;) {
    if (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n") {
      consecutiveLineBreakCount++;
    } else if (str[i].trim().length) {
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
    if (str[i].trim() === "" && (!opts.trimnbsp && str[i] !== "\xa0" || opts.trimnbsp)) {
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
      if (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n") {
        var sliceFrom = i + 1;
        var sliceTo = void 0;
        if (isNum(lastLineBreaksLastCharIndex)) {
          sliceTo = lastLineBreaksLastCharIndex + 1;
          if (opts.removeEmptyLines && lastLineBreaksLastCharIndex !== undefined && str.slice(sliceFrom, sliceTo).trim() === "") {
            if (consecutiveLineBreakCount > opts.limitConsecutiveEmptyLinesTo + 1) {
              finalIndexesToDelete.push([i + 1, lastLineBreaksLastCharIndex + 1]);
            }
          }
        }
        lastLineBreaksLastCharIndex = i;
      }
    } else {
      if (whiteSpaceEndsAt !== null) {
        if (i + 1 !== whiteSpaceEndsAt + 1 && whiteSpaceEndsAt === str.length - 1 && opts.trimEnd) {
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
        if (tagMatched && str[i - 1] !== undefined && str[i - 1].trim() !== "" && str[i - 1] !== "<" && str[i - 1] !== "/") {
          tagMatched = false;
          stateWithinTag = false;
          preliminaryIndexesToDelete = [];
        }
        if (!bail && !bracketJustFound && str[i].trim() === "" && str[i - 1] !== "<" && (str[i + 1] === undefined || str[i + 1].trim() !== "" && str[i + 1].trim() !== "/")) {
          if (str[i - 1] === undefined || str[i - 1].trim() !== "" && str[i - 1] !== "<" && str[i - 1] !== "/") {
            count.spacesBetweenLetterChunks += 1;
          } else {
            for (var y = i - 1; y--;) {
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
          count = resetCounts();
          bracketJustFound = true;
          if (stateWithinTag) {
            preliminaryIndexesToDelete = [];
          } else {
            stateWithinTag = true;
            if (str[i - 1] !== undefined && str[i - 1].trim() === "" && !whiteSpaceWithinTagEndsAt) {
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
          if (count.spacesBetweenLetterChunks > 0 && count.equalDoubleQuoteCombo === 0) {
            tagMatched = false;
            preliminaryIndexesToDelete = [];
          }
          if (tagMatched) {
            if (preliminaryIndexesToDelete.length) {
              preliminaryIndexesToDelete.forEach(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    rangeStart = _ref2[0],
                    rangeEnd = _ref2[1];
                return finalIndexesToDelete.push([rangeStart, rangeEnd]);
              });
            }
            tagMatched = false;
          }
          count = resetCounts();
        } else if (stateWithinTag && str[i] === "/") {
          whiteSpaceWithinTagEndsAt = i;
        } else if (stateWithinTag && !tagMatched) {
          if (tagCanEndHere && charCodeBetweenInclusive(str[i], 97, 122)) {
            tagCanEndHere = false;
            if (charCodeBetweenInclusive(str[i], 97, 110)) {
              if (str[i] === "a" && (str[i - 1] === "e" && stringMatchLeftRight.matchLeftIncl(str, i, ["area", "textarea"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "t" && stringMatchLeftRight.matchLeftIncl(str, i, ["data", "meta"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "b" && (stringMatchLeftRight.matchLeftIncl(str, i, ["rb", "sub"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "c" && stringMatchLeftRight.matchLeftIncl(str, i, "rtc", {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i] === "d" && (str[i - 1] === "a" && stringMatchLeftRight.matchLeftIncl(str, i, ["head", "thead"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || stringMatchLeftRight.matchLeftIncl(str, i, ["kbd", "dd", "embed", "legend", "td"], {
                cb: isSpaceOrLeftBracket,
                i: true
              })) || str[i] === "e" && (stringMatchLeftRight.matchLeftIncl(str, i, "source", {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "d" && stringMatchLeftRight.matchLeftIncl(str, i, ["aside", "code"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "l" && stringMatchLeftRight.matchLeftIncl(str, i, ["table", "article", "title", "style"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "m" && stringMatchLeftRight.matchLeftIncl(str, i, ["iframe", "time"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "r" && stringMatchLeftRight.matchLeftIncl(str, i, ["pre", "figure", "picture"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "t" && stringMatchLeftRight.matchLeftIncl(str, i, ["template", "cite", "blockquote"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || stringMatchLeftRight.matchLeftIncl(str, i, "base", {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "g" && stringMatchLeftRight.matchLeftIncl(str, i, ["img", "strong", "dialog", "svg"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i] === "h" && stringMatchLeftRight.matchLeftIncl(str, i, ["th", "math"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i] === "i" && (stringMatchLeftRight.matchLeftIncl(str, i, ["bdi", "li"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "k" && stringMatchLeftRight.matchLeftIncl(str, i, ["track", "link", "mark"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i] === "l" && stringMatchLeftRight.matchLeftIncl(str, i, ["html", "ol", "ul", "dl", "label", "del", "small", "col"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i] === "m" && stringMatchLeftRight.matchLeftIncl(str, i, ["param", "em", "menuitem", "form"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i] === "n" && (str[i - 1] === "o" && stringMatchLeftRight.matchLeftIncl(str, i, ["section", "caption", "figcaption", "option", "button"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || stringMatchLeftRight.matchLeftIncl(str, i, ["span", "keygen", "dfn", "main"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }))) {
                tagMatched = true;
              }
            } else {
              if (str[i] === "o" && stringMatchLeftRight.matchLeftIncl(str, i, ["bdo", "video", "audio"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i] === "p" && (isSpaceOrLeftBracket(str[i - 1]) || str[i - 1] === "u" && stringMatchLeftRight.matchLeftIncl(str, i, ["hgroup", "colgroup", "optgroup", "sup"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || stringMatchLeftRight.matchLeftIncl(str, i, ["map", "samp", "rp"], {
                cb: isSpaceOrLeftBracket,
                i: true
              })) || str[i] === "q" && isSpaceOrLeftBracket(str[i - 1]) || str[i] === "r" && (str[i - 1] === "e" && stringMatchLeftRight.matchLeftIncl(str, i, ["header", "meter", "footer"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || stringMatchLeftRight.matchLeftIncl(str, i, ["var", "br", "abbr", "wbr", "hr", "tr"], {
                cb: isSpaceOrLeftBracket,
                i: true
              })) || str[i] === "s" && (str[i - 1] === "s" && stringMatchLeftRight.matchLeftIncl(str, i, ["address", "progress"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || stringMatchLeftRight.matchLeftIncl(str, i, ["canvas", "details", "ins"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "t" && (str[i - 1] === "c" && stringMatchLeftRight.matchLeftIncl(str, i, ["object", "select"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "o" && stringMatchLeftRight.matchLeftIncl(str, i, ["slot", "tfoot"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "p" && stringMatchLeftRight.matchLeftIncl(str, i, ["script", "noscript"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i - 1] === "u" && stringMatchLeftRight.matchLeftIncl(str, i, ["input", "output"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || stringMatchLeftRight.matchLeftIncl(str, i, ["fieldset", "rt", "datalist", "dt"], {
                cb: isSpaceOrLeftBracket,
                i: true
              })) || str[i] === "u" && (isSpaceOrLeftBracket(str[i - 1]) || stringMatchLeftRight.matchLeftIncl(str, i, "menu", {
                cb: isSpaceOrLeftBracket,
                i: true
              })) || str[i] === "v" && stringMatchLeftRight.matchLeftIncl(str, i, ["nav", "div"], {
                cb: isSpaceOrLeftBracket,
                i: true
              }) || str[i] === "y" && stringMatchLeftRight.matchLeftIncl(str, i, ["ruby", "body", "tbody", "summary"], {
                cb: isSpaceOrLeftBracket,
                i: true
              })) {
                tagMatched = true;
              }
            }
          } else if (tagCanEndHere && charCodeBetweenInclusive(str[i], 49, 54)) {
            tagCanEndHere = false;
            if (str[i - 1] === "h" && (str[i - 2] === "<" || str[i - 2].trim() === "")) {
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
  return finalIndexesToDelete.length ? replaceSlicesArr(str, finalIndexesToDelete) : str;
}

module.exports = collapse;
