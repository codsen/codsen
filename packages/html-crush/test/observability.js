import { test } from "uvu";
import { equal } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";

test("01 - reports elapsed time from both completion paths", () => {
  const originalNow = Date.now;
  const readings = [1_000, 1_019, 2_000, 2_023];
  Date.now = () => readings.shift();
  try {
    equal(crush("<p>  text  </p>").log.timeTakenInMilliseconds, 19, "01.01");
    equal(crush("").log.timeTakenInMilliseconds, 23, "01.02");
  } finally {
    Date.now = originalNow;
  }
});

test("02 - reports code-unit and UTF-8 byte sizes explicitly", () => {
  for (const [input, expected] of [
    [
      "<p><!--x-->a</p>",
      {
        originalLength: 16,
        cleanedLength: 8,
        bytesSaved: 8,
        percentageReducedOfOriginal: 50,
        originalLengthInCodeUnits: 16,
        cleanedLengthInCodeUnits: 8,
        codeUnitsSaved: 8,
        percentageReducedOfOriginalInCodeUnits: 50,
        originalLengthInUtf8Bytes: 16,
        cleanedLengthInUtf8Bytes: 8,
        utf8BytesSaved: 8,
        percentageReducedOfOriginalInUtf8Bytes: 50,
      },
    ],
    [
      "<p><!--é-->a</p>",
      {
        originalLength: 16,
        cleanedLength: 8,
        bytesSaved: 8,
        percentageReducedOfOriginal: 50,
        originalLengthInCodeUnits: 16,
        cleanedLengthInCodeUnits: 8,
        codeUnitsSaved: 8,
        percentageReducedOfOriginalInCodeUnits: 50,
        originalLengthInUtf8Bytes: 17,
        cleanedLengthInUtf8Bytes: 8,
        utf8BytesSaved: 9,
        percentageReducedOfOriginalInUtf8Bytes: 53,
      },
    ],
    [
      "<p><!--😀-->a</p>",
      {
        originalLength: 17,
        cleanedLength: 8,
        bytesSaved: 9,
        percentageReducedOfOriginal: 53,
        originalLengthInCodeUnits: 17,
        cleanedLengthInCodeUnits: 8,
        codeUnitsSaved: 9,
        percentageReducedOfOriginalInCodeUnits: 53,
        originalLengthInUtf8Bytes: 19,
        cleanedLengthInUtf8Bytes: 8,
        utf8BytesSaved: 11,
        percentageReducedOfOriginalInUtf8Bytes: 58,
      },
    ],
    [
      "<p><!--e\u0301-->a</p>",
      {
        originalLength: 17,
        cleanedLength: 8,
        bytesSaved: 9,
        percentageReducedOfOriginal: 53,
        originalLengthInCodeUnits: 17,
        cleanedLengthInCodeUnits: 8,
        codeUnitsSaved: 9,
        percentageReducedOfOriginalInCodeUnits: 53,
        originalLengthInUtf8Bytes: 18,
        cleanedLengthInUtf8Bytes: 8,
        utf8BytesSaved: 10,
        percentageReducedOfOriginalInUtf8Bytes: 56,
      },
    ],
    [
      "<p>é😀e\u0301</p>",
      {
        originalLength: 12,
        cleanedLength: 12,
        bytesSaved: 0,
        percentageReducedOfOriginal: 0,
        originalLengthInCodeUnits: 12,
        cleanedLengthInCodeUnits: 12,
        codeUnitsSaved: 0,
        percentageReducedOfOriginalInCodeUnits: 0,
        originalLengthInUtf8Bytes: 16,
        cleanedLengthInUtf8Bytes: 16,
        utf8BytesSaved: 0,
        percentageReducedOfOriginalInUtf8Bytes: 0,
      },
    ],
  ]) {
    const { timeTakenInMilliseconds, ...sizes } = crush(input, {
      removeHTMLComments: true,
    }).log;
    equal(sizes, expected, "02.01");
    equal(typeof timeTakenInMilliseconds, "number", "02.02");
  }
});

test.run();
