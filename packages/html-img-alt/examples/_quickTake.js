// Quick Take

import { strict as assert } from "assert";
import { alts } from "../dist/html-img-alt.esm.js";

// string-in, string-out:
assert.equal(
  alts('zzz<img src="spacer.gif" >zzz'),
  'zzz<img src="spacer.gif" alt="" >zzz'
);
