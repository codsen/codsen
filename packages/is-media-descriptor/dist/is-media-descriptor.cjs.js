/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 1.2.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-media-descriptor
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var leven = _interopDefault(require('leven'));
var processCommaSep = _interopDefault(require('string-process-comma-separated'));

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

var recognisedMediaTypes = ["all", "aural", "braille", "embossed", "handheld", "print", "projection", "screen", "speech", "tty", "tv"];
var recognisedMediaFeatures = ["width", "min-width", "max-width", "height", "min-height", "max-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "orientation", "resolution", "min-resolution", "max-resolution", "scan", "grid", "update", "overflow-block", "overflow-inline", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "color-gamut", "pointer", "hover", "any-pointer", "any-hover"];
var lettersOnlyRegex = /^\w+$/g;
function loop(str, opts, res) {
  var chunkStartsAt = null;
  var gatheredChunksArr = [];
  var whitespaceStartsAt = null;
  var nextCanBeMediaType = true;
  var nextCanBeMediaCondition = true;
  var nextCanBeNotOrOnly = true;
  var nextCanBeAnd = false;
  var bracketOpeningIndexes = [];
  for (var i = opts.idxFrom; i <= opts.idxTo; i++) {
    if (str[i] === ")") {
      var lastOpening = bracketOpeningIndexes.pop();
      var extractedValueWithinBrackets = str.slice(lastOpening + 1, i);
      if (!extractedValueWithinBrackets.includes("(") && !extractedValueWithinBrackets.includes(")")) {
        if (extractedValueWithinBrackets.match(lettersOnlyRegex)) {
          if (!recognisedMediaFeatures.includes(extractedValueWithinBrackets.toLowerCase().trim())) {
            res.push({
              idxFrom: lastOpening + 1 + opts.offset,
              idxTo: i + opts.offset,
              message: "Unrecognised \"".concat(extractedValueWithinBrackets.trim(), "\"."),
              fix: null
            });
          }
        }
      }
      var regexFromAllKnownMediaTypes = new RegExp(recognisedMediaTypes.join("|"), "gi");
      var findings = extractedValueWithinBrackets.match(regexFromAllKnownMediaTypes) || [];
      findings.forEach(function (mediaTypeFound) {
        var startingIdx = str.indexOf(mediaTypeFound);
        res.push({
          idxFrom: startingIdx + opts.offset,
          idxTo: startingIdx + mediaTypeFound.length + opts.offset,
          message: "Media type \"".concat(mediaTypeFound, "\" inside brackets."),
          fix: null
        });
      });
    }
    if (str[i] === "(") {
      bracketOpeningIndexes.push(i);
    }
    if (str[i] && str[i].trim().length && whitespaceStartsAt !== null) {
      if (str[whitespaceStartsAt - 1] === "(" || str[i] === ")") {
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [[whitespaceStartsAt + opts.offset, i + opts.offset]]
          }
        });
      } else if (whitespaceStartsAt < i - 1 || str[i - 1] !== " ") {
        var rangesFrom = whitespaceStartsAt + opts.offset;
        var rangesTo = i + opts.offset;
        var rangesInsert = " ";
        if (whitespaceStartsAt !== i - 1) {
          if (str[whitespaceStartsAt] === " ") {
            rangesFrom++;
            rangesInsert = null;
          } else if (str[i - 1] === " ") {
            rangesTo--;
            rangesInsert = null;
          }
        }
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [rangesInsert ? [rangesFrom, rangesTo, " "] : [rangesFrom, rangesTo]]
          }
        });
      }
      whitespaceStartsAt = null;
    }
    if (str[i] && !str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
    }
    if (chunkStartsAt !== null && (!str[i] || !str[i].trim().length) && !bracketOpeningIndexes.length) {
      var chunk = str.slice(chunkStartsAt, i);
      gatheredChunksArr.push(chunk.toLowerCase());
      if (nextCanBeAnd && (!(nextCanBeMediaType || nextCanBeMediaCondition) || chunk === "and")) {
        if (chunk.toLowerCase() !== "and") {
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: "Expected \"and\", found \"".concat(chunk, "\"."),
            fix: null
          });
        } else if (!str[i]) {
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: "Dangling \"".concat(chunk, "\"."),
            fix: {
              ranges: [[str.slice(0, chunkStartsAt).trimEnd().length + opts.offset, i + opts.offset]]
            }
          });
        }
        nextCanBeAnd = false;
        nextCanBeMediaCondition = true;
      } else if (nextCanBeNotOrOnly && ["not", "only"].includes(chunk)) {
        nextCanBeNotOrOnly = false;
        nextCanBeMediaCondition = false;
      } else if (nextCanBeMediaType || nextCanBeMediaCondition) {
        if (chunk.startsWith("(")) {
          if (nextCanBeMediaCondition) ; else {
            var message = "Media condition \"".concat(str.slice(chunkStartsAt, i), "\" can't be here.");
            if (gatheredChunksArr[gatheredChunksArr.length - 2] === "not") {
              message = "\"not\" can be only in front of media type.";
            }
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo: i + opts.offset,
              message: message,
              fix: null
            });
          }
        } else {
          if (nextCanBeMediaType) {
            if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
              nextCanBeMediaType = false;
              nextCanBeMediaCondition = false;
            } else {
              var _message = "Unrecognised \"".concat(chunk, "\".");
              if (!chunk.match(/\w/g)) {
                _message = "Strange symbol".concat(chunk.trim().length === 1 ? "" : "s", " \"").concat(chunk, "\".");
              } else if (["and", "only", "or", "not"].includes(chunk.toLowerCase())) {
                _message = "\"".concat(chunk, "\" instead of a media type.");
              }
              res.push({
                idxFrom: chunkStartsAt + opts.offset,
                idxTo: i + opts.offset,
                message: _message,
                fix: null
              });
            }
          } else {
            var _message2 = "Expected brackets on \"".concat(chunk, "\".");
            var fix = null;
            var idxTo = i + opts.offset;
            if (["not", "else", "or"].includes(chunk.toLowerCase())) {
              _message2 = "\"".concat(chunk, "\" can't be here.");
            } else if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
              _message2 = "Unexpected media type, try using a comma.";
            } else if (recognisedMediaFeatures.includes(chunk.toLowerCase())) {
              _message2 = "Missing brackets.";
              fix = {
                ranges: [[chunkStartsAt + opts.offset, chunkStartsAt + opts.offset, "("], [i + opts.offset, i + opts.offset, ")"]]
              };
            } else if (str.slice(i).trim().startsWith(":")) {
              var valueWithoutColon = chunk.slice(0, i).trim();
              _message2 = "Expected brackets on \"".concat(valueWithoutColon, "\" and its value.");
              idxTo = chunkStartsAt + valueWithoutColon.length + opts.offset;
            }
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo: idxTo,
              message: _message2,
              fix: fix
            });
            break;
          }
        }
        nextCanBeAnd = true;
      } else {
        res.push({
          idxFrom: chunkStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: "Unrecognised media type \"".concat(str.slice(chunkStartsAt, i), "\"."),
          fix: null
        });
      }
      chunkStartsAt = null;
      if (nextCanBeNotOrOnly) {
        nextCanBeNotOrOnly = false;
      }
    }
    if (chunkStartsAt === null && str[i] && str[i].trim().length && str[i] !== ")") {
      if (str[i] === "(") ;
      chunkStartsAt = i;
    }
  }
}

