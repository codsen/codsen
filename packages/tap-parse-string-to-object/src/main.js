// extracts asserts - consumes content, split by suite
function countAsserts(str, from, to) {
  const res = {
    assertsPassed: 0,
    assertsFailed: 0
  };

  let currLineStartAt = from;
  let doNothing = false;

  // only count "ok" and "not ok" from "# Subtest" to "1..".
  // There main totals underneath which also start with "ok" and "not ok" and
  // this will throw the counts off track otherwise.
  let canCountAssertionLines = false;

  for (let i = from; i < to; i++) {
    // Logging:
    // -------------------------------------------------------------------------
    // console.log(
    //   `${`\u001b[${90}m${`countAsserts()`}\u001b[${39}m`} \u001b[${34}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
    //     str[i] && str[i].trim().length
    //       ? str[i]
    //       : JSON.stringify(str[i], null, 4)
    //   }`}\u001b[${39}m \u001b[${34}m${`===============================`}\u001b[${39}m\n`
    // );

    // catch ---
    if (
      !doNothing &&
      str[i] === "-" &&
      str[i + 1] === "-" &&
      str[i + 2] === "-"
    ) {
      doNothing = true;
      currLineStartAt = null;
      console.log(
        `037 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = ${doNothing}; ${`\u001b[${33}m${`currLineStartAt`}\u001b[${39}m`} = ${currLineStartAt}`
      );
    }

    // catch ...
    if (doNothing) {
      if (str[i - 1] === "." && str[i - 2] === "." && str[i - 3] === ".") {
        doNothing = false;
        currLineStartAt = i;
        console.log(
          `047 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = ${doNothing}; ${`\u001b[${33}m${`currLineStartAt`}\u001b[${39}m`} = ${currLineStartAt}`
        );
      } else {
        continue;
      }
    }

    // catch the end of a line
    if (!doNothing && ["\n", "\r"].includes(str[i])) {
      if (Number.isInteger(currLineStartAt)) {
        const linesContents = str.slice(currLineStartAt, i);
        console.log(
          `059 ${`\u001b[${36}m${`countAsserts()`}\u001b[${39}m`} ${`\u001b[${33}m${`linesContents`}\u001b[${39}m`} = ${JSON.stringify(
            linesContents,
            null,
            4
          )}`
        );

        // enable recording window for current chunk of consecutive
        // assert lines
        if (
          !doNothing &&
          !canCountAssertionLines &&
          linesContents.trim().startsWith("# Subtest")
        ) {
          canCountAssertionLines = true;
          console.log(
            `075 ${`\u001b[${36}m${`countAsserts()`}\u001b[${39}m`} ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`canCountAssertionLines`}\u001b[${39}m`} = ${canCountAssertionLines}`
          );
        }

        // disable recording window for current chunk of consecutive
        // assert lines
        if (
          !doNothing &&
          canCountAssertionLines &&
          linesContents.trim().startsWith("1..")
        ) {
          canCountAssertionLines = false;
          console.log(
            `088 ${`\u001b[${36}m${`countAsserts()`}\u001b[${39}m`} ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`canCountAssertionLines`}\u001b[${39}m`} = ${canCountAssertionLines}`
          );
        }

        // count the beans
        if (!linesContents.trim().startsWith("#") && canCountAssertionLines) {
          // not a comment line
          if (linesContents.trim().startsWith("ok ")) {
            res.assertsPassed = res.assertsPassed + 1;
          } else if (linesContents.trim().startsWith("not ok ")) {
            res.assertsFailed = res.assertsFailed + 1;
          }
          console.log(
            `101 ${`\u001b[${36}m${`countAsserts()`}\u001b[${39}m`} ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
              res,
              null,
              4
            )}`
          );
        }

        // reset currLineStartAt
        currLineStartAt = null;
        console.log(
          `112 ${`\u001b[${36}m${`countAsserts()`}\u001b[${39}m`} ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`currLineStartAt`}\u001b[${39}m`} = ${currLineStartAt}`
        );
      }
      console.log(`115 ${`\u001b[${36}m${`countAsserts()`}\u001b[${39}m`}`);
    } else if (!doNothing) {
      // not line break symbol
      // catch the start of a line
      if (currLineStartAt === null) {
        currLineStartAt = i;
        console.log(
          `122 ${`\u001b[${36}m${`countAsserts()`}\u001b[${39}m`} SET ${`\u001b[${33}m${`currLineStartAt`}\u001b[${39}m`} = ${currLineStartAt}`
        );
      }
    }

    // logging
    // console.log(
    //   `${doNothing ? `${`\u001b[${31}m${`doNothing`}\u001b[${39}m`}` : ""}`
    // );
    // console.log(
    //   `canCountAssertionLines = ${`\u001b[${
    //     canCountAssertionLines ? 32 : 31
    //   }m${canCountAssertionLines}\u001b[${39}m`}`
    // );
    // console.log(`136 currLineStartAt = ${currLineStartAt}`);
  }

  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log(`                   ██`);
  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log(
    `147 ${`\u001b[${36}m${`countAsserts()`}\u001b[${39}m`} ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );

  return res;
}

// extracts contents of suites
function splitBySuite(str) {
  // console.log(
  //   `160 ${`\u001b[${90}m${`splitBySuite()`}\u001b[${39}m`} received str:\n\n-----------\n\n${str}\n\n-----------\n`
  // );
  const len = str.length;
  const res = [];
  let suiteStartedAt = null;
  let doNothing = false;

  for (let i = 0; i < len; i++) {
    // Logging:
    // -------------------------------------------------------------------------
    // console.log(
    //   `${`\u001b[${90}m${`splitBySuite()`}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
    //     str[i] && str[i].trim().length
    //       ? str[i]
    //       : JSON.stringify(str[i], null, 4)
    //   }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    // );

    // catch ---
    if (
      !doNothing &&
      str[i] === "-" &&
      str[i + 1] === "-" &&
      str[i + 2] === "-"
    ) {
      doNothing = true;
    }

    // catch ...
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

    // catch {
    // -------------------------------------------------------------------------
    if (!doNothing && str[i] === "{" && suiteStartedAt === null) {
      suiteStartedAt = i + 1;
      console.log(
        `205 i=${i} ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`suiteStartedAt`}\u001b[${39}m`} = ${suiteStartedAt}`
      );
    }

    // catch }
    if (!doNothing && str[i] === "}" && suiteStartedAt !== null) {
      // 1. push to res
      console.log(
        `213 ${`\u001b[${90}m${`splitBySuite()`}\u001b[${39}m`} ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${suiteStartedAt}, ${i}]`
      );
      res.push([suiteStartedAt, i]);

      // 2. reset
      suiteStartedAt = null;
    }

    // logging
    // console.log(
    //   `${doNothing ? `${`\u001b[${31}m${`doNothing`}\u001b[${39}m`}` : ""}`
    // );
  }

  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log(`                   ██`);
  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log(
    `235 ${`\u001b[${36}m${`splitBySuite()`}\u001b[${39}m`} ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );

  return res;
}

function parse(str) {
  // insurance
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
  // console.log(
  //   `258 ${`\u001b[${90}m${`parse()`}\u001b[${39}m`} ${`\u001b[${33}m${`splitRes`}\u001b[${39}m`} = ${JSON.stringify(
  //     splitRes,
  //     null,
  //     4
  //   )}`
  // );
  splitRes.forEach(suitesRangeArr => {
    const assertTotals = countAsserts(str, ...suitesRangeArr);
    console.log(
      `267 ${`\u001b[${90}m${`parse()`}\u001b[${39}m`} ${`\u001b[${33}m${`assertTotals`}\u001b[${39}m`} = ${JSON.stringify(
        assertTotals,
        null,
        4
      )}`
    );
    // we get result object like
    // {
    //    "assertsPassed": 2,
    //    "assertsFailed": 0
    // }
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

  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log(`                   ██ FIN.`);
  console.log(" ");
  console.log(" ");
  console.log(" ");
  console.log(
    `301 ${`\u001b[${36}m${`parse()`}\u001b[${39}m`} ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );

  return res;
}

export default parse;
