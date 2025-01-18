import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rightStopAtRawNbsp } from "../dist/string-left-right.esm.js";

const RAWNBSP = "\u00A0";

// rightStopAtRawNbsp()
// -----------------------------------------------------------------------------

test("01 - calling at string length", () => {
  equal(rightStopAtRawNbsp(""), null, "01.01");
  equal(rightStopAtRawNbsp("", null), null, "01.02");
  equal(rightStopAtRawNbsp("", undefined), null, "01.03");
  equal(rightStopAtRawNbsp("", 0), null, "01.04");
  equal(rightStopAtRawNbsp("", 1), null, "01.05");
  equal(rightStopAtRawNbsp("", 99), null, "01.06");
  equal(rightStopAtRawNbsp("abc", 3), null, "01.07");
  equal(rightStopAtRawNbsp("abc", 99), null, "01.08");
});

test("02 - normal use", () => {
  not.ok(!!rightStopAtRawNbsp(""), "02.01");
  not.ok(!!rightStopAtRawNbsp("a"), "02.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  equal(rightStopAtRawNbsp("ab"), 1, "02.01");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  equal(rightStopAtRawNbsp("a b"), 2, "02.02");
  equal(rightStopAtRawNbsp("a b", 0), 2, "02.03");
  equal(rightStopAtRawNbsp("a b", 1), 2, "02.04");
  equal(rightStopAtRawNbsp("a b", 2), null, "02.05");

  equal(rightStopAtRawNbsp("a \n\n\nb"), 5, "02.06");
  equal(rightStopAtRawNbsp("a \n\n\nb", 0), 5, "02.07");
  equal(rightStopAtRawNbsp("a \n\n\nb", 1), 5, "02.08");
  equal(rightStopAtRawNbsp("a \n\n\nb", 2), 5, "02.09");
  equal(rightStopAtRawNbsp("a \n\n\nb", 3), 5, "02.10");
  equal(rightStopAtRawNbsp("a \n\n\nb", 4), 5, "02.11");
  equal(rightStopAtRawNbsp("a \n\n\nb", 5), null, "02.12");

  equal(rightStopAtRawNbsp("a \n\n\n\n"), null, "02.13");
  equal(rightStopAtRawNbsp("a \n\n\n\n", 0), null, "02.14");
  equal(rightStopAtRawNbsp("a \n\n\n\n", 1), null, "02.15");
  equal(rightStopAtRawNbsp("a \n\n\n\n", 2), null, "02.16");
  equal(rightStopAtRawNbsp("a \n\n\n\n", 3), null, "02.17");
  equal(rightStopAtRawNbsp("a \n\n\n\n", 4), null, "02.18");
  equal(rightStopAtRawNbsp("a \n\n\n\n", 5), null, "02.19");
  equal(rightStopAtRawNbsp("a \n\n\n\n", 6), null, "02.20");

  equal(rightStopAtRawNbsp("a  "), null, "02.21");
  equal(rightStopAtRawNbsp("a  ", 0), null, "02.22");
  equal(rightStopAtRawNbsp("a  ", 1), null, "02.23");
  equal(rightStopAtRawNbsp("a  ", 2), null, "02.24");
  equal(rightStopAtRawNbsp("a  ", 3), null, "02.25");

  equal(rightStopAtRawNbsp(`${RAWNBSP}`, 0), null, "02.26");
  equal(rightStopAtRawNbsp(`${RAWNBSP}`, 1), null, "02.27");

  equal(rightStopAtRawNbsp(`${RAWNBSP}${RAWNBSP}`), 1, "02.28");
  equal(rightStopAtRawNbsp(`${RAWNBSP}${RAWNBSP}`, 0), 1, "02.29");
  equal(rightStopAtRawNbsp(`${RAWNBSP}${RAWNBSP}`, 1), null, "02.30");

  equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`), 2, "02.31");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 0), 2, "02.32");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 1), 2, "02.33");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 2), 4, "02.34");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 3), 4, "02.35");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 4), null, "02.36");

  equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`), 3, "02.37");
  equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 0), 3, "02.38");
  equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 1), 3, "02.39");
  equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 2), 3, "02.40");
  equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 3), 5, "02.41");
  equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 4), 5, "02.42");
  equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 5), null, "02.43");

  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`), 2, "02.44");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 0), 2, "02.45");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 1), 2, "02.46");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 2), 5, "02.47");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 3), 5, "02.48");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 4), 5, "02.49");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 5), null, "02.50");

  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`), 2, "02.51");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 0), 2, "02.52");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 1), 2, "02.53");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 2), 6, "02.54");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 3), 6, "02.55");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 4), 6, "02.56");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 5), 6, "02.57");
  equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 6), null, "02.58");
});

test.run();
