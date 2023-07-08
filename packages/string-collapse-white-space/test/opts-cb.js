import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

// opts.cb
// -----------------------------------------------------------------------------

test("01", () => {
  equal(collapse("a > b  c"), { result: "a > b c", ranges: [[5, 6]] }, "01.01");
});

test("02", () => {
  equal(
    collapse("a > b  c", {
      cb: ({ suggested, whiteSpaceStartsAt, whiteSpaceEndsAt, str }) => {
        // console.log("---------");
        // console.log(
        //   `${`\u001b[${33}m${`whiteSpaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
        //     whiteSpaceStartsAt,
        //     null,
        //     4
        //   )}`
        // );
        // console.log(
        //   `${`\u001b[${33}m${`whiteSpaceEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
        //     whiteSpaceEndsAt,
        //     null,
        //     4
        //   )}`
        // );
        // console.log(
        //   `${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        //     str,
        //     null,
        //     4
        //   )}`
        // );
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
    }),
    {
      result: "a>b c",
      ranges: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    },
    "02.01",
  );
});

test.run();
