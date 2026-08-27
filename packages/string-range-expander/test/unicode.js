import { test } from "uvu";
import { equal } from "uvu/assert";

import { expander } from "../dist/string-range-expander.esm.js";

function applyRange(str, range) {
  return `${str.slice(0, range[0])}${range[2] ?? ""}${str.slice(range[1])}`;
}

function hasUnpairedSurrogate(str) {
  for (let i = 0; i < str.length; i++) {
    const current = str.charCodeAt(i);
    if (current >= 0xd800 && current <= 0xdbff) {
      const next = str.charCodeAt(i + 1);
      if (next < 0xdc00 || next > 0xdfff) {
        return true;
      }
      i += 1;
    } else if (current >= 0xdc00 && current <= 0xdfff) {
      return true;
    }
  }
  return false;
}

test("01 - right marker matching compares whole Unicode code points", () => {
  const str = "a😁x";
  const range = expander({
    str,
    from: 0,
    to: 1,
    ifRightSideIncludesThisCropItToo: "😀",
  });
  const result = applyRange(str, range);

  equal(range, [0, 1], "01.01");
  equal(result, "😁x", "01.02");
  equal(hasUnpairedSurrogate(result), false, "01.03");
});

test("02 - left marker matching compares whole Unicode code points", () => {
  const neighboringCodePoint = String.fromCodePoint(0x1fa00);
  const str = `x${neighboringCodePoint}a`;
  const range = expander({
    str,
    from: 3,
    to: 4,
    ifLeftSideIncludesThisCropItToo: "😀",
  });
  const result = applyRange(str, range);

  equal(range, [3, 4], "02.01");
  equal(result, `x${neighboringCodePoint}`, "02.02");
  equal(hasUnpairedSurrogate(result), false, "02.03");
});

test("03 - a matching astral marker is cropped as one code point", () => {
  equal(
    expander({
      str: "a😀x",
      from: 0,
      to: 1,
      ifRightSideIncludesThisCropItToo: "😀",
    }),
    [0, 3],
    "03.01",
  );
  equal(
    expander({
      str: "x😀a",
      from: 3,
      to: 4,
      ifLeftSideIncludesThisCropItToo: "😀",
    }),
    [1, 4],
    "03.02",
  );
});

test.run();
