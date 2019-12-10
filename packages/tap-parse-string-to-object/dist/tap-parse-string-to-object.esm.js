/**
 * tap-parse-string-to-object
 * Parses raw Tap output, string-to-object
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/tap-parse-string-to-object
 */

function countAsserts(str, from, to) {
  const res = {
    assertsPassed: 0,
    assertsFailed: 0
  };
  let currLineStartAt = from;
  let doNothing = false;
  let canCountAssertionLines = false;
  for (let i = from; i < to; i++) {
    if (
      !doNothing &&
      str[i] === "-" &&
      str[i + 1] === "-" &&
      str[i + 2] === "-"
    ) {
      doNothing = true;
      currLineStartAt = null;
    }
    if (doNothing) {
      if (str[i - 1] === "." && str[i - 2] === "." && str[i - 3] === ".") {
        doNothing = false;
        currLineStartAt = i;
      } else {
        continue;
      }
    }
    if (!doNothing && ["\n", "\r"].includes(str[i])) {
      if (Number.isInteger(currLineStartAt)) {
        const linesContents = str.slice(currLineStartAt, i);
        if (
          !doNothing &&
          !canCountAssertionLines &&
          linesContents.trim().startsWith("# Subtest")
        ) {
          canCountAssertionLines = true;
        }
        if (
          !doNothing &&
          canCountAssertionLines &&
          linesContents.trim().startsWith("1..")
        ) {
          canCountAssertionLines = false;
        }
        if (!linesContents.trim().startsWith("#") && canCountAssertionLines) {
          if (linesContents.trim().startsWith("ok ")) {
            res.assertsPassed = res.assertsPassed + 1;
          } else if (linesContents.trim().startsWith("not ok ")) {
            res.assertsFailed = res.assertsFailed + 1;
          }
        }
        currLineStartAt = null;
      }
    } else if (!doNothing) {
      if (currLineStartAt === null) {
        currLineStartAt = i;
      }
    }
  }
  return res;
}
function splitBySuite(str) {
  const len = str.length;
  const res = [];
  let suiteStartedAt = null;
  let doNothing = false;
  if (!str.includes("{")) {
    return [[0, str.length]];
  }
  for (let i = 0; i < len; i++) {
    if (
      !doNothing &&
      str[i] === "-" &&
      str[i + 1] === "-" &&
      str[i + 2] === "-"
    ) {
      doNothing = true;
    }
    if (
      doNothing &&
      str[i - 1] === "." &&
      str[i - 2] === "." &&
      str[i - 3] === "."
    ) {
      doNothing = false;
    } else if (doNothing) {
      continue;
    }
    if (!doNothing && str[i] === "{" && suiteStartedAt === null) {
      suiteStartedAt = i + 1;
    }
    if (!doNothing && str[i] === "}" && suiteStartedAt !== null) {
      res.push([suiteStartedAt, i]);
      suiteStartedAt = null;
    }
  }
  return res;
}
function parse(str) {
  if (typeof str !== "string") {
    throw new Error(
      "tap-parse-string-to-object: [THROW_ID_01] input must be a string"
    );
  }
  const res = {
    ok: true,
    assertsTotal: 0,
    assertsPassed: 0,
    assertsFailed: 0,
    suitesTotal: 0,
    suitesPassed: 0,
    suitesFailed: 0
  };
  const splitRes = splitBySuite(str);
  splitRes.forEach(suitesRangeArr => {
    const assertTotals = countAsserts(str, ...suitesRangeArr);
    if (assertTotals.assertsFailed) {
      res.suitesFailed = res.suitesFailed + 1;
      res.assertsFailed = res.assertsFailed + assertTotals.assertsFailed;
    } else {
      res.suitesPassed = res.suitesPassed + 1;
      res.assertsPassed = res.assertsPassed + assertTotals.assertsPassed;
    }
    res.assertsTotal =
      res.assertsTotal +
      assertTotals.assertsPassed +
      assertTotals.assertsFailed;
    res.suitesTotal = res.suitesTotal + 1;
  });
  return res;
}

export default parse;
