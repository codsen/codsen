/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import expander from "../dist/string-range-expander.esm.js";

// let's say we have picked the "zzzz" index range - [16, 20]
// "something>\n\t    zzzz <here"
//                    |   |
//                  from  to
//
// PS. "\n" and "\t" take up a single character's length

assert.deepEqual(
  expander({
    str: "something>\n\t    zzzz <here",
    from: 16,
    to: 20,
    ifRightSideIncludesThisThenCropTightly: "<",
  }),
  [10, 21]
);
