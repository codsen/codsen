/**
 * @name ranges-process-outside
 * @fileoverview Iterate string considering ranges, as if they were already applied
 * @version 4.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-process-outside/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var _typeof = require('@babel/runtime/helpers/typeof');
var runes = require('runes');
var rangesInvert = require('ranges-invert');
var rangesCrop = require('ranges-crop');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var runes__default = /*#__PURE__*/_interopDefaultLegacy(runes);

var version$1 = "4.0.16";

var version = version$1;
function rProcessOutside(originalStr, originalRanges, cb) {
  var skipChecks = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (typeof originalStr !== "string") {
    if (originalStr === undefined) {
      throw new Error("ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!");
    } else {
      throw new Error("ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n".concat(JSON.stringify(originalStr, null, 4), " (type ").concat(_typeof__default['default'](originalStr), ")"));
    }
  }
  if (originalRanges && (!Array.isArray(originalRanges) || originalRanges.length && !Array.isArray(originalRanges[0]))) {
    throw new Error("ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n".concat(JSON.stringify(originalRanges, null, 4), " (type ").concat(_typeof__default['default'](originalRanges), ")"));
  }
  if (typeof cb !== "function") {
    throw new Error("ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n".concat(JSON.stringify(cb, null, 4), " (type ").concat(_typeof__default['default'](cb), ")"));
  }
  function iterator(str, arrOfArrays) {
    (arrOfArrays || []).forEach(function (_ref) {
      var _ref2 = _slicedToArray__default['default'](_ref, 2),
          fromIdx = _ref2[0],
          toIdx = _ref2[1];
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
    var temp = rangesCrop.rCrop(rangesInvert.rInvert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
      skipChecks: !!skipChecks
    }), originalStr.length);
    iterator(originalStr, temp);
  } else {
    iterator(originalStr, [[0, originalStr.length]]);
  }
}

exports.rProcessOutside = rProcessOutside;
exports.version = version;
