/**
 * string-collapse-white-space
 * Replace chunks of whitespace with a single spaces
 * Version: 9.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-white-space/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var rangesApply = require('ranges-apply');
var rangesPush = require('ranges-push');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version$1 = "9.0.11";

var version = version$1;
var defaults = {
  trimStart: true,
  trimEnd: true,
  trimLines: false,
  trimnbsp: false,
  removeEmptyLines: false,
  limitConsecutiveEmptyLinesTo: 0,
  enforceSpacesOnly: false,
  cb: function cb(_ref) {
    var suggested = _ref.suggested;
    return suggested;
  }
};
var cbSchema = ["suggested", "whiteSpaceStartsAt", "whiteSpaceEndsAt", "str"];
function collapse(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but " + typeof str + ", equal to: " + JSON.stringify(str, null, 4));
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error("string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but " + typeof originalOpts + ", equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }
  if (!str.length) {
    return {
      result: "",
      ranges: null
    };
  }
  var finalIndexesToDelete = new rangesPush.Ranges();
  var NBSP = "\xA0";
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  function push(something, extras) {
    if (typeof opts.cb === "function") {
      var final = opts.cb(_objectSpread__default['default']({
        suggested: something
      }, extras));
      if (Array.isArray(final)) {
        finalIndexesToDelete.push.apply(finalIndexesToDelete, final);
      }
    } else if (something) {
      finalIndexesToDelete.push.apply(finalIndexesToDelete, something);
    }
  }
  var spacesStartAt = null;
  var whiteSpaceStartsAt = null;
  var lineWhiteSpaceStartsAt = null;
  var linebreaksStartAt = null;
  var linebreaksEndAt = null;
  var nbspPresent = false;
  var staging = [];
  var consecutiveLineBreakCount = 0;
  for (var i = 0, len = str.length; i <= len; i++) {
    if (str[i] === "\r" || str[i] === "\n" && str[i - 1] !== "\r") {
      consecutiveLineBreakCount += 1;
      if (linebreaksStartAt === null) {
        linebreaksStartAt = i;
      }
      linebreaksEndAt = str[i] === "\r" && str[i + 1] === "\n" ? i + 2 : i + 1;
    }
    if (!opts.trimnbsp && str[i] === NBSP && !nbspPresent) {
      nbspPresent = true;
    }
    if (
    spacesStartAt !== null &&
    str[i] !== " ") {
      var a1 =
      spacesStartAt && whiteSpaceStartsAt ||
      !whiteSpaceStartsAt && (!opts.trimStart || !opts.trimnbsp && (
      str[i] === NBSP || str[spacesStartAt - 1] === NBSP));
      var a2 =
      str[i] || !opts.trimEnd || !opts.trimnbsp && (
      str[i] === NBSP || str[spacesStartAt - 1] === NBSP);
      var a3 =
      !opts.enforceSpacesOnly ||
      (!str[spacesStartAt - 1] ||
      str[spacesStartAt - 1].trim()) && (
      !str[i] ||
      str[i].trim());
      if (
      spacesStartAt < i - 1 && a1 && a2 && a3) {
        var startIdx = spacesStartAt;
        var endIdx = i;
        var whatToAdd = " ";
        if (opts.trimLines && (
        !spacesStartAt ||
        !str[i] ||
        str[spacesStartAt - 1] && "\r\n".includes(str[spacesStartAt - 1]) ||
        str[i] && "\r\n".includes(str[i]))) {
          whatToAdd = null;
        }
        if (whatToAdd && str[spacesStartAt] === " ") {
          endIdx -= 1;
          whatToAdd = null;
        }
        if (!spacesStartAt && opts.trimStart) {
          endIdx = i;
        } else if (!str[i] && opts.trimEnd) {
          endIdx = i;
        }
        staging.push([
        /* istanbul ignore next */
        whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: stringLeftRight.right(str, i - 1) || i,
          str: str
        }]);
      }
    }
    if (
    spacesStartAt === null &&
    str[i] === " ") {
      spacesStartAt = i;
    }
    if (
    whiteSpaceStartsAt === null &&
    str[i] && !str[i].trim()) {
      whiteSpaceStartsAt = i;
    }
    if (
    lineWhiteSpaceStartsAt !== null && (
    "\n\r".includes(str[i]) ||
    !str[i] || str[i].trim() ||
    !(opts.trimnbsp || opts.enforceSpacesOnly) &&
    str[i] === NBSP) && (
    lineWhiteSpaceStartsAt || !opts.trimStart || opts.enforceSpacesOnly && nbspPresent) && (
    str[i] || !opts.trimEnd || opts.enforceSpacesOnly && nbspPresent)) {
      if (
      opts.enforceSpacesOnly && (
      i > lineWhiteSpaceStartsAt + 1 ||
      str[lineWhiteSpaceStartsAt] !== " ")) {
        var _startIdx = lineWhiteSpaceStartsAt;
        var _endIdx = i;
        var _whatToAdd = " ";
        if (str[_endIdx - 1] === " ") {
          _endIdx -= 1;
          _whatToAdd = null;
        } else if (str[lineWhiteSpaceStartsAt] === " ") {
          _startIdx += 1;
          _whatToAdd = null;
        }
        if ((opts.trimStart || opts.trimLines) && !lineWhiteSpaceStartsAt || (opts.trimEnd || opts.trimLines) && !str[i]) {
          _whatToAdd = null;
        }
        push(_whatToAdd ? [_startIdx, _endIdx, _whatToAdd] : [_startIdx, _endIdx], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str: str
        });
      }
      if (
      opts.trimLines && (
      !lineWhiteSpaceStartsAt || "\r\n".includes(str[lineWhiteSpaceStartsAt - 1]) || !str[i] || "\r\n".includes(str[i])) && (
      opts.trimnbsp ||
      !nbspPresent)) {
        push([lineWhiteSpaceStartsAt, i], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: stringLeftRight.right(str, i - 1) || i,
          str: str
        });
      }
      lineWhiteSpaceStartsAt = null;
    }
    if (
    lineWhiteSpaceStartsAt === null &&
    !"\r\n".includes(str[i]) &&
    str[i] && !str[i].trim() && (
    opts.trimnbsp || str[i] !== NBSP || opts.enforceSpacesOnly)) {
      lineWhiteSpaceStartsAt = i;
    }
    if (
    whiteSpaceStartsAt !== null && (
    !str[i] ||
    str[i].trim())) {
      if (
      (!whiteSpaceStartsAt && (
      opts.trimStart ||
      opts.trimLines &&
      linebreaksStartAt === null) ||
      !str[i] && (
      opts.trimEnd ||
      opts.trimLines &&
      linebreaksStartAt === null)) && (
      opts.trimnbsp ||
      !nbspPresent ||
      opts.enforceSpacesOnly)) {
        push([whiteSpaceStartsAt, i], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str: str
        });
      } else {
        var somethingPushed = false;
        if (opts.removeEmptyLines &&
        linebreaksStartAt !== null &&
        consecutiveLineBreakCount > (opts.limitConsecutiveEmptyLinesTo || 0) + 1) {
          somethingPushed = true;
          var _startIdx2 = linebreaksStartAt;
          var _endIdx2 = linebreaksEndAt || str.length;
          var _whatToAdd2 = ("" + (str[linebreaksStartAt] === "\r" && str[linebreaksStartAt + 1] === "\n" ? "\r\n" : str[linebreaksStartAt])).repeat((opts.limitConsecutiveEmptyLinesTo || 0) + 1);
          /* istanbul ignore else */
          if (str.endsWith(_whatToAdd2, linebreaksEndAt)) {
            _endIdx2 -= _whatToAdd2.length || 0;
            _whatToAdd2 = null;
          } else if (str.startsWith(_whatToAdd2, linebreaksStartAt)) {
            _startIdx2 += _whatToAdd2.length;
            _whatToAdd2 = null;
          }
          /* istanbul ignore next */
          push(_whatToAdd2 ? [_startIdx2, _endIdx2, _whatToAdd2] : [_startIdx2, _endIdx2], {
            whiteSpaceStartsAt: whiteSpaceStartsAt,
            whiteSpaceEndsAt: i,
            str: str
          });
        }
        if (staging.length) {
          while (staging.length) {
            push.apply(void 0, staging.shift());
          }
          somethingPushed = true;
        }
        if (!somethingPushed) {
          push(null, {
            whiteSpaceStartsAt: whiteSpaceStartsAt,
            whiteSpaceEndsAt: i,
            str: str
          });
        }
      }
      whiteSpaceStartsAt = null;
      lineWhiteSpaceStartsAt = null;
      nbspPresent = false;
      if (consecutiveLineBreakCount) {
        consecutiveLineBreakCount = 0;
        linebreaksStartAt = null;
        linebreaksEndAt = null;
      }
    }
    if (spacesStartAt !== null && str[i] !== " ") {
      spacesStartAt = null;
    }
  }
  return {
    result: rangesApply.rApply(str, finalIndexesToDelete.current()),
    ranges: finalIndexesToDelete.current()
  };
}

exports.cbSchema = cbSchema;
exports.collapse = collapse;
exports.defaults = defaults;
exports.version = version;
