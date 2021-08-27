import tap from "tap";
import { rightStopAtRawNbsp } from "../dist/string-left-right.esm.js";

const RAWNBSP = "\u00A0";

// rightStopAtRawNbsp()
// -----------------------------------------------------------------------------

tap.test(`01 - calling at string length`, (t) => {
  t.equal(rightStopAtRawNbsp(""), null, "01.01");
  t.equal(rightStopAtRawNbsp("", null), null, "01.02");
  t.equal(rightStopAtRawNbsp("", undefined), null, "01.03");
  t.equal(rightStopAtRawNbsp("", 0), null, "01.04");
  t.equal(rightStopAtRawNbsp("", 1), null, "01.05");
  t.equal(rightStopAtRawNbsp("", 99), null, "01.06");
  t.equal(rightStopAtRawNbsp("abc", 3), null, "01.07");
  t.equal(rightStopAtRawNbsp("abc", 99), null, "01.08");
  t.end();
});

tap.test(`02 - normal use`, (t) => {
  t.notOk(!!rightStopAtRawNbsp(""), "02.01");
  t.notOk(!!rightStopAtRawNbsp("a"), "02.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  t.equal(rightStopAtRawNbsp("ab"), 1, "02.03");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  t.equal(rightStopAtRawNbsp("a b"), 2, "02.04");
  t.equal(rightStopAtRawNbsp("a b", 0), 2, "02.05");
  t.equal(rightStopAtRawNbsp("a b", 1), 2, "02.06");
  t.equal(rightStopAtRawNbsp("a b", 2), null, "02.07");

  t.equal(rightStopAtRawNbsp("a \n\n\nb"), 5, "02.08");
  t.equal(rightStopAtRawNbsp("a \n\n\nb", 0), 5, "02.09");
  t.equal(rightStopAtRawNbsp("a \n\n\nb", 1), 5, "02.10");
  t.equal(rightStopAtRawNbsp("a \n\n\nb", 2), 5, "02.11");
  t.equal(rightStopAtRawNbsp("a \n\n\nb", 3), 5, "02.12");
  t.equal(rightStopAtRawNbsp("a \n\n\nb", 4), 5, "02.13");
  t.equal(rightStopAtRawNbsp("a \n\n\nb", 5), null, "02.14");

  t.equal(rightStopAtRawNbsp("a \n\n\n\n"), null, "02.15");
  t.equal(rightStopAtRawNbsp("a \n\n\n\n", 0), null, "02.16");
  t.equal(rightStopAtRawNbsp("a \n\n\n\n", 1), null, "02.17");
  t.equal(rightStopAtRawNbsp("a \n\n\n\n", 2), null, "02.18");
  t.equal(rightStopAtRawNbsp("a \n\n\n\n", 3), null, "02.19");
  t.equal(rightStopAtRawNbsp("a \n\n\n\n", 4), null, "02.20");
  t.equal(rightStopAtRawNbsp("a \n\n\n\n", 5), null, "02.21");
  t.equal(rightStopAtRawNbsp("a \n\n\n\n", 6), null, "02.22");

  t.equal(rightStopAtRawNbsp("a  "), null, "02.23");
  t.equal(rightStopAtRawNbsp("a  ", 0), null, "02.24");
  t.equal(rightStopAtRawNbsp("a  ", 1), null, "02.25");
  t.equal(rightStopAtRawNbsp("a  ", 2), null, "02.26");
  t.equal(rightStopAtRawNbsp("a  ", 3), null, "02.27");

  t.equal(rightStopAtRawNbsp(`${RAWNBSP}`, 0), null, "02.28");
  t.equal(rightStopAtRawNbsp(`${RAWNBSP}`, 1), null, "02.29");

  t.equal(rightStopAtRawNbsp(`${RAWNBSP}${RAWNBSP}`), 1, "02.30");
  t.equal(rightStopAtRawNbsp(`${RAWNBSP}${RAWNBSP}`, 0), 1, "02.31");
  t.equal(rightStopAtRawNbsp(`${RAWNBSP}${RAWNBSP}`, 1), null, "02.32");

  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`), 2, "02.33");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 0), 2, "02.34");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 1), 2, "02.35");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 2), 4, "02.36");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 3), 4, "02.37");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} b`, 4), null, "02.38");

  t.equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`), 3, "02.39");
  t.equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 0), 3, "02.40");
  t.equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 1), 3, "02.41");
  t.equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 2), 3, "02.42");
  t.equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 3), 5, "02.43");
  t.equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 4), 5, "02.44");
  t.equal(rightStopAtRawNbsp(`a\t ${RAWNBSP} b`, 5), null, "02.45");

  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`), 2, "02.46");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 0), 2, "02.47");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 1), 2, "02.48");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 2), 5, "02.49");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 3), 5, "02.50");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 4), 5, "02.51");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \tb`, 5), null, "02.52");

  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`), 2, "02.53");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 0), 2, "02.54");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 1), 2, "02.55");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 2), 6, "02.56");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 3), 6, "02.57");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 4), 6, "02.58");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 5), 6, "02.59");
  t.equal(rightStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 6), null, "02.60");

  t.end();
});
