import { test } from "uvu";
import { equal } from "uvu/assert";

import { det } from "../dist/detergent.esm.js";

test("001 - encoded apostrophe pairs preserve processing of the following quote", () => {
  for (const convertEntities of [false, true]) {
    for (const convertApostrophes of [false, true]) {
      equal(
        det('rock &apos;n&apos;"next"', {
          removeWidows: false,
          convertEntities,
          convertApostrophes,
        }).res,
        convertApostrophes
          ? convertEntities
            ? "rock &rsquo;n&rsquo;&ldquo;next&rdquo;"
            : "rock ’n’“next”"
          : convertEntities
            ? "rock 'n'&quot;next&quot;"
            : "rock 'n'\"next\"",
        "001.01",
      );
    }
  }
});

test("002 - standalone apostrophe entities preserve the following character", () => {
  for (const convertEntities of [false, true]) {
    equal(
      det('John&apos;s "next"', {
        removeWidows: false,
        convertEntities,
      }).res,
      convertEntities ? "John&rsquo;s &ldquo;next&rdquo;" : "John’s “next”",
      "002.01",
    );
    equal(
      det('&apos;"next"', {
        removeWidows: false,
        convertEntities,
        convertApostrophes: false,
      }).res,
      convertEntities ? "'&quot;next&quot;" : '\'"next"',
      "002.02",
    );
  }
});

test.run();
