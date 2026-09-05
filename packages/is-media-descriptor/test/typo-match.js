import { test } from "uvu";
import { equal } from "uvu/assert";
import { isMediaD } from "../dist/is-media-descriptor.esm.js";

test("01 - block omissions and swaps retain the descriptor diagnostic shape", () => {
  for (const input of ["scen", "sceren", "screeen"]) {
    equal(
      isMediaD(input, { offset: 7 }),
      [
        {
          idxFrom: 7,
          idxTo: input.length + 7,
          message: 'Did you mean "screen"?',
          fix: { ranges: [[7, input.length + 7, "screen"]] },
        },
      ],
      "01.01",
    );
  }
});

test("02 - short inputs need two characters for fuzzy inference", () => {
  equal(
    isMediaD("t"),
    [
      {
        idxFrom: 0,
        idxTo: 1,
        message: 'Unrecognised media type "t".',
        fix: null,
      },
    ],
    "02.01",
  );
  equal(
    isMediaD("al"),
    [
      {
        idxFrom: 0,
        idxTo: 2,
        message: 'Did you mean "all"?',
        fix: { ranges: [[0, 2, "all"]] },
      },
    ],
    "02.02",
  );
  equal(isMediaD("tv"), [], "02.03");
});

test("03 - misses preserve the existing no-fix diagnostic", () => {
  equal(
    isMediaD("screeeeeen", { offset: 5 }),
    [
      {
        idxFrom: 5,
        idxTo: 15,
        message: 'Unrecognised media type "screeeeeen".',
        fix: null,
      },
    ],
    "03.01",
  );
});

test("04 - competing candidates never receive an automatic replacement", () => {
  for (const input of ["aal", "aul", "ttv", "tt", "ty"]) {
    equal(
      isMediaD(input),
      [
        {
          idxFrom: 0,
          idxTo: input.length,
          message: `Unrecognised media type "${input}".`,
          fix: null,
        },
      ],
      "04.01",
    );
  }
});

test.run();
