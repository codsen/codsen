/**
 * charcode-is-valid-xml-name-character
 * Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)
 * Version: 1.10.55
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/charcode-is-valid-xml-name-character
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.charcodeIsValidXmlNameCharacter = {}));
}(this, (function (exports) { 'use strict';

  /**
   * ranges-is-index-within
   * Efficiently checks if index is within any of the given ranges
   * Version: 1.14.32
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
   */
  const isArr = Array.isArray;

  function rangesIsIndexWithin(originalIndex, rangesArr, originalOpts) {
    const defaults = {
      inclusiveRangeEnds: false,
      returnMatchedRangeInsteadOfTrue: false
    };
    const opts = Object.assign(Object.assign({}, defaults), originalOpts);

    if (!isArr(rangesArr)) {
      return false;
    }

    if (opts.returnMatchedRangeInsteadOfTrue) {
      return rangesArr.find(arr => opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1]) || false;
    }

    return rangesArr.some(arr => opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1]);
  }

  // Production 4 - except lowercase letters are missing

  var nameStartChar = [[58, 58], // ":"
  [65, 90], // [A-Z]
  [95, 95], // "_"
  [192, 214], // [#xC0-#xD6]
  [216, 246], // [#xD8-#xF6]
  [248, 767], // [#xF8-#x2FF]
  [880, 893], // [#x370-#x37D]
  [895, 8191], // [#x37F-#x1FFF]
  [8204, 8205], // [#x200C-#x200D]
  [8304, 8591], // [#x2070-#x218F]
  [11264, 12271], // [#x2C00-#x2FEF]
  [12289, 55295], // [#x3001-#xD7FF]
  [63744, 64975], // [#xF900-#xFDCF]
  [65008, 65533], // [#xFDF0-#xFFFD]
  [65536, 983039] // [#x10000-#xEFFFF]
  ]; // https://www.w3.org/TR/REC-xml/#NT-NameChar
  // Production 4a - addition to Production 4, except lowercase letters are missing

  var nameChar = [[45, 45], // "-"
  [46, 46], // "."
  [48, 57], // [0-9]
  [58, 58], // ":"
  [65, 90], // [A-Z]
  [95, 95], // "_"
  [183, 183], // #xB7
  [192, 214], // [#xC0-#xD6]
  [216, 246], // [#xD8-#xF6]
  [248, 767], // [#xF8-#x2FF]
  [768, 879], // [#x0300-#x036F]
  [880, 893], // [#x370-#x37D]
  [895, 8191], // [#x37F-#x1FFF]
  [8204, 8205], // [#x200C-#x200D]
  [8255, 8256], // [#x203F-#x2040]
  [8304, 8591], // [#x2070-#x218F]
  [11264, 12271], // [#x2C00-#x2FEF]
  [12289, 55295], // [#x3001-#xD7FF]
  [63744, 64975], // [#xF900-#xFDCF]
  [65008, 65533], // [#xFDF0-#xFFFD]
  [65536, 983039] // [#x10000-#xEFFFF]
  ];
  var priorityNameChar = [[97, 122] // [a-z]
  ];
  var opts = {
    inclusiveRangeEnds: true,
    skipIncomingRangeSorting: true
  }; // first checking the letters, then the rest

  function isProduction4(char) {
    return rangesIsIndexWithin(char.codePointAt(0), priorityNameChar, opts) || rangesIsIndexWithin(char.codePointAt(0), nameStartChar, opts);
  }

  function isProduction4a(char) {
    return rangesIsIndexWithin(char.codePointAt(0), priorityNameChar, opts) || rangesIsIndexWithin(char.codePointAt(0), nameChar, opts);
  }

  exports.isProduction4 = isProduction4;
  exports.isProduction4a = isProduction4a;
  exports.validFirstChar = isProduction4;
  exports.validSecondCharOnwards = isProduction4a;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
