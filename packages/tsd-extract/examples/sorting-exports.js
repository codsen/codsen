// Sorting exports

import { strict as assert } from "assert";
import { extract, roysSort } from "../dist/tsd-extract.esm.js";

// Often, in .d.ts files, the main function is not the first in the list:
const dtsSource = `
export { Attribute, CbObj, Opts, Res, Tag, defaults, stripHtml, version };
`;

// If you try to extract a function,
const { content: content1 } = extract(dtsSource, "export");
//                    ^
//                 that's ES6 destructuring assignment + renaming

// The "content" will come as-is:
assert.equal(
  content1,
  "{ Attribute, CbObj, Opts, Res, Tag, defaults, stripHtml, version };"
);

// -----------------------------------------------------------------------------

// But, you can sort it using Roy's Favourite Sort Function™
const { content: content2 } = extract(dtsSource, "export", {
  contentSort: roysSort,
});

assert.equal(
  content2,
  "{ stripHtml, defaults, version, Attribute, CbObj, Opts, Res, Tag };"
);
// The lower case export go first, then uppercase;
// also, "defaults" and "version" go last (among lower-case ones)
// we use this very function on codsen.com/os/* readmes

// -----------------------------------------------------------------------------

// Alternatively, you can supply your own sort function, it's the
// Array.prototype.sort() under the hood, see:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#examples
// also, see the roysSort() source for reference:
// https://github.com/codsen/codsen/blob/main/packages/tsd-extract/src/util.ts

function myCustomSort(a, b) {
  if (a.toLowerCase() < b.toLowerCase()) {
    // sort b after a
    return -1;
  }
  if (a.toLowerCase() > b.toLowerCase()) {
    // sort a after b
    return 1;
  }
  // keep the existing order
  return 0;
}
const { content: content3 } = extract(dtsSource, "export", {
  contentSort: myCustomSort,
});

assert.equal(
  content3,
  "{ Attribute, CbObj, defaults, Opts, Res, stripHtml, Tag, version };"
);
