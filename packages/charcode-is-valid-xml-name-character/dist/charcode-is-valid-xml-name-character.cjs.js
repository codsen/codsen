/**
 * charcode-is-valid-xml-name-character
 * Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)
 * Version: 1.12.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/charcode-is-valid-xml-name-character/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rangesIsIndexWithin = require('ranges-is-index-within');

// Production 4 - except lowercase letters are missing

var nameStartChar = [[58, 58], [65, 90], [95, 95], [192, 214], [216, 246], [248, 767], [880, 893], [895, 8191], [8204, 8205], [8304, 8591], [11264, 12271], [12289, 55295], [63744, 64975], [65008, 65533], [65536, 983039] // [#x10000-#xEFFFF]
]; // https://www.w3.org/TR/REC-xml/#NT-NameChar
// Production 4a - addition to Production 4, except lowercase letters are missing

var nameChar = [[45, 45], [46, 46], [48, 57], [58, 58], [65, 90], [95, 95], [183, 183], [192, 214], [216, 246], [248, 767], [768, 879], [880, 893], [895, 8191], [8204, 8205], [8255, 8256], [8304, 8591], [11264, 12271], [12289, 55295], [63744, 64975], [65008, 65533], [65536, 983039] // [#x10000-#xEFFFF]
];
var priorityNameChar = [[97, 122] // [a-z]
];
var opts = {
  inclusiveRangeEnds: true,
  skipIncomingRangeSorting: true
}; // first checking the letters, then the rest

function isProduction4(char) {
  return rangesIsIndexWithin.isIndexWithin(char.codePointAt(0), priorityNameChar, opts) || rangesIsIndexWithin.isIndexWithin(char.codePointAt(0), nameStartChar, opts);
}

function isProduction4a(char) {
  return rangesIsIndexWithin.isIndexWithin(char.codePointAt(0), priorityNameChar, opts) || rangesIsIndexWithin.isIndexWithin(char.codePointAt(0), nameChar, opts);
}

exports.isProduction4 = isProduction4;
exports.isProduction4a = isProduction4a;
exports.validFirstChar = isProduction4;
exports.validSecondCharOnwards = isProduction4a;
