/**
 * charcode-is-valid-xml-name-character
 * Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)
 * Version: 1.10.49
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/charcode-is-valid-xml-name-character
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rangesIsIndexWithin = _interopDefault(require('ranges-is-index-within'));

var nameStartChar = [[58, 58],
[65, 90],
[95, 95],
[192, 214],
[216, 246],
[248, 767],
[880, 893],
[895, 8191],
[8204, 8205],
[8304, 8591],
[11264, 12271],
[12289, 55295],
[63744, 64975],
[65008, 65533],
[65536, 983039]
];
var nameChar = [[45, 45],
[46, 46],
[48, 57],
[58, 58],
[65, 90],
[95, 95],
[183, 183],
[192, 214],
[216, 246],
[248, 767],
[768, 879],
[880, 893],
[895, 8191],
[8204, 8205],
[8255, 8256],
[8304, 8591],
[11264, 12271],
[12289, 55295],
[63744, 64975],
[65008, 65533],
[65536, 983039]
];
var priorityNameChar = [[97, 122]
];
var opts = {
  inclusiveRangeEnds: true,
  skipIncomingRangeSorting: true
};
function isProduction4(_char) {
  return rangesIsIndexWithin(_char.codePointAt(0), priorityNameChar, opts) || rangesIsIndexWithin(_char.codePointAt(0), nameStartChar, opts);
}
function isProduction4a(_char2) {
  return rangesIsIndexWithin(_char2.codePointAt(0), priorityNameChar, opts) || rangesIsIndexWithin(_char2.codePointAt(0), nameChar, opts);
}

exports.isProduction4 = isProduction4;
exports.isProduction4a = isProduction4a;
exports.validFirstChar = isProduction4;
exports.validSecondCharOnwards = isProduction4a;
