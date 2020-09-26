/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import splitEasy from "../dist/csv-split-easy.esm.js";

assert.deepEqual(
  splitEasy(
    'Product Name,Main Price,Discounted Price\nTestarossa (Type F110),"100,000","90,000"\nF50,"2,500,000","1,800,000"'
  ),
  [
    ["Product Name", "Main Price", "Discounted Price"],
    ["Testarossa (Type F110)", "100000", "90000"],
    ["F50", "2500000", "1800000"],
  ]
);
