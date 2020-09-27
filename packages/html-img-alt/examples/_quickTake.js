/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import alt from "../dist/html-img-alt.esm";

// string-in, string-out:
assert.equal(
  alt('zzz<img src="spacer.gif" >zzz'),
  'zzz<img src="spacer.gif" alt="" >zzz'
);
