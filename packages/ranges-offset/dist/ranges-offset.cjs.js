/**
 * ranges-offset
 * Increment or decrement each index in every range
 * Version: 1.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-offset/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version = "1.0.3";

function rOffset(arrOfRanges, offset) {
  if (offset === void 0) {
    offset = 0;
  }

  // empty Ranges are null!
  if (Array.isArray(arrOfRanges) && arrOfRanges.length) {
    return arrOfRanges.map(function (_ref) {
      var elem = _ref.slice(0);

      if (typeof elem[0] === "number") {
        elem[0] += offset;
      }

      if (typeof elem[1] === "number") {
        elem[1] += offset;
      }

      return [].concat(elem);
    });
  }

  return arrOfRanges;
}

exports.rOffset = rOffset;
exports.version = version;
