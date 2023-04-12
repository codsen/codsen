import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm.js";

test(`01 - ${`\u001b[${32}m${"opts.progressFn"}\u001b[${39}m`} - reports progress - baseline`, () => {
  equal(
    fix(
      "text &ang text&ang text text &ang text&ang text text &ang text&ang text"
    ),
    [
      [5, 9, "&ang;"],
      [14, 18, "&ang;"],
      [29, 33, "&ang;"],
      [38, 42, "&ang;"],
      [53, 57, "&ang;"],
      [62, 66, "&ang;"],
    ],
    "01.01"
  );

  let count = 0;
  equal(
    fix(
      "text &ang text&ang text text &ang text&ang text text &ang text&ang text",
      {
        progressFn: (percentageDone) => {
          // console.log(`percentageDone = ${percentageDone}`);
          ok(typeof percentageDone === "number");
          count += 1;
        },
      }
    ),
    [
      [5, 9, "&ang;"],
      [14, 18, "&ang;"],
      [29, 33, "&ang;"],
      [38, 42, "&ang;"],
      [53, 57, "&ang;"],
      [62, 66, "&ang;"],
    ],
    "01.02"
  );
  ok(typeof count === "number" && count <= 101 && count > 0, "01.03");
});

test.run();
