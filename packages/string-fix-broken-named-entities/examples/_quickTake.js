/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import fixEnt from "../dist/string-fix-broken-named-entities.esm.js";
import applyR from "../../ranges-apply";

const source = "&nsp;x&nsp;y&nsp;";

// returns Ranges notation, see codsen.com/ranges/
assert.deepEqual(fixEnt(source), [
  [0, 5, "&nbsp;"],
  [6, 11, "&nbsp;"],
  [12, 17, "&nbsp;"],
]);

// render result from ranges using "ranges-apply":
assert.equal(applyR(source, fixEnt(source)), "&nbsp;x&nbsp;y&nbsp;");
