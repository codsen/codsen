import tap from "tap";
import { within } from "../dist/email-all-chars-within-ascii.esm.js";

tap.test("01 - default, line length exceeded", (t) => {
  t.sameStrict(
    within(
      `yyy\nzzz\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
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
    "01"
  );
  t.end();
});

tap.test("02 - customising the length", (t) => {
  t.sameStrict(
    within(`abcde`, {
      lineLength: 0,
    }),
    [],
    "02.01"
  );
  t.sameStrict(
    within(`abcde`, {
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
    "02.02"
  );
  t.sameStrict(
    within(`abcde`, {
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
    "02.03"
  );
  t.sameStrict(
    within(`abcde`, {
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
    "02.04"
  );
  t.sameStrict(
    within(`abcde`, {
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
    "02.05"
  );
  t.sameStrict(
    within(`abcde`, {
      lineLength: 5,
    }),
    [],
    "02.06"
  );
  t.sameStrict(
    within(`abcde`, {
      lineLength: 6,
    }),
    [],
    "02.07"
  );
  t.sameStrict(
    within(`abcde`, {
      lineLength: 99,
    }),
    [],
    "02.08"
  );
  t.end();
});

tap.test("03 - multiline, wrong", (t) => {
  t.sameStrict(
    within(`abcde\nfghij\nklmno\n`, {
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
    "03"
  );
  t.end();
});
