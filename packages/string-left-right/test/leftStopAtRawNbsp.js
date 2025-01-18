import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { leftStopAtRawNbsp } from "../dist/string-left-right.esm.js";

const RAWNBSP = "\u00A0";

// leftStopAtRawNbsp()
// -----------------------------------------------------------------------------

test("01 - null result cases", () => {
  equal(leftStopAtRawNbsp("abc"), null, "01.01");
  equal(leftStopAtRawNbsp("abc", -1), null, "01.02");
  equal(leftStopAtRawNbsp("abc", 0), null, "01.03");
  equal(leftStopAtRawNbsp("abc", null), null, "01.04");
  equal(leftStopAtRawNbsp("abc", 4), 2, "01.05");
  equal(leftStopAtRawNbsp("abc", 9), 2, "01.06");
  equal(leftStopAtRawNbsp(""), null, "01.07");
  equal(leftStopAtRawNbsp("", 0), null, "01.08");
  equal(leftStopAtRawNbsp("", null), null, "01.09");
  equal(leftStopAtRawNbsp("", undefined), null, "01.10");
  equal(leftStopAtRawNbsp("", 1), null, "01.11");
});

test("02 - normal use", () => {
  not.ok(!!leftStopAtRawNbsp(""), "02.01");
  not.ok(!!leftStopAtRawNbsp("a"), "02.02");
  equal(leftStopAtRawNbsp("ab", 1), 0, "02.01");
  equal(leftStopAtRawNbsp("a b", 2), 0, "02.02");
  equal(leftStopAtRawNbsp("a\t b", 2), 0, "02.03");

  equal(leftStopAtRawNbsp("a \n\n\nb", 5), 0, "02.04");
  equal(leftStopAtRawNbsp("a \n\n\n b", 6), 0, "02.05");
  equal(leftStopAtRawNbsp("a \r\r\r b", 6), 0, "02.06");
  equal(leftStopAtRawNbsp("a\n\rb", 3), 0, "02.07");
  equal(leftStopAtRawNbsp("a\n\r b", 4), 0, "02.08");

  equal(leftStopAtRawNbsp("\n\n\n\n", 4), null, "02.09");
  equal(leftStopAtRawNbsp("\n\n\n\n", 3), null, "02.10");
  equal(leftStopAtRawNbsp("\n\n\n\n", 2), null, "02.11");
  equal(leftStopAtRawNbsp("\n\n\n\n", 1), null, "02.12");
  equal(leftStopAtRawNbsp("\n\n\n\n", 0), null, "02.13");

  equal(leftStopAtRawNbsp(`${RAWNBSP}`, 0), null, "02.14");
  equal(leftStopAtRawNbsp(`${RAWNBSP}`, 1), 0, "02.15");
  equal(leftStopAtRawNbsp(`${RAWNBSP}`, 2), 0, "02.16");

  equal(leftStopAtRawNbsp(`a ${RAWNBSP}b`, 3), 2, "02.17");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} b`, 3), 2, "02.18");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} b`, 4), 2, "02.19");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}\tb`, 4), 2, "02.20");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}\rb`, 4), 2, "02.21");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}\nb`, 4), 2, "02.22");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}\r\nb`, 4), 2, "02.23");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}\r\nb`, 5), 2, "02.24");

  equal(leftStopAtRawNbsp(`a ${RAWNBSP} \tb`, 5), 2, "02.25");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} \rb`, 5), 2, "02.26");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} \nb`, 5), 2, "02.27");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 6), 2, "02.28");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} \t b`, 6), 2, "02.29");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} \r b`, 6), 2, "02.30");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} \n b`, 6), 2, "02.31");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP} \r\n b`, 7), 2, "02.32");

  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \tb`, 4), 2, "02.33");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \tb`, 5), 2, "02.34");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \tb`, 6), 2, "02.35");

  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \rb`, 4), 2, "02.36");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \rb`, 5), 2, "02.37");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \rb`, 6), 2, "02.38");

  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \nb`, 6), 2, "02.39");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \r\nb`, 7), 2, "02.40");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \t b`, 7), 2, "02.41");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \r b`, 7), 2, "02.42");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \n b`, 7), 2, "02.43");
  equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \r\n b`, 8), 2, "02.44");

  equal(leftStopAtRawNbsp(`${RAWNBSP}${RAWNBSP}`, 1), 0, "02.45");
  equal(leftStopAtRawNbsp(`${RAWNBSP} ${RAWNBSP}`, 2), 0, "02.46");
  equal(leftStopAtRawNbsp(`${RAWNBSP}\t${RAWNBSP}`, 2), 0, "02.47");
  equal(leftStopAtRawNbsp(`${RAWNBSP}\t\n\r${RAWNBSP}`, 4), 0, "02.48");
});

test.run();
