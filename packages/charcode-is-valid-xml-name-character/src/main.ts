import { isIndexWithin } from "ranges-is-index-within";
import type { Ranges } from "../../../ops/typedefs/common";

// https://www.w3.org/TR/REC-xml/#NT-NameStartChar
// Production 4 - except lowercase letters are missing
const nameStartChar: Ranges = [
  [58, 58], // ":"
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
  [65536, 983039], // [#x10000-#xEFFFF]
];

// https://www.w3.org/TR/REC-xml/#NT-NameChar
// Production 4a - addition to Production 4, except lowercase letters are missing

const nameChar: Ranges = [
  [45, 45], // "-"
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
  [65536, 983039], // [#x10000-#xEFFFF]
];

const priorityNameChar: Ranges = [
  [97, 122], // [a-z]
];

const opts = {
  inclusiveRangeEnds: true,
  skipIncomingRangeSorting: true,
};

// first checking the letters, then the rest
function isProduction4(char: string): boolean {
  return (
    (isIndexWithin(
      char.codePointAt(0) as number,
      priorityNameChar,
      opts,
    ) as boolean) ||
    (isIndexWithin(
      char.codePointAt(0) as number,
      nameStartChar,
      opts,
    ) as boolean)
  );
}

function isProduction4a(char: string): boolean {
  return (
    (isIndexWithin(
      char.codePointAt(0) as number,
      priorityNameChar,
      opts,
    ) as boolean) ||
    (isIndexWithin(char.codePointAt(0) as number, nameChar, opts) as boolean)
  );
}

export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};
