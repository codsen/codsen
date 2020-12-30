// Quick Take

import { strict as assert } from "assert";
import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

// 🇬🇧 🇺🇸 thousand separators:
assert.equal(remSep("1,000,000.00"), "1000000.00");

// 🇷🇺  thousand separators:
assert.equal(remSep("1 000 000,00"), "1000000,00");
// (if you want it converted to Western notation with dot,
// set opts.forceUKStyle = true

// 🇨🇭 thousand separators:
assert.equal(remSep("1'000'000.00"), "1000000.00");

// IT'S SMART TOO:

// will not delete if the thousand separators are mixed:
const input = "100,000,000.000";
assert.equal(remSep(input), input);
// ^ does nothing

// but will remove empty space, even if there is no decimal separator:
// (that's to cope with Russian notation integers that use thousand separators)
assert.equal(remSep("100 000 000 000"), "100000000000");

// while removing thousand separators, it will also pad the digits to two decimal places
// (optional, on by default, to turn it off set opts.padSingleDecimalPlaceNumbers to `false`):
assert.equal(remSep("100,000.2"), "100000.20");
console.log();
// ^ Western notation

assert.equal(remSep("100 000,2"), "100000,20");
// ^ Russian notation

assert.equal(remSep("100'000.2"), "100000.20");
// ^ Swiss notation
