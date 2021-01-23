/**
 * string-collapse-white-space
 * Replace chunks of whitespace with a single spaces
 * Version: 9.0.0
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

var version = "9.0.0";

var version$1 = version; // default set of options

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
    // console.log(`default CB called`);
    // console.log(
    //   `${`\u001b[${33}m${`suggested`}\u001b[${39}m`} = ${JSON.stringify(
    //     suggested,
    //     null,
    //     4
    //   )}`
    // );
    return suggested;
  }
};
var cbSchema = ["suggested", "whiteSpaceStartsAt", "whiteSpaceEndsAt", "str"];

function collapse(str, originalOpts) { // f's

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
  var NBSP = "\xA0"; // fill any settings with defaults if missing:

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
  } // -----------------------------------------------------------------------------


  var spacesStartAt = null;
  var whiteSpaceStartsAt = null;
  var lineWhiteSpaceStartsAt = null;
  var linebreaksStartAt = null;
  var linebreaksEndAt = null;
  var nbspPresent = false;
  var staging = [];
  var consecutiveLineBreakCount = 0;

  for (var i = 0, len = str.length; i <= len; i++) {
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                        LOOP STARTS - THE TOP PART
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // // line break counting

    if (str[i] === "\r" || str[i] === "\n" && str[i - 1] !== "\r") {
      consecutiveLineBreakCount += 1;

      if (linebreaksStartAt === null) {
        linebreaksStartAt = i;
      }

      linebreaksEndAt = str[i] === "\r" && str[i + 1] === "\n" ? i + 2 : i + 1;
    } // catch raw non-breaking spaces


    if (!opts.trimnbsp && str[i] === NBSP && !nbspPresent) {
      nbspPresent = true;
    } //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                             LOOP'S MIDDLE
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // catch the end of space character (" ") sequences


    if ( // spaces sequence hasn't started yet
    spacesStartAt !== null && // it's a space
    str[i] !== " ") {
      var a1 = // it's not a beginning of the string (more general whitespace clauses
      // will take care of trimming, taking into account opts.trimStart etc)
      // either it's not leading whitespace
      spacesStartAt && whiteSpaceStartsAt || // it is within frontal whitespace and
      !whiteSpaceStartsAt && (!opts.trimStart || !opts.trimnbsp && ( // we can't trim NBSP
      // and there's NBSP on one side
      str[i] === NBSP || str[spacesStartAt - 1] === NBSP));
      var a2 = // it is not a trailing whitespace
      str[i] || !opts.trimEnd || !opts.trimnbsp && ( // we can't trim NBSP
      // and there's NBSP on one side
      str[i] === NBSP || str[spacesStartAt - 1] === NBSP);
      var a3 = // beware that there might be whitespace characters (like tabs, \t)
      // before or after this chunk of spaces - if opts.enforceSpacesOnly
      // is enabled, we need to skip this clause because wider, general
      // whitespace chunk clauses will take care of the whole chunk, larger
      // than this [spacesStartAt, i - 1], it will be
      // [whiteSpaceStartsAt, ..., " "]
      //
      // either spaces-only setting is off,
      !opts.enforceSpacesOnly || // neither of surrounding characters (if present) is not whitespace
      (!str[spacesStartAt - 1] || // or it's not whitespace
      str[spacesStartAt - 1].trim()) && ( // either it's end of string
      !str[i] || // it's not a whitespace
      str[i].trim());

      if ( // length of spaces sequence is more than 1
      spacesStartAt < i - 1 && a1 && a2 && a3) {
        var startIdx = spacesStartAt;
        var endIdx = i;
        var whatToAdd = " ";

        if (opts.trimLines && ( // touches the start
        !spacesStartAt || // touches the end
        !str[i] || // linebreak before
        str[spacesStartAt - 1] && "\r\n".includes(str[spacesStartAt - 1]) || // linebreak after
        str[i] && "\r\n".includes(str[i]))) {
          whatToAdd = null;
        } // the plan is to reuse existing spaces - for example, imagine:
        // "a   b" - three space gap.
        // Instead of overwriting all three spaces with single space, range:
        // [1, 4, " "], we leave the last space, only deleting other two:
        // range [1, 3] (notice the third element, "what to add" missing).

        if (whatToAdd && str[spacesStartAt] === " ") {
          endIdx -= 1;
          whatToAdd = null;
        } // if nbsp trimming is disabled and we have a situation like:
        // "    \xa0     a"
        //      ^
        // we're here
        //
        // we need to still trim the spaces chunk, in whole


        if (!spacesStartAt && opts.trimStart) {
          endIdx = i;
        } else if (!str[i] && opts.trimEnd) {
          endIdx = i;
        } // Notice we could push ranges to final, using standalone push()
        // but here we stage because general whitespace clauses need to be
        // aware what was "booked" so far.

        staging.push([
        /* istanbul ignore next */
        whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: stringLeftRight.right(str, i - 1) || i,
          str: str
        }]);
      } // resets are at the bottom

    } // catch the start of space character (" ") sequences


    if ( // spaces sequence hasn't started yet
    spacesStartAt === null && // it's a space
    str[i] === " ") {
      spacesStartAt = i;
    } // catch the start of whitespace chunks


    if ( // chunk hasn't been recording
    whiteSpaceStartsAt === null && // it's whitespace
    str[i] && !str[i].trim()) {
      whiteSpaceStartsAt = i;
    } // catch the end of line whitespace (chunk of whitespace characters execept LF / CR)


    if ( // chunk has been recording
    lineWhiteSpaceStartsAt !== null && ( // and end has been met:
    //
    // either line break has been reached
    "\n\r".includes(str[i]) || // or
    // it's not whitespace
    !str[i] || str[i].trim() || // either we don't care about non-breaking spaces and trim/replace them
    !(opts.trimnbsp || opts.enforceSpacesOnly) && // and we do care and it's not a non-breaking space
    str[i] === NBSP) && ( // also, mind the trim-able whitespace at the edges...
    //
    // it's not beginning of the string (more general whitespace clauses
    // will take care of trimming, taking into account opts.trimStart etc)
    lineWhiteSpaceStartsAt || !opts.trimStart || opts.enforceSpacesOnly && nbspPresent) && ( // it's not the ending of the string - we traverse upto and including
    // str.length, which means last str[i] is undefined
    str[i] || !opts.trimEnd || opts.enforceSpacesOnly && nbspPresent)) { // tend opts.enforceSpacesOnly
      // ---------------------------

      if ( // setting is on
      opts.enforceSpacesOnly && ( // either chunk's longer than 1
      i > lineWhiteSpaceStartsAt + 1 || // or it's single character but not a space (yet still whitespace)
      str[lineWhiteSpaceStartsAt] !== " ")) { // also whole whitespace chunk goes, only we replace with a single space
        // but maybe we can reuse existing characters to reduce the footprint

        var _startIdx = lineWhiteSpaceStartsAt;
        var _endIdx = i;
        var _whatToAdd = " ";

        if (str[_endIdx - 1] === " ") {
          _endIdx -= 1;
          _whatToAdd = null;
        } else if (str[lineWhiteSpaceStartsAt] === " ") {
          _startIdx += 1;
          _whatToAdd = null;
        } // make sure it's not on the edge of string with trim options enabled,
        // in that case don't add the space!


        if ((opts.trimStart || opts.trimLines) && !lineWhiteSpaceStartsAt || (opts.trimEnd || opts.trimLines) && !str[i]) {
          _whatToAdd = null;
        }
        push(_whatToAdd ? [_startIdx, _endIdx, _whatToAdd] : [_startIdx, _endIdx], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str: str
        });
      } // tend opts.trimLines
      // -------------------


      if ( // setting is on
      opts.trimLines && ( // it is on the edge of a line
      !lineWhiteSpaceStartsAt || "\r\n".includes(str[lineWhiteSpaceStartsAt - 1]) || !str[i] || "\r\n".includes(str[i])) && ( // and we don't care about non-breaking spaces
      opts.trimnbsp || // this chunk doesn't contain any
      !nbspPresent)) {
        push([lineWhiteSpaceStartsAt, i], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: stringLeftRight.right(str, i - 1) || i,
          str: str
        });
      }

      lineWhiteSpaceStartsAt = null;
    } // Catch the start of a sequence of line whitespace (chunk of whitespace characters execept LF / CR)


    if ( // chunk hasn't been recording
    lineWhiteSpaceStartsAt === null && // we're currently not on CR or LF
    !"\r\n".includes(str[i]) && // and it's whitespace
    str[i] && !str[i].trim() && ( // mind the raw non-breaking spaces
    opts.trimnbsp || str[i] !== NBSP || opts.enforceSpacesOnly)) {
      lineWhiteSpaceStartsAt = i;
    } //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                             LOOP'S BOTTOM
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // Catch the end of whitespace chunks
    // This clause is deliberately under the catch clauses of the end of line
    // whitespace chunks because the empty, null ranges are the last thing to
    // be pinged to the callback. "pushed" flag must not be triggered too early.


    if ( // whitespace chunk has been recording
    whiteSpaceStartsAt !== null && ( // it's EOL
    !str[i] || // or non-whitespace character
    str[i].trim())) { // If there's anything staged, that must be string-only or per-line
      // whitespace chunks (possibly even multiple) gathered while we've been
      // traversing this (one) whitespace chunk.

      if ( // whitespace is frontal
      (!whiteSpaceStartsAt && ( // frontal trimming is enabled
      opts.trimStart || // or per-line trimming is enabled
      opts.trimLines && // and we're on the same line (we don't want to remove linebreaks)
      linebreaksStartAt === null) || // whitespace is trailing
      !str[i] && ( // trailing part's trimming is enabled
      opts.trimEnd || // or per-line trimming is enabled
      opts.trimLines && // and we're on the same line (we don't want to remove linebreaks)
      linebreaksStartAt === null)) && ( // either we don't care about non-breaking spaces
      opts.trimnbsp || // or there are no raw non-breaking spaces in this trim-suitable chunk
      !nbspPresent || // or there are non-breaking spaces but they don't matter because
      // we want spaces-only everywhere
      opts.enforceSpacesOnly)) {
        push([whiteSpaceStartsAt, i], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str: str
        });
      } else {
        var somethingPushed = false; // tackle the line breaks
        // ----------------------

        if (opts.removeEmptyLines && // there were some linebreaks recorded
        linebreaksStartAt !== null && // there are too many
        consecutiveLineBreakCount > (opts.limitConsecutiveEmptyLinesTo || 0) + 1) {
          somethingPushed = true; // try to salvage some of the existing linebreaks - don't replace the
          // same with the same

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
        } // push the staging if it exists
        // -----------------------------


        if (staging.length) {

          while (staging.length) {
            // FIFO - first in, first out
            // @tsx-ignore
            push.apply(void 0, staging.shift());
          }

          somethingPushed = true;
        } // if nothing has been pushed so far, push nothing to cb()
        // -------------------------------------------------------


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
      nbspPresent = false; // reset line break counts

      if (consecutiveLineBreakCount) {
        consecutiveLineBreakCount = 0;
        linebreaksStartAt = null;
        linebreaksEndAt = null;
      }
    } // rest spaces chunk starting record


    if (spacesStartAt !== null && str[i] !== " ") {
      spacesStartAt = null;
    } // ------------------------------------------------------------------------- //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                             LOOP ENDS
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
  }
  return {
    result: rangesApply.rApply(str, finalIndexesToDelete.current()),
    ranges: finalIndexesToDelete.current()
  };
}

exports.cbSchema = cbSchema;
exports.collapse = collapse;
exports.defaults = defaults;
exports.version = version$1;
