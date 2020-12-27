/**
 * ranges-process-outside
 * Iterate string considering ranges, as if they were already applied
 * Version: 3.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-process-outside/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var runes = require('runes');
var rangesInvert = require('ranges-invert');
var rangesCrop = require('ranges-crop');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var runes__default = /*#__PURE__*/_interopDefaultLegacy(runes);

var version = "3.0.2";

function rProcessOutside(originalStr, originalRanges, cb, skipChecks) {
  if (skipChecks === void 0) {
    skipChecks = false;
  }

  //
  // insurance:
  //
  if (typeof originalStr !== "string") {
    if (originalStr === undefined) {
      throw new Error("ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!");
    } else {
      throw new Error("ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n" + JSON.stringify(originalStr, null, 4) + " (type " + typeof originalStr + ")");
    }
  }

  if (originalRanges && (!Array.isArray(originalRanges) || originalRanges.length && !Array.isArray(originalRanges[0]))) {
    throw new Error("ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n" + JSON.stringify(originalRanges, null, 4) + " (type " + typeof originalRanges + ")");
  }

  if (typeof cb !== "function") {
    throw new Error("ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n" + JSON.stringify(cb, null, 4) + " (type " + typeof cb + ")");
  } // separate the iterator because it might be called with inverted ranges or
  // with separately calculated "everything" if the ranges are empty/falsey


  function iterator(str, arrOfArrays) {
    (arrOfArrays || []).forEach(function (_ref) {
      var fromIdx = _ref[0],
          toIdx = _ref[1];

      var _loop = function _loop(_i) {
        var charLength = runes__default['default'](str.slice(_i))[0].length;
        cb(_i, _i + charLength, function (offsetValue) {
          /* istanbul ignore else */
          if (offsetValue != null) {
            _i += offsetValue;
          }
        });

        if (charLength && charLength > 1) {
          _i += charLength - 1;
        }

        i = _i;
      };

      for (var i = fromIdx; i < toIdx; i++) {
        _loop(i);
      }
    });
  }

  if (originalRanges && originalRanges.length) {
    // if ranges are given, invert and run callback against each character
    var temp = rangesCrop.rCrop(rangesInvert.rInvert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
      skipChecks: !!skipChecks
    }), originalStr.length);
    iterator(originalStr, temp);
  } else {
    // otherwise, run callback on everything
    iterator(originalStr, [[0, originalStr.length]]);
  }
}

exports.rProcessOutside = rProcessOutside;
exports.version = version;
