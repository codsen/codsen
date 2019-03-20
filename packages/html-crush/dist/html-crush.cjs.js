/**
 * html-crush
 * Minifies HTML/CSS: valid or broken, pure or mixed with other languages
 * Version: 1.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/html-crush
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var applySlices = _interopDefault(require('ranges-apply'));
var Slices = _interopDefault(require('ranges-push'));
var stringMatchLeftRight = require('string-match-left-right');
var expand = _interopDefault(require('string-range-expander'));

function _typeof(obj) {
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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
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

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var version = "1.0.8";

var isArr = Array.isArray;
var finalIndexesToDelete = new Slices({
  limitToBeAddedWhitespace: true
});
var defaults = {
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  reportProgressFunc: null,
  breakToTheLeftOf: ["</td", "<html", "</html", "<head", "</head", "<meta", "<table", "<script", "</script", "<!DOCTYPE", "<style", "</style", "<title", "<body", "@media", "</body", "<!--[if", "<!--<![endif"]
};
function isStr(something) {
  return typeof something === "string";
}
function existy(x) {
  return x != null;
}
function isLetter(something) {
  return typeof something === "string" && something.toUpperCase() !== something.toLowerCase();
}
function crush(str, originalOpts) {
  var start = Date.now();
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("html-minify-noparse: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("html-minify-noparse: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("html-minify-noparse: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  if (originalOpts && isArr(originalOpts.breakToTheLeftOf) && originalOpts.breakToTheLeftOf.length) {
    for (var z = 0, _len = originalOpts.breakToTheLeftOf.length; z < _len; z++) {
      if (!isStr(originalOpts.breakToTheLeftOf[z])) {
        throw new TypeError("html-minify-noparse: [THROW_ID_05] the opts.breakToTheLeftOf array contains non-string elements! For example, element at index ".concat(z, " is of a type \"").concat(_typeof(originalOpts.breakToTheLeftOf[z]), "\" and is equal to:\n").concat(JSON.stringify(originalOpts.breakToTheLeftOf[z], null, 4)));
      }
    }
  }
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: "html-minify-noparse: [THROW_ID_04*]",
    schema: {
      reportProgressFunc: ["false", "null", "function"],
      breakToTheLeftOf: ["false", "null", "array"]
    }
  });
  if (opts.breakToTheLeftOf === false || opts.breakToTheLeftOf === null) {
    opts.breakToTheLeftOf = [];
  }
  var breakToTheLeftOfFirstLetters = "";
  if (isArr(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
    for (var i = 0, _len2 = opts.breakToTheLeftOf.length; i < _len2; i++) {
      if (opts.breakToTheLeftOf[i].length && !breakToTheLeftOfFirstLetters.includes(opts.breakToTheLeftOf[i][0])) {
        breakToTheLeftOfFirstLetters += opts.breakToTheLeftOf[i][0];
      }
    }
  }
  var lastLinebreak = null;
  var whitespaceStartedAt = null;
  var nonWhitespaceCharMet = false;
  var countCharactersPerLine = 0;
  var withinStyleTag = false;
  var styleCommentStartedAt = null;
  var scriptStartedAt = null;
  var preStartedAt = null;
  var codeStartedAt = null;
  var doNothing = false;
  var stageFrom = null;
  var stageTo = null;
  var stageAdd = null;
  var CHARS_BREAK_ON_THE_RIGHT_OF_THEM = [">", "}", ";"];
  var CHARS_BREAK_ON_THE_LEFT_OF_THEM = ["<"];
  var DELETE_TIGHTLY_IF_ON_LEFT_IS = [">"];
  var DELETE_TIGHTLY_IF_ON_RIGHT_IS = ["<"];
  var set = ["{", "}", ",", ":", ";", "<", ">", "~", "+"];
  var DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS = set;
  var DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS = set;
  var beginningOfAFile = true;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var currentPercentageDone;
  var lastPercentage = 0;
  if (len) {
    for (var _i = 0; _i < len; _i++) {
      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (_i === midLen) {
            opts.reportProgressFunc(50);
          }
        } else if (len >= 2000) {
          currentPercentageDone = Math.floor(_i / len * 80);
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      }
      if (!doNothing && preStartedAt !== null && codeStartedAt !== null && _i >= preStartedAt && _i >= codeStartedAt) {
        doNothing = true;
      }
      if (!doNothing && !withinStyleTag && codeStartedAt !== null && str[_i] === "<" && str[_i + 1] === "/" && str[_i + 2] === "c" && str[_i + 3] === "o" && str[_i + 4] === "d" && str[_i + 5] === "e" && !isLetter(str[_i + 6])) {
        if (preStartedAt !== null && doNothing) {
          doNothing = false;
        }
        codeStartedAt = null;
      }
      if (!doNothing && !withinStyleTag && codeStartedAt === null && str[_i] === "<" && str[_i + 1] === "c" && str[_i + 2] === "o" && str[_i + 3] === "d" && str[_i + 4] === "e" && !isLetter(str[_i + 5])) {
        if (str[_i + 5] === ">") {
          codeStartedAt = _i + 6;
        } else {
          for (var y = _i + 5; y < len; y++) {
            if (str[y] === ">") {
              codeStartedAt = y + 1;
              _i = y;
              break;
            }
          }
        }
      }
      if (!doNothing && !withinStyleTag && preStartedAt !== null && str[_i] === "<" && str[_i + 1] === "/" && str[_i + 2] === "p" && str[_i + 3] === "r" && str[_i + 4] === "e" && !isLetter(str[_i + 5])) {
        preStartedAt = null;
      }
      if (!doNothing && !withinStyleTag && preStartedAt === null && str[_i] === "<" && str[_i + 1] === "p" && str[_i + 2] === "r" && str[_i + 3] === "e" && !isLetter(str[_i + 4])) {
        if (str[_i + 4] === ">") {
          preStartedAt = _i + 5;
        } else {
          for (var _y = _i + 4; _y < len; _y++) {
            if (str[_y] === ">") {
              preStartedAt = _y + 1;
              _i = _y;
              break;
            }
          }
        }
      }
      if (str[_i] === ">" && str[_i - 1] === "]" && str[_i - 2] === "]") {
        if (doNothing) {
          doNothing = false;
          continue;
        }
      }
      if (!doNothing && str[_i] === "<" && str[_i + 1] === "!" && str[_i + 2] === "[" && str[_i + 3] === "C" && str[_i + 4] === "D" && str[_i + 5] === "A" && str[_i + 6] === "T" && str[_i + 7] === "A" && str[_i + 8] === "[") {
        doNothing = true;
        whitespaceStartedAt = null;
      }
      if (scriptStartedAt !== null && str[_i] === "<" && str[_i + 1] === "/" && str[_i + 2] === "s" && str[_i + 3] === "c" && str[_i + 4] === "r" && str[_i + 5] === "i" && str[_i + 6] === "p" && str[_i + 7] === "t" && !isLetter(str[_i + 8])) {
        if ((opts.removeIndentations || opts.removeLineBreaks) && _i > 0 && str[_i - 1] && !str[_i - 1].trim().length) {
          for (var _y2 = _i; _y2--;) {
            if (str[_y2] === "\n" || str[_y2] === "\r" || str[_y2].trim().length) {
              if (_y2 + 1 < _i) {
                finalIndexesToDelete.push(_y2 + 1, _i);
              }
              break;
            }
          }
        }
        scriptStartedAt = null;
        doNothing = false;
        _i += 8;
        continue;
      }
      if (!doNothing && !withinStyleTag && str[_i] === "<" && str[_i + 1] === "s" && str[_i + 2] === "c" && str[_i + 3] === "r" && str[_i + 4] === "i" && str[_i + 5] === "p" && str[_i + 6] === "t" && !isLetter(str[_i + 7])) {
        scriptStartedAt = _i;
        doNothing = true;
        var whatToInsert = "";
        if ((opts.removeLineBreaks || opts.removeIndentations) && whitespaceStartedAt !== null) {
          if (whitespaceStartedAt > 0) {
            whatToInsert = "\n";
          }
          finalIndexesToDelete.push(whitespaceStartedAt, _i, whatToInsert);
        }
        whitespaceStartedAt = null;
        lastLinebreak = null;
      }
      if (!doNothing && withinStyleTag && styleCommentStartedAt !== null && str[_i] === "*" && str[_i + 1] === "/") {
        var _expand = expand({
          str: str,
          from: styleCommentStartedAt,
          to: _i + 2,
          ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS || "",
          ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS || ""
        });
        var _expand2 = _slicedToArray(_expand, 2);
        stageFrom = _expand2[0];
        stageTo = _expand2[1];
        styleCommentStartedAt = null;
        if (stageFrom != null && str[stageTo] === undefined) {
          finalIndexesToDelete.push(stageFrom, stageTo);
        } else {
          countCharactersPerLine++;
          _i++;
          continue;
        }
      }
      if (!doNothing && withinStyleTag && styleCommentStartedAt === null && str[_i] === "/" && str[_i + 1] === "*") {
        styleCommentStartedAt = _i;
      }
      if (!doNothing && withinStyleTag && styleCommentStartedAt === null && str[_i] === "<" && str[_i + 1] === "/" && str[_i + 2] === "s" && str[_i + 3] === "t" && str[_i + 4] === "y" && str[_i + 5] === "l" && str[_i + 6] === "e" && !isLetter(str[_i + 7])) {
        withinStyleTag = false;
      } else if (!doNothing && !withinStyleTag && styleCommentStartedAt === null && str[_i] === "<" && str[_i + 1] === "s" && str[_i + 2] === "t" && str[_i + 3] === "y" && str[_i + 4] === "l" && str[_i + 5] === "e" && !isLetter(str[_i + 6])) {
        withinStyleTag = true;
      }
      if (!doNothing && !str[_i].trim().length) {
        if (whitespaceStartedAt === null) {
          whitespaceStartedAt = _i;
        }
      } else if (!doNothing && !(withinStyleTag && styleCommentStartedAt !== null)) {
        if (whitespaceStartedAt !== null) {
          if (opts.removeLineBreaks) {
            countCharactersPerLine++;
          }
          if (beginningOfAFile) {
            beginningOfAFile = false;
            finalIndexesToDelete.push(0, _i);
          } else {
            if (opts.removeIndentations && !opts.removeLineBreaks) {
              if (!nonWhitespaceCharMet && lastLinebreak !== null && _i > lastLinebreak) {
                finalIndexesToDelete.push(lastLinebreak + 1, _i);
              } else if (whitespaceStartedAt + 1 < _i) {
                if (str[whitespaceStartedAt] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt + 1, _i);
                } else if (str[_i - 1] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt, _i - 1);
                } else {
                  finalIndexesToDelete.push(whitespaceStartedAt, _i, " ");
                }
              }
            }
            if (opts.removeLineBreaks) {
              if (breakToTheLeftOfFirstLetters.length && breakToTheLeftOfFirstLetters.includes(str[_i]) && stringMatchLeftRight.matchRightIncl(str, _i, opts.breakToTheLeftOf)) {
                if (!(str[_i - 1] === "\n" && whitespaceStartedAt === _i - 1)) {
                  finalIndexesToDelete.push(whitespaceStartedAt, _i, "\n");
                }
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                whitespaceStartedAt = null;
                countCharactersPerLine = 1;
                continue;
              }
              var whatToAdd = " ";
              if (str[whitespaceStartedAt - 1] && DELETE_TIGHTLY_IF_ON_LEFT_IS.includes(str[whitespaceStartedAt - 1]) && DELETE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[_i]) || withinStyleTag && styleCommentStartedAt === null && (DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS.includes(str[whitespaceStartedAt - 1]) || DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[_i])) || str[_i] === "!" && str[_i + 1] === "i" && str[_i + 2] === "m" && str[_i + 3] === "p" && str[_i + 4] === "o" && str[_i + 5] === "r" && str[_i + 6] === "t" && str[_i + 7] === "a" && str[_i + 8] === "n" && str[_i + 9] === "t") {
                whatToAdd = "";
              }
              if (whatToAdd && whatToAdd.length) {
                countCharactersPerLine++;
              }
              if (!opts.lineLengthLimit) {
                if (!(_i === whitespaceStartedAt + 1 && str[whitespaceStartedAt] === " " && whatToAdd === " ")) {
                  finalIndexesToDelete.push(whitespaceStartedAt, _i, whatToAdd);
                }
              } else {
                if (countCharactersPerLine >= opts.lineLengthLimit || !str[_i + 1]) {
                  if (countCharactersPerLine > opts.lineLengthLimit || countCharactersPerLine === opts.lineLengthLimit && str[_i + 1] && str[_i + 1].trim().length && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[_i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[_i + 1])) {
                    whatToAdd = "\n";
                    countCharactersPerLine = 1;
                  }
                  finalIndexesToDelete.push(whitespaceStartedAt, _i, whatToAdd);
                  stageFrom = null;
                  stageTo = null;
                  stageAdd = null;
                } else {
                  stageFrom = whitespaceStartedAt;
                  stageTo = _i;
                  stageAdd = whatToAdd;
                }
              }
            }
          }
          whitespaceStartedAt = null;
          if (!nonWhitespaceCharMet) {
            nonWhitespaceCharMet = true;
          }
          continue;
        } else {
          if (beginningOfAFile) {
            beginningOfAFile = false;
          }
          if (opts.removeLineBreaks) {
            countCharactersPerLine++;
          }
        }
        if (!nonWhitespaceCharMet) {
          nonWhitespaceCharMet = true;
        }
      }
      if (!doNothing && !beginningOfAFile && _i !== 0 && opts.removeLineBreaks && (opts.lineLengthLimit || breakToTheLeftOfFirstLetters.length)) {
        if (breakToTheLeftOfFirstLetters.length && stringMatchLeftRight.matchRightIncl(str, _i, opts.breakToTheLeftOf)) {
          finalIndexesToDelete.push(_i, _i, "\n");
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
          countCharactersPerLine = 1;
          continue;
        } else if (opts.lineLengthLimit && countCharactersPerLine <= opts.lineLengthLimit) {
          if (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[_i]) || str[_i - 1] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[_i - 1]) || !str[_i].trim().length || !str[_i + 1]) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              var _whatToAdd = stageAdd;
              if (str[_i].trim().length && str[_i + 1] && str[_i + 1].trim().length && countCharactersPerLine + (stageAdd ? stageAdd.length : 0) > opts.lineLengthLimit) {
                _whatToAdd = "\n";
              }
              finalIndexesToDelete.push(stageFrom, stageTo, _whatToAdd);
            }
            if (str[_i].trim().length && (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[_i]) || str[_i - 1] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[_i - 1]))) {
              stageFrom = _i;
              stageTo = _i;
              stageAdd = null;
            } else {
              stageFrom = null;
              stageTo = null;
              stageAdd = null;
            }
          }
        } else if (opts.lineLengthLimit) {
          if (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[_i])) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              var whatToAddLength = stageAdd && stageAdd.length ? stageAdd.length : 0;
              if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 > opts.lineLengthLimit) ; else {
                finalIndexesToDelete.push(stageFrom, stageTo, stageAdd);
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 === opts.lineLengthLimit) {
                  finalIndexesToDelete.push(_i, _i, "\n");
                  countCharactersPerLine = 0;
                }
              }
            } else {
              finalIndexesToDelete.push(_i, _i, "\n");
              countCharactersPerLine = 0;
            }
          } else if (str[_i - 1] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[_i - 1])) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) ; else {
              finalIndexesToDelete.push(_i, _i, "\n");
              countCharactersPerLine = 0;
            }
          } else if (!str[_i].trim().length) ; else if (!str[_i + 1]) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              finalIndexesToDelete.push(stageFrom, stageTo, "\n");
            }
          }
        }
      }
      if (!doNothing && !beginningOfAFile && opts.removeLineBreaks && opts.lineLengthLimit && countCharactersPerLine >= opts.lineLengthLimit && stageFrom !== null && stageTo !== null && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[_i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[_i])) {
        if (!(countCharactersPerLine === opts.lineLengthLimit && str[_i + 1] && !str[_i + 1].trim().length)) {
          var _whatToAdd2 = "\n";
          if (str[_i + 1] && !str[_i + 1].trim().length && countCharactersPerLine === opts.lineLengthLimit) {
            _whatToAdd2 = stageAdd;
          }
          finalIndexesToDelete.push(stageFrom, stageTo, _whatToAdd2);
          countCharactersPerLine = _i - stageTo;
          if (str[_i].length) {
            countCharactersPerLine++;
          }
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
        }
      }
      if (!doNothing && str[_i] === "\n" || str[_i] === "\r" && (!str[_i + 1] || str[_i + 1] && str[_i + 1] !== "\n")) {
        lastLinebreak = _i;
        if (nonWhitespaceCharMet) {
          nonWhitespaceCharMet = false;
        }
        if (!opts.removeLineBreaks && whitespaceStartedAt !== null && whitespaceStartedAt < _i && str[_i + 1] && str[_i + 1] !== "\r" && str[_i + 1] !== "\n") {
          finalIndexesToDelete.push(whitespaceStartedAt, _i);
        }
      }
      if (!str[_i + 1]) {
        if (withinStyleTag && styleCommentStartedAt !== null) {
          finalIndexesToDelete.push.apply(finalIndexesToDelete, _toConsumableArray(expand({
            str: str,
            from: styleCommentStartedAt,
            to: _i,
            ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS || "",
            ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS || ""
          })));
        } else if (whitespaceStartedAt && str[_i] !== "\n" && str[_i] !== "\r") {
          finalIndexesToDelete.push(whitespaceStartedAt, _i + 1);
        } else if (whitespaceStartedAt && (str[_i] === "\r" && str[_i + 1] === "\n" || str[_i] === "\n")) {
          finalIndexesToDelete.push(whitespaceStartedAt, _i);
        }
      }
    }
    if (finalIndexesToDelete.current()) {
      var res = applySlices(str, finalIndexesToDelete.current(), function (percDone) {
        if (opts.reportProgressFunc && len >= 2000) {
          currentPercentageDone = 80 + Math.floor(percDone / 5);
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      });
      var rangesCopy = Array.from(finalIndexesToDelete.current());
      finalIndexesToDelete.wipe();
      var resLen = res.length;
      return {
        log: {
          timeTakenInMiliseconds: Date.now() - start,
          originalLength: len,
          cleanedLength: resLen,
          bytesSaved: Math.max(len - resLen, 0),
          percentageReducedOfOriginal: len ? Math.round(Math.max(len - resLen, 0) * 100 / len) : 0
        },
        ranges: rangesCopy,
        result: res
      };
    }
  }
  return {
    log: {
      timeTakenInMiliseconds: Date.now() - start,
      originalLength: len,
      cleanedLength: len,
      bytesSaved: 0,
      percentageReducedOfOriginal: 0
    },
    ranges: [],
    result: str
  };
}

exports.crush = crush;
exports.defaults = defaults;
exports.version = version;
