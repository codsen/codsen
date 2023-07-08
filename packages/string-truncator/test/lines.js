import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { truncate } from "../dist/string-truncator.esm.js";
// import { mixer } from "./util/util.js";

// opts.maxLines setting
// -----------------------------------------------------------------------------

test("01", () => {
  equal(
    truncate(
      "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
      {
        maxLen: 10,
        maxLines: 1,
        ellipsisLen: 155,
      },
    ),
    {
      result: "the quick brown",
      addEllipsis: true,
    },
    "01.01",
  );
});

test("02", () => {
  equal(
    truncate(
      "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
      {
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      },
    ),
    {
      result: "the quick brown fox jumps over",
      addEllipsis: true,
    },
    "02.01",
  );
});

test("03", () => {
  equal(
    truncate(
      "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
      {
        maxLen: 10,
        maxLines: 3,
        ellipsisLen: 155,
      },
    ),
    {
      result: "the quick brown fox jumps over the lazy dog an",
      addEllipsis: true,
    },
    "03.01",
  );
});

test("04", () => {
  equal(
    truncate(
      "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
      {
        maxLen: 10,
        maxLines: 4,
        ellipsisLen: 155,
      },
    ),
    {
      result: "the quick brown fox jumps over the lazy dog and then bites",
      addEllipsis: true,
    },
    "04.01",
  );
});

test("05", () => {
  equal(
    truncate(
      "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
      {
        maxLen: 10,
        maxLines: 5,
        ellipsisLen: 155,
      },
    ),
    {
      result:
        "the quick brown fox jumps over the lazy dog and then bites him in the tail",
      addEllipsis: true,
    },
    "05.01",
  );
});

test("06", () => {
  equal(
    truncate(
      "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
      {
        maxLen: 10,
        maxLines: 6,
        ellipsisLen: 155,
      },
    ),
    {
      result:
        "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
      addEllipsis: false,
    },
    "06.01",
  );
});

test.run();
