// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { defaults, splitEasy } from "../dist/csv-split-easy.esm.js";

test("01 - defaults to a comma delimiter", () => {
  equal(defaults.delimiter, ",", "01.01");
  equal(
    splitEasy("a,b\nc,d"),
    [
      ["a", "b"],
      ["c", "d"],
    ],
    "01.02",
  );
  equal(
    splitEasy("a,b\nc,d", { delimiter: "," }),
    [
      ["a", "b"],
      ["c", "d"],
    ],
    "01.03",
  );
});

test("02 - supports a custom delimiter and quoted fields", () => {
  equal(
    splitEasy(
      'name;amount;note\n"Smith, Jane";"1,000";"uses; delimiter"\nDoe;2,500;"said ""hi"""',
      { delimiter: ";" },
    ),
    [
      ["name", "amount", "note"],
      ["Smith, Jane", "1000", "uses; delimiter"],
      ["Doe", "2500", 'said "hi"'],
    ],
    "02.01",
  );
});

test("03 - does not auto-detect a different delimiter", () => {
  equal(
    splitEasy("left;right\nup;down"),
    [["left;right"], ["up;down"]],
    "03.01",
  );
  equal(
    splitEasy("left,right;up,down", { delimiter: ";" }),
    [["left,right", "up,down"]],
    "03.02",
  );
});

test("04 - accepts other single-character delimiters", () => {
  equal(
    splitEasy("a\tb\nc\td", { delimiter: "\t" }),
    [
      ["a", "b"],
      ["c", "d"],
    ],
    "04.01",
  );
  equal(
    splitEasy("\ta\tb\t", { delimiter: "\t" }),
    [["", "a", "b", ""]],
    "04.02",
  );
});

test.run();
