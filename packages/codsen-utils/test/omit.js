import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { omit } from "../dist/codsen-utils.esm.js";

test("01 - empty plain object", () => {
  equal(omit(undefined, ["a", "c"]), undefined, "01.01");
  equal(omit(null, ["a", "c"]), null, "01.02");
  equal(omit({}, ["a", "c"]), {}, "01.03");
});

test("02 - throws truthy input is not a plain object", () => {
  throws(
    () => {
      omit([], ["zzz"]);
    },
    /THROW_ID_01/,
    "02.01"
  );
});

test("03", () => {
  let input = {
    a: 1,
    b: "c",
  };
  equal(
    omit(input, ["a", "c"]),
    {
      b: "c",
    },
    "03.01"
  );

  // didn't mutate:
  equal(
    input,
    {
      a: 1,
      b: "c",
    },
    "03.02"
  );
});

test.run();