function isMediaD(originalStr, originalOpts) {
  var defaults = {
    offset: 0
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error("is-media-descriptor: [THROW_ID_01] opts.offset must be an integer, it was given as ".concat(opts.offset, " (type ").concat(_typeof(opts.offset), ")"));
  }
  if (!opts.offset) {
    opts.offset = 0;
  }
  if (typeof originalStr !== "string") {
    return [];
  } else if (!originalStr.trim().length) {
    return [];
  }
  var res = [];
  var nonWhitespaceStart = 0;
  var nonWhitespaceEnd = originalStr.length;
  var str = originalStr.trim();
  if (originalStr !== originalStr.trim()) {
    var ranges = [];
    if (!originalStr[0].trim().length) {
      for (var i = 0, len = originalStr.length; i < len; i++) {
        if (originalStr[i].trim().length) {
          ranges.push([0 + opts.offset, i + opts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!originalStr[originalStr.length - 1].trim().length) {
      for (var _i = originalStr.length; _i--;) {
        if (originalStr[_i].trim().length) {
          ranges.push([_i + 1 + opts.offset, originalStr.length + opts.offset]);
          nonWhitespaceEnd = _i + 1;
          break;
        }
      }
    }
    res.push({
      idxFrom: ranges[0][0],
      idxTo: ranges[ranges.length - 1][1],
      message: "Remove whitespace.",
      fix: {
        ranges: ranges
      }
    });
  }
  if (recognisedMediaTypes.includes(str)) {
    return res;
  } else if (["only", "not"].includes(str)) {
    res.push({
      idxFrom: nonWhitespaceStart + opts.offset,
      idxTo: nonWhitespaceEnd + opts.offset,
      message: "Missing media type or condition.",
      fix: null
    });
  } else if (str.match(lettersOnlyRegex) && !str.includes("(") && !str.includes(")")) {
    for (var _i2 = 0, _len = recognisedMediaTypes.length; _i2 < _len; _i2++) {
      if (leven(recognisedMediaTypes[_i2], str) === 1) {
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: "Did you mean \"".concat(recognisedMediaTypes[_i2], "\"?"),
          fix: {
            ranges: [[nonWhitespaceStart + opts.offset, nonWhitespaceEnd + opts.offset, recognisedMediaTypes[_i2]]]
          }
        });
        break;
      }
      if (_i2 === _len - 1) {
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: "Unrecognised media type \"".concat(str, "\"."),
          fix: null
        });
      }
    }
  } else {
    var wrongOrder = false;
    var _Array$from$reduce = Array.from(str).reduce(function (acc, curr, idx) {
      if (curr === ")") {
        if (!wrongOrder && acc[1] + 1 > acc[0]) {
          wrongOrder = true;
        }
        return [acc[0], acc[1] + 1];
      } else if (curr === "(") {
        return [acc[0] + 1, acc[1]];
      } else if (curr === ";") {
        res.push({
          idxFrom: idx + opts.offset,
          idxTo: idx + 1 + opts.offset,
          message: "Semicolon found!",
          fix: null
        });
      }
      return acc;
    }, [0, 0]),
        _Array$from$reduce2 = _slicedToArray(_Array$from$reduce, 2),
        openingBracketCount = _Array$from$reduce2[0],
        closingBracketCount = _Array$from$reduce2[1];
    if (wrongOrder && openingBracketCount === closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null
      });
    }
    if (openingBracketCount > closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "More opening brackets than closing.",
        fix: null
      });
    } else if (closingBracketCount > openingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "More closing brackets than opening.",
        fix: null
      });
    }
    if (!res.length && str.match(/\(\s*\)/g)) {
      var lastOpening = null;
      var nonWhitespaceFound;
      for (var _i3 = 0, _len2 = str.length; _i3 < _len2; _i3++) {
        if (str[_i3] === "(") {
          lastOpening = _i3;
          nonWhitespaceFound = false;
        } else if (str[_i3] === ")") {
          if (!nonWhitespaceFound) {
            res.push({
              idxFrom: lastOpening + opts.offset,
              idxTo: _i3 + 1 + opts.offset,
              message: "Empty bracket pair.",
              fix: null
            });
          } else {
            nonWhitespaceFound = true;
          }
        } else if (str[_i3].trim().length) {
          nonWhitespaceFound = true;
        }
      }
    }
    if (res.length) {
      return res;
    }
    processCommaSep(str, {
      offset: opts.offset,
      leadingWhitespaceOK: false,
      trailingWhitespaceOK: false,
      oneSpaceAfterCommaOK: true,
      innerWhitespaceAllowed: true,
      separator: ",",
      cb: function cb(idxFrom, idxTo) {
        loop(str, Object.assign({}, opts, {
          idxFrom: idxFrom - opts.offset,
          idxTo: idxTo - opts.offset
        }), res);
      },
      errCb: function errCb(ranges, message) {}
    });
  }
  return res;
}

module.exports = isMediaD;
