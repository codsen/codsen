/**
 * ranges-offset
 * Increment or decrement each index in every range
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-offset/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _toArray = require('@babel/runtime/helpers/toArray');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _toConsumableArray__default = /*#__PURE__*/_interopDefaultLegacy(_toConsumableArray);
var _toArray__default = /*#__PURE__*/_interopDefaultLegacy(_toArray);

var version$1 = "2.0.12";

var version = version$1;
function rOffset(arrOfRanges) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (Array.isArray(arrOfRanges) && arrOfRanges.length) {
    return arrOfRanges.map(function (_ref) {
      var _ref2 = _toArray__default['default'](_ref),
          elem = _ref2.slice(0);
      if (typeof elem[0] === "number") {
        elem[0] += offset;
      }
      if (typeof elem[1] === "number") {
        elem[1] += offset;
      }
      return _toConsumableArray__default['default'](elem);
    });
  }
  return arrOfRanges;
}

exports.rOffset = rOffset;
exports.version = version;
