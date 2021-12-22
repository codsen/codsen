/* eslint-disable no-unused-vars */
// Quick Take

import { strict as assert } from "assert";

import {
  left,
  right,
  leftSeq,
  rightSeq,
  chompLeft,
  chompRight,
  leftStopAtNewLines,
  rightStopAtNewLines,
} from "../dist/string-left-right.esm.js";

// get the closest non-whitespace character to the left of "d" (which itself
// is at string index 6)
const str = "abc   def";
//             |   |
//           012345678

assert.equal(
  `next non-whitespace character to the left of ${str[6]} (index 6) is ${
    str[left(str, 6)]
  } (index ${left(str, 6)})`,
  "next non-whitespace character to the left of d (index 6) is c (index 2)"
);
