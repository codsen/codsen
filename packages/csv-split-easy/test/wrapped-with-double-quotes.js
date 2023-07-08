import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

test("01 - breaks lines correctly leaving no empty lines", () => {
  equal(
    splitEasy('"a,b",c,d\ne,f,g'),
    [
      ["a,b", "c", "d"],
      ["e", "f", "g"],
    ],
    "01.01",
  );
  equal(
    splitEasy(
      '"apples, and some other fruits",bananas,cherries\ndonuts,eclairs,froyos',
    ),
    [
      ["apples, and some other fruits", "bananas", "cherries"],
      ["donuts", "eclairs", "froyos"],
    ],
    "01.02",
  );
});

test("02 - particular attention of combos of line breaks and double quotes", () => {
  equal(
    splitEasy('"a,b",c,d\n"e,f",g,h'),
    [
      ["a,b", "c", "d"],
      ["e,f", "g", "h"],
    ],
    "02.01",
  );
});

test("03 - particular attention of double quotes at the end", () => {
  equal(
    splitEasy('"a,b",c,d\n\re,f,"g,h"'),
    [
      ["a,b", "c", "d"],
      ["e", "f", "g,h"],
    ],
    "03.01",
  );
});

test("04 - all values are wrapped with double quotes, some trailing white space", () => {
  equal(
    splitEasy(
      '"Something here","And something there"," Notice space in front"\n"And here","This is wrapped as well","And this too"',
    ),
    [
      ["Something here", "And something there", "Notice space in front"],
      ["And here", "This is wrapped as well", "And this too"],
    ],
    "04.01",
  );
});

test("05 - values wrapped in double quotes that contain double quotes", () => {
  equal(
    splitEasy('"a,""b""",c,d\ne,f,"g ""G"""'),
    [
      ['a,"b"', "c", "d"],
      ["e", "f", 'g "G"'],
    ],
    "05.01",
  );
});

test.run();
