import tap from "tap";
import { collapse } from "../dist/string-collapse-white-space.esm";

// opts.cb
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  t.strictSame(
    collapse("a > b  c"),
    { result: "a > b c", ranges: [[5, 6]] },
    "01"
  );
  t.end();
});

tap.test(`02`, (t) => {
  t.strictSame(
    collapse(`a > b  c`, {
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
    "02"
  );
  t.end();
});
