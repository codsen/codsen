// Compare Strings

import { strict as assert } from "assert";
import { compare } from "../dist/ast-compare.esm.js";

assert.equal(compare("a\nb", "a\nb"), true);

assert.equal(compare("a", "b"), false);
