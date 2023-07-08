import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { within } from "../dist/email-all-chars-within-ascii.esm.js";

test("01 - default, line length exceeded", () => {
  equal(
    within(
      "yyy\nzzz\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ),
    [
      {
        type: "line length",
        line: 3,
        column: 1000,
        positionIdx: 1008,
        value: 1000,
      },
    ],
    "01.01",
  );
});

test("02 - customising the length", () => {
  equal(
    within("abcde", {
      lineLength: 0,
    }),
    [],
    "02.01",
  );
  equal(
    within("abcde", {
      lineLength: 1,
    }),
    [
      {
        type: "line length",
        line: 1,
        column: 5,
        positionIdx: 5,
        value: 5,
      },
    ],
    "02.02",
  );
  equal(
    within("abcde", {
      lineLength: 2,
    }),
    [
      {
        type: "line length",
        line: 1,
        column: 5,
        positionIdx: 5,
        value: 5,
      },
    ],
    "02.03",
  );
  equal(
    within("abcde", {
      lineLength: 3,
    }),
    [
      {
        type: "line length",
        line: 1,
        column: 5,
        positionIdx: 5,
        value: 5,
      },
    ],
    "02.04",
  );
  equal(
    within("abcde", {
      lineLength: 4,
    }),
    [
      {
        type: "line length",
        line: 1,
        column: 5,
        positionIdx: 5,
        value: 5,
      },
    ],
    "02.05",
  );
  equal(
    within("abcde", {
      lineLength: 5,
    }),
    [],
    "02.06",
  );
  equal(
    within("abcde", {
      lineLength: 6,
    }),
    [],
    "02.07",
  );
  equal(
    within("abcde", {
      lineLength: 99,
    }),
    [],
    "02.08",
  );
});

test("03 - multiline, wrong", () => {
  equal(
    within("abcde\nfghij\nklmno\n", {
      lineLength: 2,
    }),
    [
      {
        type: "line length",
        line: 1,
        column: 5,
        positionIdx: 5,
        value: 5,
      },
      {
        type: "line length",
        line: 2,
        column: 5,
        positionIdx: 11,
        value: 5,
      },
      {
        type: "line length",
        line: 3,
        column: 5,
        positionIdx: 17,
        value: 5,
      },
    ],
    "03.01",
  );
});

test.run();
