/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 1.2.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-media-descriptor
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.isMediaDescriptor = factory());
}(this, (function () { 'use strict';

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  const array = [];
  const charCodeCache = [];

  const leven = (left, right) => {
    if (left === right) {
      return 0;
    }

    const swap = left; // Swapping the strings if `a` is longer than `b` so we know which one is the
    // shortest & which one is the longest

    if (left.length > right.length) {
      left = right;
      right = swap;
    }

    let leftLength = left.length;
    let rightLength = right.length; // Performing suffix trimming:
    // We can linearly drop suffix common to both strings since they
    // don't increase distance at all
    // Note: `~-` is the bitwise way to perform a `- 1` operation

    while (leftLength > 0 && left.charCodeAt(~-leftLength) === right.charCodeAt(~-rightLength)) {
      leftLength--;
      rightLength--;
    } // Performing prefix trimming
    // We can linearly drop prefix common to both strings since they
    // don't increase distance at all


    let start = 0;

    while (start < leftLength && left.charCodeAt(start) === right.charCodeAt(start)) {
      start++;
    }

    leftLength -= start;
    rightLength -= start;

    if (leftLength === 0) {
      return rightLength;
    }

    let bCharCode;
    let result;
    let temp;
    let temp2;
    let i = 0;
    let j = 0;

    while (i < leftLength) {
      charCodeCache[i] = left.charCodeAt(start + i);
      array[i] = ++i;
    }

    while (j < rightLength) {
      bCharCode = right.charCodeAt(start + j);
      temp = j++;
      result = j;

      for (i = 0; i < leftLength; i++) {
        temp2 = bCharCode === charCodeCache[i] ? temp : temp + 1;
        temp = array[i]; // eslint-disable-next-line no-multi-assign

        result = array[i] = temp > result ? temp2 > result ? result + 1 : temp2 : temp2 > temp ? temp + 1 : temp2;
      }
    }

    return result;
  };

  var leven_1 = leven; // TODO: Remove this for the next major release

  var _default = leven;
  leven_1.default = _default;

  /**
   * string-process-comma-separated
   * Extracts chunks from possibly comma or whatever-separated string
   * Version: 1.2.8
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-process-comma-separated
   */
  function processCommaSeparated(str, originalOpts) {
    if (typeof str !== "string") {
      throw new Error(`string-process-comma-separated: [THROW_ID_01] input must be string! It was given as ${typeof str}, equal to:\n${JSON.stringify(str, null, 4)}`);
    } else if (!str.length || !originalOpts.cb && !originalOpts.errCb) {
      return;
    }

    const defaults = {
      from: 0,
      to: str.length,
      offset: 0,
      leadingWhitespaceOK: false,
      trailingWhitespaceOK: false,
      oneSpaceAfterCommaOK: false,
      innerWhitespaceAllowed: false,
      separator: ",",
      cb: null,
      errCb: null
    };
    const opts = { ...defaults,
      ...originalOpts
    };

    if (!Number.isInteger(originalOpts.from)) {
      opts.from = 0;
    }

    if (!Number.isInteger(originalOpts.to)) {
      opts.to = str.length;
    }

    if (!Number.isInteger(originalOpts.offset)) {
      opts.offset = 0;
    }

    let chunkStartsAt = null;
    let whitespaceStartsAt = null;
    let firstNonwhitespaceNonseparatorCharFound = false;
    let separatorsArr = [];
    let lastNonWhitespaceCharAt = null;
    let fixable = true;

    for (let i = opts.from; i < opts.to; i++) {
      if (str[i].trim() && str[i] !== opts.separator) {
        lastNonWhitespaceCharAt = i;
      }

      if (chunkStartsAt === null && str[i].trim() && (!opts.separator || str[i] !== opts.separator)) {
        if (!firstNonwhitespaceNonseparatorCharFound) {
          firstNonwhitespaceNonseparatorCharFound = true;
        }

        if (separatorsArr.length) {
          if (separatorsArr.length > 1) {
            separatorsArr.forEach((separatorsIdx, orderNumber) => {
              if (orderNumber) {
                opts.errCb([[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]], "Remove separator.", fixable);
              }
            });
          }

          separatorsArr = [];
        }

        chunkStartsAt = i;
      }

      if (Number.isInteger(chunkStartsAt) && (i > chunkStartsAt && opts.separator && str[i] === opts.separator || i + 1 === opts.to)) {
        const chunk = str.slice(chunkStartsAt, i + 1 === opts.to && str[i] !== opts.separator && str[i].trim() ? i + 1 : i);

        if (typeof opts.cb === "function") {
          opts.cb(chunkStartsAt + opts.offset, (i + 1 === opts.to && str[i] !== opts.separator && str[i].trim() ? i + 1 : lastNonWhitespaceCharAt + 1) + opts.offset);
        }

        chunkStartsAt = null;
      }

      if (!str[i].trim() && whitespaceStartsAt === null) {
        whitespaceStartsAt = i;
      }

      if (whitespaceStartsAt !== null && (str[i].trim() || i + 1 === opts.to)) {
        if (whitespaceStartsAt === opts.from) {
          if (!opts.leadingWhitespaceOK && typeof opts.errCb === "function") {
            opts.errCb([[whitespaceStartsAt + opts.offset, (i + 1 === opts.to ? i + 1 : i) + opts.offset]], "Remove whitespace.", fixable);
          }
        } else if (!str[i].trim() && i + 1 === opts.to) {
          if (!opts.trailingWhitespaceOK && typeof opts.errCb === "function") {
            opts.errCb([[whitespaceStartsAt + opts.offset, i + 1 + opts.offset]], "Remove whitespace.", fixable);
          }
        } else if ((!opts.oneSpaceAfterCommaOK || !(str[i].trim() && i > opts.from + 1 && str[i - 1] === " " && str[i - 2] === ",")) && (!opts.innerWhitespaceAllowed || !(firstNonwhitespaceNonseparatorCharFound && str[whitespaceStartsAt - 1] && str[i].trim() && str[i] !== opts.separator && str[whitespaceStartsAt - 1] !== opts.separator))) {
          let startingIdx = whitespaceStartsAt;
          let endingIdx = i;

          if (i + 1 === opts.to && str[i] !== opts.separator && !str[i].trim()) {
            endingIdx += 1;
          }

          let whatToAdd = "";

          if (opts.oneSpaceAfterCommaOK) {
            if (str[whitespaceStartsAt] === " " && str[whitespaceStartsAt - 1] === opts.separator) {
              startingIdx += 1;
            } else if (str[whitespaceStartsAt] !== " ") {
              whatToAdd = " ";
            }
          }

          let message = "Remove whitespace.";

          if (!opts.innerWhitespaceAllowed && firstNonwhitespaceNonseparatorCharFound && str[whitespaceStartsAt - 1] && str[i].trim() && str[i] !== opts.separator && str[whitespaceStartsAt - 1] !== opts.separator) {
            fixable = false;
            message = "Bad whitespace.";
          }

          if (whatToAdd.length) {
            opts.errCb([[startingIdx + opts.offset, endingIdx + opts.offset, whatToAdd]], message, fixable);
          } else {
            opts.errCb([[startingIdx + opts.offset, endingIdx + opts.offset]], message, fixable);
          }

          fixable = true;
        }

        whitespaceStartsAt = null;
      }

      if (str[i] === opts.separator) {
        if (!firstNonwhitespaceNonseparatorCharFound) {
          opts.errCb([[i + opts.offset, i + 1 + opts.offset]], "Remove separator.", fixable);
        } else {
          separatorsArr.push(i);
        }
      }

      if (i + 1 === opts.to) {
        separatorsArr.forEach(separatorsIdx => {
          opts.errCb([[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]], "Remove separator.", fixable);
        });
      }
    }
  }

  var recognisedMediaTypes = ["all", "aural", "braille", "embossed", "handheld", "print", "projection", "screen", "speech", "tty", "tv"]; // eslint-disable-next-line no-unused-vars

  var recognisedMediaFeatures = ["width", "min-width", "max-width", "height", "min-height", "max-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "orientation", "resolution", "min-resolution", "max-resolution", "scan", "grid", "update", "overflow-block", "overflow-inline", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "color-gamut", "pointer", "hover", "any-pointer", "any-hover"]; // eslint-disable-next-line no-unused-vars
  var lettersOnlyRegex = /^\w+$/g;

  function loop(str, opts, res) {
    // opts.offset is passed but we don't Object.assign for perf reasons
    var chunkStartsAt = null;
    var gatheredChunksArr = [];
    var whitespaceStartsAt = null;

    var nextCanBeMediaType = true;
    var nextCanBeMediaCondition = true;
    var nextCanBeNotOrOnly = true;
    var nextCanBeAnd = false; // here we keep a note where we are bracket-wise, how deep

    var bracketOpeningIndexes = [];

    for (var i = opts.idxFrom; i <= opts.idxTo; i++) {
      //
      //
      //
      //
      //
      //                                THE TOP
      //                                ███████
      //
      //
      //
      //
      // Logging:
      // -------------------------------------------------------------------------
      //
      //
      //
      //
      //                               MIDDLE
      //                               ██████
      //
      //
      //
      //
      // catch closing bracket
      if (str[i] === ")") {
        var lastOpening = bracketOpeningIndexes.pop();
        var extractedValueWithinBrackets = str.slice(lastOpening + 1, i); // Preliminary check, will be improved later.
        // Idea: if extracted chunk in the brackets doesn't have any nested
        // brackets, we can evaluate it quickly, especially if it does not
        // contain colon.
        // For example we extracted "zzz" from:
        // screen and not (print and (zzz))

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
        } // everything nested like (screen and (color))
        // and contains media type


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
      } // catch opening bracket


      if (str[i] === "(") {
        bracketOpeningIndexes.push(i);
      } // catch the ending of a whitespace chunk


      if (str[i] && str[i].trim().length && whitespaceStartsAt !== null) {
        if (str[whitespaceStartsAt - 1] === "(" || str[i] === ")") {
          // if it's whitespace inside brackets, wipe it
          res.push({
            idxFrom: whitespaceStartsAt + opts.offset,
            // reporting is always whole whitespace
            idxTo: i + opts.offset,
            // reporting is always whole whitespace
            message: "Bad whitespace.",
            fix: {
              ranges: [[whitespaceStartsAt + opts.offset, i + opts.offset]]
            }
          });
        } else if (whitespaceStartsAt < i - 1 || str[i - 1] !== " ") {
          // Depends what whitespace is this. We aim to remove minimal amount
          // of characters possible. If there is excessive whitespace, we'll
          // delete all spaces except one instead of deleting all spaces and
          // inserting a space. That's to minimize the footprint of amends,
          // also to make merged ranges simpler later.
          // defaults is whole thing replacement:
          var rangesFrom = whitespaceStartsAt + opts.offset;
          var rangesTo = i + opts.offset;
          var rangesInsert = " "; // if whitespace chunk is longer than one, let's try to cut corners:

          if (whitespaceStartsAt !== i - 1) {
            if (str[whitespaceStartsAt] === " ") {
              rangesFrom += 1;
              rangesInsert = null;
            } else if (str[i - 1] === " ") {
              rangesTo -= 1;
              rangesInsert = null;
            }
          }

          res.push({
            idxFrom: whitespaceStartsAt + opts.offset,
            // reporting is always whole whitespace
            idxTo: i + opts.offset,
            // reporting is always whole whitespace
            message: "Bad whitespace.",
            fix: {
              ranges: [rangesInsert ? [rangesFrom, rangesTo, " "] : [rangesFrom, rangesTo]]
            }
          });
        } // reset


        whitespaceStartsAt = null;
      } // catch the beginning of a whitespace chunk


      if (str[i] && !str[i].trim().length && whitespaceStartsAt === null) {
        whitespaceStartsAt = i;
      } // catch the ending of a chunk
      // we deliberately wander outside of the string length by 1 character
      // to simplify calculations and to shake up the type complaceancy,
      // str[i] can be undefined now (on the last traversal cycle)!


      if (chunkStartsAt !== null && (!str[i] || !str[i].trim().length) && !bracketOpeningIndexes.length) {
        // extract the value:
        var chunk = str.slice(chunkStartsAt, i);
        gatheredChunksArr.push(chunk.toLowerCase()); // we use nextCanBeMediaTypeOrMediaCondition to establish where we are
        // logically - media type/condition might be preceded by not/only or
        // might be not - that's why we need this flag, to distinguish these
        // two cases

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
          nextCanBeNotOrOnly = false; // nextCanBeMediaType stays true
          // but nextCanBeMediaCondition is now off because media conditions
          // can't be preceded by not/only
          // spec:
          //
          // <media-query> = <media-condition>
          //     | [ not | only ]? <media-type> [ and <media-condition-without-or> ]?
          // - https://www.w3.org/TR/mediaqueries-4/#typedef-media-condition
          //

          nextCanBeMediaCondition = false;
        } else if (nextCanBeMediaType || nextCanBeMediaCondition) {
          // is it media type or media condition?
          if (chunk.startsWith("(")) {
            // resembles media condition
            // is there a media condition allowed here?
            if (nextCanBeMediaCondition) ; else {
              var message = "Media condition \"".concat(str.slice(chunkStartsAt, i), "\" can't be here."); // try to pinpoint the error's cause:

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
            // resembles media type
            // is there a media type allowed here?
            if (nextCanBeMediaType) {
              // is it a recognised type?
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
              // as a last resort, let's check, maybe it's a known condition but without brackets?
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
          } // finally, set the flag for the next chunk's expectations


          nextCanBeAnd = true;
        } else {
          // if flag "nextCanBeMediaTypeOrMediaCondition" is false, this means we are
          // currently located at after the media type or media condition,
          // for example, where <here> marks below:
          // "@media screen <here>" or "@media (color) <here>"
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: "Unrecognised media type \"".concat(str.slice(chunkStartsAt, i), "\"."),
            fix: null
          });
        } // reset


        chunkStartsAt = null;

        if (nextCanBeNotOrOnly) {
          nextCanBeNotOrOnly = false;
        }
      } // TODO - remove
      // catch the beginning of a chunk, without brackets like "print" or
      // with brackets like (min-resolution: 300dpi)


      if (chunkStartsAt === null && str[i] && str[i].trim().length && str[i] !== ")") {
        // Deliberately we keep chunk opening clauses and logic which
        // determines is chunk within brackets, together.
        // That's to potentially avoid logic clause mishaps later.
        if (str[i] === "(") ;

        chunkStartsAt = i;
      } //
      //
      //
      //
      //                               BOTTOM
      //                               ██████
      //
      //
      //
      //
      // LOGGING

    }
  }

  // Also https://csstree.github.io/docs/validator.html
  // Also, test in Chrome yourself

  function isMediaD(originalStr, originalOpts) {
    var defaults = {
      offset: 0
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts); // insurance first


    if (opts.offset && !Number.isInteger(opts.offset)) {
      throw new Error("is-media-descriptor: [THROW_ID_01] opts.offset must be an integer, it was given as ".concat(opts.offset, " (type ").concat(_typeof(opts.offset), ")"));
    }

    if (!opts.offset) {
      // to cater false/null
      opts.offset = 0;
    } // quick ending


    if (typeof originalStr !== "string") {
      return [];
    }

    if (!originalStr.trim()) {
      return [];
    }

    var res = []; // We pay extra attention to whitespace. These two below
    // mark the known index of the first and last non-whitespace
    // character (a'la trim)

    var nonWhitespaceStart = 0;
    var nonWhitespaceEnd = originalStr.length;
    var str = originalStr.trim(); // ---------------------------------------------------------------------------
    // check for inner whitespace, for example,
    // " screen and (color), projection and (color)"
    //  ^
    //
    // as in...
    //
    // <link media=" screen and (color), projection and (color)" rel="stylesheet" href="example.css">
    //
    // ^ notice rogue space above

    if (originalStr !== originalStr.trim()) {
      var ranges = [];

      if (!originalStr[0].trim()) {
        for (var i = 0, len = originalStr.length; i < len; i++) {
          if (originalStr[i].trim()) {
            ranges.push([0 + opts.offset, i + opts.offset]);
            nonWhitespaceStart = i;
            break;
          }
        }
      }

      if (!originalStr[originalStr.length - 1].trim()) {
        for (var _i = originalStr.length; _i--;) {
          if (originalStr[_i].trim()) {
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
    } // ---------------------------------------------------------------------------
    // quick checks first - cover the most common cases, to make checks the
    // quickest possible when everything's all right


    if (recognisedMediaTypes.includes(str)) {
      //
      //
      //
      //
      //
      //
      //
      //
      // 1. string-only, like "screen"
      //
      //
      //
      //
      //
      //
      //
      //
      return res;
    }

    if (["only", "not"].includes(str)) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "Missing media type or condition.",
        fix: null
      });
    } else if (str.match(lettersOnlyRegex) && !str.includes("(") && !str.includes(")")) {
      //
      //
      //
      //
      //
      //
      //
      //
      // 2. string-only, unrecognised like "screeeen"
      //
      //
      //
      //
      //
      //
      //
      //
      for (var _i2 = 0, _len = recognisedMediaTypes.length; _i2 < _len; _i2++) {
        if (leven_1(recognisedMediaTypes[_i2], str) === 1) {
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
          // it means nothing was matched
          res.push({
            idxFrom: nonWhitespaceStart + opts.offset,
            idxTo: nonWhitespaceEnd + opts.offset,
            message: "Unrecognised media type \"".concat(str, "\"."),
            fix: null
          });
        }
      }
    } else {
      //
      //
      //
      //
      //
      //
      //
      //
      // 3. mixed, like "screen and (color)"
      //
      //
      //
      //
      //
      //
      //
      //
      // PART 1.
      // ███████████████████████████████████████
      // Preventive checks will help to simplify the algorithm - we won't need
      // to cater for so many edge cases later.
      var wrongOrder = false;

      var _Array$from$reduce = Array.from(str).reduce(function (acc, curr, idx) {
        if (curr === ")") {
          // if at any time, there are more closing brackets than opening-ones,
          // this means order is messed up
          if (!wrongOrder && acc[1] + 1 > acc[0]) {
            wrongOrder = true;
          }

          return [acc[0], acc[1] + 1];
        }

        if (curr === "(") {
          return [acc[0] + 1, acc[1]];
        }

        if (curr === ";") {
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
          closingBracketCount = _Array$from$reduce2[1]; // we raise this error only when there is equal amount of brackets,
      // only the order is messed up:


      if (wrongOrder && openingBracketCount === closingBracketCount) {
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: "Some closing brackets are before their opening counterparts.",
          fix: null
        });
      } // reporting that there were more one kind
      // of brackets than the other:


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
        // now find out where
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
          } else if (str[_i3].trim()) {
            nonWhitespaceFound = true;
          }
        }
      }

      if (res.length) {
        // report errors early, save resources
        return res;
      } // PART 2.
      // ███████████████████████████████████████
      // first parse comma-separated chunks


      processCommaSeparated(str, {
        offset: opts.offset,
        leadingWhitespaceOK: false,
        trailingWhitespaceOK: false,
        oneSpaceAfterCommaOK: true,
        innerWhitespaceAllowed: true,
        separator: ",",
        cb: function cb(idxFrom, idxTo) {
          loop(str, _objectSpread2(_objectSpread2({}, opts), {}, {
            idxFrom: idxFrom - opts.offset,
            idxTo: idxTo - opts.offset
          }), res);
        },
        errCb: function errCb(ranges, message) {}
      }); // PART 3.
      // ███████████████████████████████████████
      // if (!res.length) {
      //   // finally, if no errors were caught, parse:
      //   console.log(`329 PART III. Run through CSS Tree parser.`);
      //   const temp = cssTreeValidate(`@media ${str} {}`);
      //   console.log(
      //     `332 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
      //       temp,
      //       null,
      //       4
      //     )}`
      //   );
      // }
    } // ---------------------------------------------------------------------------


    return res;
  }

  return isMediaD;

})));
