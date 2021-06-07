/**
 * @name html-crush
 * @fileoverview Minifies HTML/CSS: valid or broken, pure or mixed with other languages
 * @version 4.2.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/html-crush/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var rangesApply = require('ranges-apply');
var rangesPush = require('ranges-push');
var stringMatchLeftRight = require('string-match-left-right');
var stringRangeExpander = require('string-range-expander');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "4.2.0";

var version = version$1;
var finalIndexesToDelete = new rangesPush.Ranges({
  limitToBeAddedWhitespace: true
});
var defaults = {
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  removeHTMLComments: false,
  removeCSSComments: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  breakToTheLeftOf: ["</td", "<html", "</html", "<head", "</head", "<meta", "<link", "<table", "<script", "</script", "<!DOCTYPE", "<style", "</style", "<title", "<body", "@media", "</body", "<!--[if", "<!--<![endif", "<![endif]"],
  mindTheInlineTags: ["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]
};
var applicableOpts = {
  removeHTMLComments: false,
  removeCSSComments: false
};
function isStr(something) {
  return typeof something === "string";
}
function isLetter(something) {
  return typeof something === "string" && something.toUpperCase() !== something.toLowerCase();
}
function crush(str, originalOpts) {
  var start = Date.now();
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("html-crush: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("html-crush: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof__default['default'](str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (originalOpts && _typeof__default['default'](originalOpts) !== "object") {
    throw new Error("html-crush: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ".concat(_typeof__default['default'](originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  if (originalOpts && Array.isArray(originalOpts.breakToTheLeftOf) && originalOpts.breakToTheLeftOf.length) {
    for (var z = 0, _len = originalOpts.breakToTheLeftOf.length; z < _len; z++) {
      if (!isStr(originalOpts.breakToTheLeftOf[z])) {
        throw new TypeError("html-crush: [THROW_ID_05] the opts.breakToTheLeftOf array contains non-string elements! For example, element at index ".concat(z, " is of a type \"").concat(_typeof__default['default'](originalOpts.breakToTheLeftOf[z]), "\" and is equal to:\n").concat(JSON.stringify(originalOpts.breakToTheLeftOf[z], null, 4)));
      }
    }
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (typeof opts.removeHTMLComments === "boolean") {
    opts.removeHTMLComments = opts.removeHTMLComments ? 1 : 0;
  }
  var breakToTheLeftOfFirstLetters = "";
  if (Array.isArray(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
    breakToTheLeftOfFirstLetters = _toConsumableArray__default['default'](new Set(opts.breakToTheLeftOf.map(function (val) {
      return val[0];
    }))).join("");
  }
  var lastLinebreak = null;
  var whitespaceStartedAt = null;
  var nonWhitespaceCharMet = false;
  var countCharactersPerLine = 0;
  var cpl = 0;
  var withinStyleTag = false;
  var withinHTMLConditional = false;
  var withinInlineStyle = null;
  var styleCommentStartedAt = null;
  var htmlCommentStartedAt = null;
  var scriptStartedAt = null;
  var doNothing;
  var stageFrom = null;
  var stageTo = null;
  var stageAdd = null;
  var tagName = null;
  var tagNameStartsAt = null;
  var leftTagName = null;
  var CHARS_BREAK_ON_THE_RIGHT_OF_THEM = ">};";
  var CHARS_BREAK_ON_THE_LEFT_OF_THEM = "<";
  var CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM = "!";
  var DELETE_TIGHTLY_IF_ON_LEFT_IS = ">";
  var DELETE_TIGHTLY_IF_ON_RIGHT_IS = "<";
  var set = "{},:;<>~+";
  var DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS = set;
  var DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS = set;
  var beginningOfAFile = true;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var leavePercForLastStage = 0.01;
  var ceil;
  if (opts.reportProgressFunc) {
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
  }
  var currentPercentageDone;
  var lastPercentage = 0;
  var lineEnding = "\n";
  if (str.includes("\r\n")) {
    lineEnding = "\r\n";
  } else if (str.includes("\r")) {
    lineEnding = "\r";
  }
  if (len) {
    for (var i = 0; i < len; i++) {
      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (i === midLen) {
            opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
          }
        } else if (len >= 2000) {
          currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (ceil || 1));
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      }
      cpl++;
      if (!doNothing && withinStyleTag && str[i] === "}" && str[i - 1] === "}") {
        if (countCharactersPerLine + 1 >= opts.lineLengthLimit) {
          finalIndexesToDelete.push(i, i, lineEnding);
          countCharactersPerLine = 0;
        } else {
          stageFrom = i;
          stageTo = i;
          stageAdd = " ";
        }
      }
      if (doNothing && typeof doNothing === "number" && i >= doNothing) {
        doNothing = undefined;
      }
      if (scriptStartedAt !== null && str.startsWith("</script", i) && !isLetter(str[i + 8])) {
        if ((opts.removeIndentations || opts.removeLineBreaks) && i > 0 && str[~-i] && !str[~-i].trim()) {
          for (var y = i; y--;) {
            if (str[y] === "\n" || str[y] === "\r" || str[y].trim()) {
              if (y + 1 < i) {
                finalIndexesToDelete.push(y + 1, i);
              }
              break;
            }
          }
        }
        scriptStartedAt = null;
        doNothing = false;
        i += 8;
        continue;
      }
      if (!doNothing && !withinStyleTag && str.startsWith("<script", i) && !isLetter(str[i + 7])) {
        scriptStartedAt = i;
        doNothing = true;
        var whatToInsert = "";
        if ((opts.removeLineBreaks || opts.removeIndentations) && whitespaceStartedAt !== null) {
          if (whitespaceStartedAt > 0) {
            whatToInsert = lineEnding;
          }
          finalIndexesToDelete.push(whitespaceStartedAt, i, whatToInsert);
        }
        whitespaceStartedAt = null;
        lastLinebreak = null;
      }
      if (tagNameStartsAt !== null && tagName === null && !/\w/.test(str[i])
      ) {
          tagName = str.slice(tagNameStartsAt, i);
          var idxOnTheRight = stringLeftRight.right(str, ~-i);
          if (typeof idxOnTheRight === "number" && str[idxOnTheRight] === ">" && !str[i].trim() && stringLeftRight.right(str, i)) {
            finalIndexesToDelete.push(i, stringLeftRight.right(str, i));
          } else if (idxOnTheRight && str[idxOnTheRight] === "/" && str[stringLeftRight.right(str, idxOnTheRight)] === ">") {
            if (!str[i].trim() && stringLeftRight.right(str, i)) {
              finalIndexesToDelete.push(i, stringLeftRight.right(str, i));
            }
            if (str[idxOnTheRight + 1] !== ">" && stringLeftRight.right(str, idxOnTheRight + 1)) {
              finalIndexesToDelete.push(idxOnTheRight + 1, stringLeftRight.right(str, idxOnTheRight + 1));
            }
          }
        }
      if (!doNothing && !withinStyleTag && !withinInlineStyle && str[~-i] === "<" && tagNameStartsAt === null) {
        if (/\w/.test(str[i])) {
          tagNameStartsAt = i;
        } else if (str[stringLeftRight.right(str, ~-i)] === "/" && /\w/.test(str[stringLeftRight.right(str, stringLeftRight.right(str, ~-i))] || "")) {
          tagNameStartsAt = stringLeftRight.right(str, stringLeftRight.right(str, ~-i));
        }
      }
      if (!doNothing && (withinStyleTag || withinInlineStyle) && styleCommentStartedAt !== null && str[i] === "*" && str[i + 1] === "/") {
        var _expander = stringRangeExpander.expander({
          str: str,
          from: styleCommentStartedAt,
          to: i + 2,
          ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS ,
          ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS 
        });
        var _expander2 = _slicedToArray__default['default'](_expander, 2);
        stageFrom = _expander2[0];
        stageTo = _expander2[1];
        styleCommentStartedAt = null;
        if (stageFrom != null) {
          finalIndexesToDelete.push(stageFrom, stageTo);
        } else {
          countCharactersPerLine += 1;
          i += 1;
        }
        doNothing = i + 2;
      }
      if (!doNothing && (withinStyleTag || withinInlineStyle) && styleCommentStartedAt === null && str[i] === "/" && str[i + 1] === "*") {
        if (!applicableOpts.removeCSSComments) {
          applicableOpts.removeCSSComments = true;
        }
        if (opts.removeCSSComments) {
          styleCommentStartedAt = i;
        }
      }
      if (withinHTMLConditional && str.startsWith("![endif", i + 1)) {
        withinHTMLConditional = false;
      }
      if (!doNothing && !withinStyleTag && !withinInlineStyle && htmlCommentStartedAt !== null) {
        var distanceFromHereToCommentEnding = void 0;
        if (str.startsWith("-->", i)) {
          distanceFromHereToCommentEnding = 3;
        } else if (str[i] === ">" && str[i - 1] === "]") {
          distanceFromHereToCommentEnding = 1;
        }
        if (distanceFromHereToCommentEnding) {
          var _expander3 = stringRangeExpander.expander({
            str: str,
            from: htmlCommentStartedAt,
            to: i + distanceFromHereToCommentEnding
          });
          var _expander4 = _slicedToArray__default['default'](_expander3, 2);
          stageFrom = _expander4[0];
          stageTo = _expander4[1];
          htmlCommentStartedAt = null;
          if (stageFrom != null) {
            if (opts.lineLengthLimit && cpl - (stageTo - stageFrom) >= opts.lineLengthLimit) {
              finalIndexesToDelete.push(stageFrom, stageTo, lineEnding);
              cpl = -distanceFromHereToCommentEnding;
            } else {
              finalIndexesToDelete.push(stageFrom, stageTo);
              cpl -= stageTo - stageFrom;
            }
          } else {
            countCharactersPerLine += distanceFromHereToCommentEnding - 1;
            i += distanceFromHereToCommentEnding - 1;
          }
          doNothing = i + distanceFromHereToCommentEnding;
        }
      }
      if (!doNothing && !withinStyleTag && !withinInlineStyle && str.startsWith("<!--", i) && htmlCommentStartedAt === null) {
        if (str.startsWith("[if", i + 4)) {
          if (!withinHTMLConditional) {
            withinHTMLConditional = true;
          }
          if (opts.removeHTMLComments === 2) {
            htmlCommentStartedAt = i;
          }
        } else if (
        opts.removeHTMLComments && (
        !withinHTMLConditional || opts.removeHTMLComments === 2)) {
          htmlCommentStartedAt = i;
        }
        if (!applicableOpts.removeHTMLComments) {
          applicableOpts.removeHTMLComments = true;
        }
      }
      if (!doNothing && withinStyleTag && styleCommentStartedAt === null && str.startsWith("</style", i) && !isLetter(str[i + 7])) {
        withinStyleTag = false;
      } else if (!doNothing && !withinStyleTag && styleCommentStartedAt === null && str.startsWith("<style", i) && !isLetter(str[i + 6])) {
        withinStyleTag = true;
        if ((opts.removeLineBreaks || opts.removeIndentations) && opts.breakToTheLeftOf.includes("<style") && str.startsWith(" type=\"text/css\">", i + 6) && str[i + 24]) {
          finalIndexesToDelete.push(i + 23, i + 23, lineEnding);
        }
      }
      if (!doNothing && !withinInlineStyle && "\"'".includes(str[i]) && str.endsWith("style=", i)) {
        withinInlineStyle = i;
      }
      if (!doNothing && !str[i].trim()) {
        if (whitespaceStartedAt === null) {
          whitespaceStartedAt = i;
        }
      } else if (!doNothing && !((withinStyleTag || withinInlineStyle) && styleCommentStartedAt !== null)) {
        if (whitespaceStartedAt !== null) {
          if (opts.removeLineBreaks) {
            countCharactersPerLine += 1;
          }
          if (beginningOfAFile) {
            beginningOfAFile = false;
            if (opts.removeIndentations || opts.removeLineBreaks) {
              finalIndexesToDelete.push(0, i);
            }
          } else {
            if (opts.removeIndentations && !opts.removeLineBreaks) {
              if (!nonWhitespaceCharMet && lastLinebreak !== null && i > lastLinebreak) {
                finalIndexesToDelete.push(lastLinebreak + 1, i);
              } else if (whitespaceStartedAt + 1 < i) {
                if (
                str.endsWith("]>", whitespaceStartedAt) ||
                str.endsWith("-->", whitespaceStartedAt) ||
                str.startsWith("<![", i) ||
                str.startsWith("<!--<![", i)) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i);
                } else if (str[whitespaceStartedAt] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                } else if (str[~-i] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt, ~-i);
                } else {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, " ");
                }
              }
            }
            if (opts.removeLineBreaks || withinInlineStyle) {
              if (breakToTheLeftOfFirstLetters.includes(str[i]) && stringMatchLeftRight.matchRightIncl(str, i, opts.breakToTheLeftOf)) {
                if (
                !("\r\n".includes(str[~-i]) && whitespaceStartedAt === ~-i) &&
                !(str[~-i] === "\n" && str[i - 2] === "\r" && whitespaceStartedAt === i - 2)) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, lineEnding);
                }
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                whitespaceStartedAt = null;
                countCharactersPerLine = 1;
                continue;
              }
              var whatToAdd = " ";
              if (
              str[i] === "<" && stringMatchLeftRight.matchRight(str, i, opts.mindTheInlineTags, {
                cb: function cb(nextChar) {
                  return !nextChar || !/\w/.test(nextChar);
                }
              })
              ) ; else if (str[~-whitespaceStartedAt] && DELETE_TIGHTLY_IF_ON_LEFT_IS.includes(str[~-whitespaceStartedAt]) && DELETE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i]) || (withinStyleTag || withinInlineStyle) && styleCommentStartedAt === null && (DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS.includes(str[~-whitespaceStartedAt]) || DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i])) || str.startsWith("!important", i) && !withinHTMLConditional || withinInlineStyle && (str[~-whitespaceStartedAt] === "'" || str[~-whitespaceStartedAt] === '"') || str[~-whitespaceStartedAt] === "}" && str.startsWith("</style", i) || str[i] === ">" && ("'\"".includes(str[stringLeftRight.left(str, i)]) || str[stringLeftRight.right(str, i)] === "<") || str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
                whatToAdd = "";
                if (str[i] === "/" && str[i + 1] === ">" && stringLeftRight.right(str, i) && stringLeftRight.right(str, i) > i + 1) {
                  finalIndexesToDelete.push(i + 1, stringLeftRight.right(str, i));
                  countCharactersPerLine -= stringLeftRight.right(str, i) - i + 1;
                }
              }
              if (withinStyleTag && str[i] === "}" && whitespaceStartedAt && str[whitespaceStartedAt - 1] === "}") {
                whatToAdd = " ";
              }
              if (whatToAdd && whatToAdd.length) {
                countCharactersPerLine += 1;
              }
              if (!opts.lineLengthLimit) {
                if (!(i === whitespaceStartedAt + 1 &&
                whatToAdd === " ")) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                }
              } else {
                if (countCharactersPerLine >= opts.lineLengthLimit || !str[i + 1] || str[i] === ">" || str[i] === "/" && str[i + 1] === ">") {
                  if (countCharactersPerLine > opts.lineLengthLimit || countCharactersPerLine === opts.lineLengthLimit && str[i + 1] && str[i + 1].trim() && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i + 1])) {
                    whatToAdd = lineEnding;
                    countCharactersPerLine = 1;
                  }
                  if (countCharactersPerLine > opts.lineLengthLimit || !(whatToAdd === " " && i === whitespaceStartedAt + 1)) {
                    finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                    lastLinebreak = null;
                  }
                  stageFrom = null;
                  stageTo = null;
                  stageAdd = null;
                } else if (stageFrom === null || whitespaceStartedAt < stageFrom) {
                  stageFrom = whitespaceStartedAt;
                  stageTo = i;
                  stageAdd = whatToAdd;
                }
              }
            }
          }
          whitespaceStartedAt = null;
          if (!nonWhitespaceCharMet) {
            nonWhitespaceCharMet = true;
          }
        } else {
          if (beginningOfAFile) {
            beginningOfAFile = false;
          }
          if (opts.removeLineBreaks) {
            countCharactersPerLine += 1;
          }
        }
        if (!nonWhitespaceCharMet) {
          nonWhitespaceCharMet = true;
        }
      }
      if (!doNothing && !beginningOfAFile && i !== 0 && opts.removeLineBreaks && (opts.lineLengthLimit || breakToTheLeftOfFirstLetters) && !str.startsWith("</a", i)) {
        if (breakToTheLeftOfFirstLetters && stringMatchLeftRight.matchRightIncl(str, i, opts.breakToTheLeftOf) && str.slice(0, i).trim() && (!str.startsWith("<![endif]", i) || !stringMatchLeftRight.matchLeft(str, i, "<!--"))) {
          finalIndexesToDelete.push(i, i, lineEnding);
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
          countCharactersPerLine = 1;
          continue;
        } else if (opts.lineLengthLimit && countCharactersPerLine <= opts.lineLengthLimit) {
          if (!str[i + 1] || CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) || CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) || !str[i].trim()) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              var _whatToAdd = stageAdd;
              if (str[i].trim() && str[i + 1] && str[i + 1].trim() && countCharactersPerLine + (stageAdd ? stageAdd.length : 0) > opts.lineLengthLimit) {
                _whatToAdd = lineEnding;
              }
              if (countCharactersPerLine + (_whatToAdd ? _whatToAdd.length : 0) > opts.lineLengthLimit || !(_whatToAdd === " " && stageTo === stageFrom + 1 && str[stageFrom] === " ")) {
                if (!(str[~-stageFrom] === "}" && str[stageTo] === "{")) {
                  finalIndexesToDelete.push(stageFrom, stageTo, _whatToAdd);
                  lastLinebreak = null;
                }
              }
            }
            if (str[i].trim() && (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) || str[~-i] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[~-i])) && isStr(leftTagName) && (!tagName || !opts.mindTheInlineTags.includes(tagName)) && !(str[i] === "<" && stringMatchLeftRight.matchRight(str, i, opts.mindTheInlineTags, {
              cb: function cb(nextChar) {
                return !nextChar || !/\w/.test(nextChar);
              }
            })) && !(str[i] === "<" && stringMatchLeftRight.matchRight(str, i, opts.mindTheInlineTags, {
              trimCharsBeforeMatching: "/",
              cb: function cb(nextChar) {
                return !nextChar || !/\w/.test(nextChar);
              }
            }))) {
              stageFrom = i;
              stageTo = i;
              stageAdd = null;
            } else if (styleCommentStartedAt === null && stageFrom !== null && (withinInlineStyle || !opts.mindTheInlineTags || !Array.isArray(opts.mindTheInlineTags) || Array.isArray(opts.mindTheInlineTags.length) && !opts.mindTheInlineTags.length || !isStr(tagName) || Array.isArray(opts.mindTheInlineTags) && opts.mindTheInlineTags.length && isStr(tagName) && !opts.mindTheInlineTags.includes(tagName)) && !(str[i] === "<" && stringMatchLeftRight.matchRight(str, i, opts.mindTheInlineTags, {
              trimCharsBeforeMatching: "/",
              cb: function cb(nextChar) {
                return !nextChar || !/\w/.test(nextChar);
              }
            }))) {
              stageFrom = null;
              stageTo = null;
              stageAdd = null;
            }
          }
        } else if (opts.lineLengthLimit) {
          if (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !(str[i] === "<" && stringMatchLeftRight.matchRight(str, i, opts.mindTheInlineTags, {
            trimCharsBeforeMatching: "/",
            cb: function cb(nextChar) {
              return !nextChar || !/\w/.test(nextChar);
            }
          }))) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              var whatToAddLength = stageAdd && stageAdd.length ? stageAdd.length : 0;
              if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 > opts.lineLengthLimit) ; else {
                finalIndexesToDelete.push(stageFrom, stageTo, stageAdd);
                if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 === opts.lineLengthLimit) {
                  finalIndexesToDelete.push(i, i, lineEnding);
                  countCharactersPerLine = 0;
                }
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
              }
            } else {
              finalIndexesToDelete.push(i, i, lineEnding);
              countCharactersPerLine = 0;
            }
          } else if (str[i + 1] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && isStr(tagName) && Array.isArray(opts.mindTheInlineTags) && opts.mindTheInlineTags.length && !opts.mindTheInlineTags.includes(tagName)) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) ; else {
              finalIndexesToDelete.push(i + 1, i + 1, lineEnding);
              countCharactersPerLine = 0;
            }
          } else if (!str[i].trim()) ; else if (!str[i + 1]) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              finalIndexesToDelete.push(stageFrom, stageTo, lineEnding);
            }
          }
        }
      }
      if (!doNothing && !beginningOfAFile && opts.removeLineBreaks && opts.lineLengthLimit && countCharactersPerLine >= opts.lineLengthLimit && stageFrom !== null && stageTo !== null && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !"/".includes(str[i])) {
        if (!(countCharactersPerLine === opts.lineLengthLimit && str[i + 1] && !str[i + 1].trim())) {
          var _whatToAdd2 = lineEnding;
          if (str[i + 1] && !str[i + 1].trim() && countCharactersPerLine === opts.lineLengthLimit) {
            _whatToAdd2 = stageAdd;
          }
          if (_whatToAdd2 === lineEnding && !str[~-stageFrom].trim() && stringLeftRight.left(str, stageFrom)) {
            stageFrom = stringLeftRight.left(str, stageFrom) + 1;
          }
          finalIndexesToDelete.push(stageFrom, stageTo, _whatToAdd2);
          countCharactersPerLine = i - stageTo;
          if (str[i].length) {
            countCharactersPerLine += 1;
          }
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
        }
      }
      if (!doNothing && str[i] === "\n" || str[i] === "\r" && (!str[i + 1] || str[i + 1] && str[i + 1] !== "\n")) {
        lastLinebreak = i;
        if (nonWhitespaceCharMet) {
          nonWhitespaceCharMet = false;
        }
        if (!opts.removeLineBreaks && whitespaceStartedAt !== null && whitespaceStartedAt < i && str[i + 1] && str[i + 1] !== "\r" && str[i + 1] !== "\n") {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      }
      if (!str[i + 1]) {
        if (withinStyleTag && styleCommentStartedAt !== null) {
          finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray__default['default'](stringRangeExpander.expander({
            str: str,
            from: styleCommentStartedAt,
            to: i,
            ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS ,
            ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS 
          })));
        } else if (whitespaceStartedAt && str[i] !== "\n" && str[i] !== "\r") {
          finalIndexesToDelete.push(whitespaceStartedAt, i + 1);
        } else if (whitespaceStartedAt && (str[i] === "\r" && str[i + 1] === "\n" || str[i] === "\n" && str[i - 1] !== "\r")) {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      }
      if (!doNothing && withinInlineStyle && withinInlineStyle < i && str[withinInlineStyle] === str[i]) {
        withinInlineStyle = null;
      }
      if (!doNothing && !withinStyleTag && str.startsWith("<pre", i) && !isLetter(str[i + 4])) {
        var locationOfClosingPre = str.indexOf("</pre", i + 5);
        if (locationOfClosingPre > 0) {
          doNothing = locationOfClosingPre;
        }
      }
      if (!doNothing && !withinStyleTag && str.startsWith("<code", i) && !isLetter(str[i + 5])) {
        var locationOfClosingCode = str.indexOf("</code", i + 5);
        if (locationOfClosingCode > 0) {
          doNothing = locationOfClosingCode;
        }
      }
      if (!doNothing && str.startsWith("<![CDATA[", i)) {
        var locationOfClosingCData = str.indexOf("]]>", i + 9);
        if (locationOfClosingCData > 0) {
          doNothing = locationOfClosingCData;
        }
      }
      if (!doNothing && !withinStyleTag && !withinInlineStyle && tagNameStartsAt !== null && str[i] === ">") {
        if (str[stringLeftRight.right(str, i)] === "<") {
          leftTagName = tagName;
        }
        tagNameStartsAt = null;
        tagName = null;
      }
      if (str[i] === "<" && leftTagName !== null) {
        leftTagName = null;
      }
      if (withinStyleTag && str[i] === "{" && str[i + 1] === "{" && str.indexOf("}}") !== -1) {
        doNothing = str.indexOf("}}") + 2;
      }
    }
    if (finalIndexesToDelete.current()) {
      var ranges = finalIndexesToDelete.current();
      finalIndexesToDelete.wipe();
      var startingPercentageDone = opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage;
      var res = rangesApply.rApply(str, ranges, function (applyPercDone) {
        if (opts.reportProgressFunc && len >= 2000) {
          currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) * (applyPercDone / 100));
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      });
      var resLen = res.length;
      return {
        log: {
          timeTakenInMilliseconds: Date.now() - start,
          originalLength: len,
          cleanedLength: resLen,
          bytesSaved: Math.max(len - resLen, 0),
          percentageReducedOfOriginal: len ? Math.round(Math.max(len - resLen, 0) * 100 / len) : 0
        },
        ranges: ranges,
        applicableOpts: applicableOpts,
        result: res
      };
    }
  }
  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
      originalLength: len,
      cleanedLength: len,
      bytesSaved: 0,
      percentageReducedOfOriginal: 0
    },
    applicableOpts: applicableOpts,
    ranges: null,
    result: str
  };
}

exports.crush = crush;
exports.defaults = defaults;
exports.version = version;
