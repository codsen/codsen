// Minify a chunk of CSS selector

import { strict as assert } from "assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("div > span", {
    cb: ({ suggested, whiteSpaceStartsAt, whiteSpaceEndsAt, str }) => {
      if (str[whiteSpaceStartsAt - 1] === ">") {
        // console.log(`> on the left! - wipe this whitespace`);
        return [whiteSpaceStartsAt, whiteSpaceEndsAt];
      }
      if (str[whiteSpaceEndsAt] === ">") {
        // console.log(`> on the right! - wipe this whitespace`);
        return [whiteSpaceStartsAt, whiteSpaceEndsAt];
      }
      return suggested;
    },
  }).result,
  "div>span"
);
