/**
 * charcode-is-valid-xml-name-character
 * Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)
 * Version: 1.12.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/charcode-is-valid-xml-name-character/
 */

import { isIndexWithin } from 'ranges-is-index-within';

const nameStartChar = [[58, 58], [65, 90], [95, 95], [192, 214], [216, 246], [248, 767], [880, 893], [895, 8191], [8204, 8205], [8304, 8591], [11264, 12271], [12289, 55295], [63744, 64975], [65008, 65533], [65536, 983039]
];
const nameChar = [[45, 45], [46, 46], [48, 57], [58, 58], [65, 90], [95, 95], [183, 183], [192, 214], [216, 246], [248, 767], [768, 879], [880, 893], [895, 8191], [8204, 8205], [8255, 8256], [8304, 8591], [11264, 12271], [12289, 55295], [63744, 64975], [65008, 65533], [65536, 983039]
];
const priorityNameChar = [[97, 122]
];
const opts = {
  inclusiveRangeEnds: true,
  skipIncomingRangeSorting: true
};
function isProduction4(char) {
  return isIndexWithin(char.codePointAt(0), priorityNameChar, opts) || isIndexWithin(char.codePointAt(0), nameStartChar, opts);
}
function isProduction4a(char) {
  return isIndexWithin(char.codePointAt(0), priorityNameChar, opts) || isIndexWithin(char.codePointAt(0), nameChar, opts);
}

export { isProduction4, isProduction4a, isProduction4 as validFirstChar, isProduction4a as validSecondCharOnwards };
