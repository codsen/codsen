import tap from "tap";
import { leftStopAtRawNbsp } from "../dist/string-left-right.esm";

const RAWNBSP = "\u00A0";

// leftStopAtRawNbsp()
// -----------------------------------------------------------------------------

tap.test(`01 - null result cases`, (t) => {
  t.equal(leftStopAtRawNbsp("abc"), null, "01.01 - assumed default");
  t.equal(leftStopAtRawNbsp("abc", -1), null, "01.02");
  t.equal(leftStopAtRawNbsp("abc", 0), null, "01.03 - hardcoded default");
  t.equal(leftStopAtRawNbsp("abc", null), null, "01.04 - hardcoded default");
  t.equal(leftStopAtRawNbsp("abc", 4), 2, "01.05 - at string.length + 1");
  t.equal(
    leftStopAtRawNbsp("abc", 9),
    2,
    "01.06 - outside of the string.length"
  );
  t.equal(leftStopAtRawNbsp(""), null, "01.07");
  t.equal(leftStopAtRawNbsp("", 0), null, "01.08");
  t.equal(leftStopAtRawNbsp("", null), null, "01.09");
  t.equal(leftStopAtRawNbsp("", undefined), null, "01.10");
  t.equal(leftStopAtRawNbsp("", 1), null, "01.11");
  t.end();
});

tap.test(`02 - normal use`, (t) => {
  t.notOk(!!leftStopAtRawNbsp(""), "02.01");
  t.notOk(!!leftStopAtRawNbsp("a"), "02.02");
  t.equal(leftStopAtRawNbsp("ab", 1), 0, "02.03");
  t.equal(leftStopAtRawNbsp("a b", 2), 0, "02.04");
  t.equal(leftStopAtRawNbsp("a\t b", 2), 0, "02.05");

  t.equal(leftStopAtRawNbsp("a \n\n\nb", 5), 0, "02.06");
  t.equal(leftStopAtRawNbsp("a \n\n\n b", 6), 0, "02.07");
  t.equal(leftStopAtRawNbsp("a \r\r\r b", 6), 0, "02.08");
  t.equal(leftStopAtRawNbsp("a\n\rb", 3), 0, "02.09");
  t.equal(leftStopAtRawNbsp("a\n\r b", 4), 0, "02.10");

  t.equal(leftStopAtRawNbsp("\n\n\n\n", 4), null, "02.11");
  t.equal(leftStopAtRawNbsp("\n\n\n\n", 3), null, "02.12");
  t.equal(leftStopAtRawNbsp("\n\n\n\n", 2), null, "02.13");
  t.equal(leftStopAtRawNbsp("\n\n\n\n", 1), null, "02.14");
  t.equal(leftStopAtRawNbsp("\n\n\n\n", 0), null, "02.15");

  t.equal(leftStopAtRawNbsp(`${RAWNBSP}`, 0), null, "02.16");
  t.equal(leftStopAtRawNbsp(`${RAWNBSP}`, 1), 0, "02.17");
  t.equal(leftStopAtRawNbsp(`${RAWNBSP}`, 2), 0, "02.18");

  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}b`, 3), 2, "02.19");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} b`, 3), 2, "02.20");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} b`, 4), 2, "02.21");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}\tb`, 4), 2, "02.22");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}\rb`, 4), 2, "02.23");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}\nb`, 4), 2, "02.24");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}\r\nb`, 4), 2, "02.25");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}\r\nb`, 5), 2, "02.26");

  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} \tb`, 5), 2, "02.27");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} \rb`, 5), 2, "02.28");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} \nb`, 5), 2, "02.29");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} \r\nb`, 6), 2, "02.30");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} \t b`, 6), 2, "02.31");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} \r b`, 6), 2, "02.32");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} \n b`, 6), 2, "02.33");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP} \r\n b`, 7), 2, "02.34");

  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \tb`, 4), 2, "02.35");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \tb`, 5), 2, "02.36");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \tb`, 6), 2, "02.37");

  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \rb`, 4), 2, "02.38");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \rb`, 5), 2, "02.39");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \rb`, 6), 2, "02.40");

  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \nb`, 6), 2, "02.41");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \r\nb`, 7), 2, "02.42");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \t b`, 7), 2, "02.43");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \r b`, 7), 2, "02.44");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \n b`, 7), 2, "02.45");
  t.equal(leftStopAtRawNbsp(`a ${RAWNBSP}  \r\n b`, 8), 2, "02.46");

  t.equal(leftStopAtRawNbsp(`${RAWNBSP}${RAWNBSP}`, 1), 0, "02.47");
  t.equal(leftStopAtRawNbsp(`${RAWNBSP} ${RAWNBSP}`, 2), 0, "02.48");
  t.equal(leftStopAtRawNbsp(`${RAWNBSP}\t${RAWNBSP}`, 2), 0, "02.49");
  t.equal(leftStopAtRawNbsp(`${RAWNBSP}\t\n\r${RAWNBSP}`, 4), 0, "02.50");

  t.end();
});
