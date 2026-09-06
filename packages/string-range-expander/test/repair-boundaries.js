import { test } from "uvu";
import { equal, throws } from "uvu/assert";
import { expander } from "../dist/string-range-expander.esm.js";

test("01 - crop marker runs reach either string edge", () => {
  for (const marker of [";", "😀"]) {
    for (const tail of [marker, marker.repeat(3), `${marker}  ${marker}\t`]) {
      for (const wipe of [false, true]) {
        for (const side of [false, "left", "right"]) {
          const left = `${tail}x`;
          const right = `x${Array.from(tail).reverse().join("")}`;
          equal(
            expander({
              str: left,
              from: tail.length,
              to: left.length,
              ifLeftSideIncludesThisCropItToo: marker,
              wipeAllWhitespaceOnLeft: wipe,
              extendToOneSide: side,
            }),
            side === "right" ? [tail.length, left.length] : [0, left.length],
            "01.01",
          );
          equal(
            expander({
              str: right,
              from: 0,
              to: 1,
              ifRightSideIncludesThisCropItToo: marker,
              wipeAllWhitespaceOnRight: wipe,
              extendToOneSide: side,
            }),
            side === "left" ? [0, 1] : [0, right.length],
            "01.02",
          );
        }
      }
    }
  }
});

test("02 - ordinary whitespace at the outer edge retains its separator", () => {
  for (const marker of [";", "😀"]) {
    const left = ` ${marker} x`;
    const right = `x ${marker} `;
    for (const wipe of [false, true]) {
      equal(
        expander({
          str: left,
          from: left.length - 1,
          to: left.length,
          ifLeftSideIncludesThisCropItToo: marker,
          wipeAllWhitespaceOnLeft: wipe,
        }),
        [wipe ? 0 : 1, left.length],
        "02.01",
      );
      equal(
        expander({
          str: right,
          from: 0,
          to: 1,
          ifRightSideIncludesThisCropItToo: marker,
          wipeAllWhitespaceOnRight: wipe,
        }),
        [0, wipe ? right.length : right.length - 1],
        "02.02",
      );
    }
  }
});

test("03 - tight markers cannot reach across retained solid text", () => {
  for (const marker of [">", "😀"]) {
    for (const concatenation of [false, true]) {
      for (const side of [false, "left", "right"]) {
        const left = `${marker}ax b`;
        const leftFrom = marker.length + 1;
        const right = `a xb${marker}`;
        equal(
          expander({
            str: left,
            from: leftFrom,
            to: leftFrom + 1,
            ifLeftSideIncludesThisThenCropTightly: marker,
            extendToOneSide: side,
            addSingleSpaceToPreventAccidentalConcatenation: concatenation,
          }),
          [leftFrom, leftFrom + 1],
          "03.01",
        );
        equal(
          expander({
            str: right,
            from: 2,
            to: 3,
            ifRightSideIncludesThisThenCropTightly: marker,
            extendToOneSide: side,
            addSingleSpaceToPreventAccidentalConcatenation: concatenation,
          }),
          [2, 3],
          "03.02",
        );
      }
    }
  }
});

test("04 - valid tight markers still tighten both enabled sides", () => {
  for (const marker of [">", "😀"]) {
    for (const gap of ["", " "]) {
      for (const side of [false, "left", "right"]) {
        const left = `${marker}${gap}x b`;
        const from = marker.length + gap.length;
        equal(
          expander({
            str: left,
            from,
            to: from + 1,
            ifLeftSideIncludesThisThenCropTightly: marker,
            extendToOneSide: side,
          }),
          side === "right"
            ? [from, from + 1]
            : [marker.length, from + (side === "left" ? 1 : 2)],
          "04.01",
        );
        const right = `a x${gap}${marker}`;
        equal(
          expander({
            str: right,
            from: 2,
            to: 3,
            ifRightSideIncludesThisThenCropTightly: marker,
            extendToOneSide: side,
          }),
          side === "left" ? [2, 3] : [side === "right" ? 2 : 1, 3 + gap.length],
          "04.02",
        );
      }
    }
  }
});

test("05 - empty ranges inside words and at edges stay empty", () => {
  for (const str of ["", "ab", "é你", "١१", "𐐀𐐁"]) {
    for (let index = 0; index <= str.length; index++) {
      equal(
        expander({
          str,
          from: index,
          to: index,
          addSingleSpaceToPreventAccidentalConcatenation: true,
        }),
        [index, index],
        "05.01",
      );
    }
  }
  equal(
    expander({
      str: "a;b",
      from: 1,
      to: 2,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [1, 2, " "],
    "05.02",
  );
});

test("06 - initially empty ranges may expand into separator replacements", () => {
  equal(
    expander({
      str: "a  b",
      from: 2,
      to: 2,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [1, 3, " "],
    "06.01",
  );
  equal(
    expander({
      str: "a;b",
      from: 1,
      to: 1,
      ifRightSideIncludesThisCropItToo: ";",
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [1, 2, " "],
    "06.02",
  );
  equal(
    expander({
      str: ";x",
      from: 1,
      to: 1,
      ifLeftSideIncludesThisCropItToo: ";",
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [0, 1],
    "06.03",
  );
});

test("07 - invalid side values retain the package validation diagnostic", () => {
  for (const value of [
    Symbol("left"),
    Object.create(null),
    "both",
    true,
    null,
    {
      [Symbol.toPrimitive]() {
        throw new Error("caller conversion");
      },
    },
    {
      toString() {
        throw new Error("caller conversion");
      },
    },
  ]) {
    throws(
      () => expander({ str: "abc", from: 1, to: 2, extendToOneSide: value }),
      /^string-range-expander\/expander\(\): \[THROW_ID_09\]/,
    );
  }
  for (const side of [false, "left", "right"]) {
    equal(
      expander({ str: "abc", from: 1, to: 2, extendToOneSide: side }),
      [1, 2],
      "07.01",
    );
  }
});

test.run();
