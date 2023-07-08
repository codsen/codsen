/* eslint-disable no-template-curly-in-string */
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { flattenArr } from "../dist/object-flatten-referencing.esm.js";

test("01 - util.flattenArr > empty input", () => {
  equal(flattenArr(), "", "01.01");
});

test("02 - util.flattenArr > simple array", () => {
  equal(
    flattenArr(
      ["a", "b", "c"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
      },
      true,
    ),
    "%%_a_%% %%_b_%% %%_c_%%",
    "02.01",
  );
  equal(
    flattenArr(
      ["a", "b", "c"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
      },
      false,
    ),
    "a b c",
    "02.02",
  );
});

test("03 - util.flattenArr + joinArraysUsingBrs", () => {
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: true,
      },
      true,
      false, // joinArraysUsingBrs
    ),
    "%%_a_%% %%_b,c,d_%% %%_e_%%",
    "03.01",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: true,
      },
      false,
      false, // joinArraysUsingBrs
    ),
    "a b,c,d e",
    "03.02",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: false,
      },
      true,
      false, // joinArraysUsingBrs
    ),
    "%%_a_%% %%_b,c,d_%% %%_e_%%",
    "03.03",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: false,
      },
      false,
      false, // joinArraysUsingBrs
    ),
    "a b,c,d e",
    "03.04",
  );

  // joinArraysUsingBrs = true
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: true,
      },
      true,
      true, // joinArraysUsingBrs
    ),
    "%%_a_%%<br />%%_b_%% %%_c_%% %%_d_%%<br />%%_e_%%",
    "03.05",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: true,
      },
      false,
      true, // joinArraysUsingBrs
    ),
    "a<br />b c d<br />e",
    "03.06",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: false,
      },
      true,
      true, // joinArraysUsingBrs
    ),
    "%%_a_%%%%_b_%% %%_c_%% %%_d_%%%%_e_%%",
    "03.07",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: false,
      },
      false,
      true, // joinArraysUsingBrs
    ),
    "ab c de",
    "03.08",
  );

  // HTML - no slashes
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: false,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: true,
      },
      true,
      true, // joinArraysUsingBrs
    ),
    "%%_a_%%<br>%%_b_%% %%_c_%% %%_d_%%<br>%%_e_%%",
    "03.09",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: false,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: true,
      },
      false,
      true, // joinArraysUsingBrs
    ),
    "a<br>b c d<br>e",
    "03.10",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: false,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: true,
      },
      true,
      false, // joinArraysUsingBrs
    ),
    "%%_a_%% %%_b,c,d_%% %%_e_%%",
    "03.11",
  );
  equal(
    flattenArr(
      ["a", ["b", "c", "d"], "e"],
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: [],
        xhtml: false,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: ".",
        mergeArraysWithLineBreaks: true,
      },
      false,
      false, // joinArraysUsingBrs
    ),
    "a b,c,d e",
    "03.12",
  );
});

test.run();
