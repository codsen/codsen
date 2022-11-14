/* eslint-disable no-unused-vars */
import { readdirSync, statSync } from "fs";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { read, sha256 } from "../../../ops/helpers/linter.js";
import { verifyAndFix, verify } from "./_util.js";

// -----------------------------------------------------------------------------

// a single test for debugging
// -----------------------------------------------------------------------------

const shas = {
  "01-in.zz":
    "609b466b84d5738f9eeb3ef310b336ec3a3c31557d105c450a152f5aae7974e7",
  "02-in.zz":
    "815c13aa587edb5b44c9fc983734fd7df528411c83d599108d6413a1137c4ef6",
  "03-in.zz":
    "d1f8b0243de8e88e22459188a0d4082c1bfddbf65bab02e50caab335a00007b3",
  "04-in.zz":
    "ab0010414f3a55c29863de98c60b2ba14e976be98bb377c443bb8f98aeb64944",
  "05-in.zz":
    "6151c74e0eaeeba7a74dfd50e240a6360982b66607744c756c7b9793c1897955",
};

// loop through all fixtures
// -----------------------------------------------------------------------------

let fixturesPath = path.resolve("./test/fixtures");
readdirSync(fixturesPath)
  .filter(
    (f) => statSync(path.join(fixturesPath, f)).isFile() && f.endsWith("-in.zz")
  )
  .forEach((file, i) => {
    test(`${String(i + 1).padStart(2, "0")} - ${file}`, () => {
      let testName = file.slice(0, -6);
      // console.log(`${`\u001b[${90}m${`test:`}\u001b[${39}m`} ${testName}`);
      let testIn = read(`${testName}-in`);
      let testOut = read(`${testName}-out`);
      let testVerify = JSON.parse(read(`${testName}-verify`, "json"));

      // 1. ensure inputs haven't been mangled
      if (!shas[file]) {
        throw new Error(`${file} new sha: ${sha256(testIn)}`);
      } else if (sha256(testIn) !== shas[file]) {
        throw new Error(
          `#${testName} - ${file} has been mangled, sha should be: ${sha256(
            testIn
          )}`
        );
      }

      // 2. run Linter.verify
      let verified = verify(testIn);

      equal(verified, testVerify, `#${testName} - verify() - ${testName}`);

      // 3. ensure "in" is fixed
      let verifiedAndFixed = verifyAndFix(testIn);
      equal(
        verifiedAndFixed.output,
        testOut,
        `#${testName} - verifyAndFix().output`
      );
      equal(
        verifiedAndFixed.fixed,
        true,
        `#${testName} - verifyAndFix().fixed`
      );
      equal(
        verifiedAndFixed.messages,
        [],
        `#${testName} - verifyAndFix().messages`
      );

      // 4. ensure no more errors are raised about "out"
      let messages = verify(testOut);
      equal(messages, [], `#${testName} - verify() out - ${testName}`);
    });
  });

// some more ad-hoc tests
// -----------------------------------------------------------------------------

[
  `const z = "something"`,
  `const z = \`something\n01\``,
  `const z = "99 aaaaa"`,
  `const z = "something 01"`,
  `const z = "01 something 01"`,
  `const z = \`01 something 01\n\``,
  `const z = "\t01 something 01"`,
].forEach((testStr, i) => {
  test(`02 - ${String(i + 1).padStart(2, "0")} - false positives`, () => {
    equal(
      verifyAndFix(testStr),
      {
        fixed: false,
        output: testStr,
        messages: [],
      },
      `02.01.${String(i + 1).padStart(2, "0")}`
    );
  });
});

test.run();
