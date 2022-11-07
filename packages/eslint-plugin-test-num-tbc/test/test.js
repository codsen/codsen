/* eslint-disable no-unused-vars */
import { readdirSync, statSync } from "fs";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { read, sha256, verifyAndFix, verify } from "./_util.js";

// a single test for debugging
// -----------------------------------------------------------------------------

const shas = {
  "01-in.zz":
    "ac32ddfd3670f39ce2f55ce674f99850989e1fe1958c49c5348ba7a87a1534ab",
  "02-in.zz":
    "0e93107084848ff145b984e3945f0e17e47eea75ccfa505511d82673858f405d",
  "03-in.zz":
    "ee2b27660e5d0e3932803a3a4cd82c1cf861b5902bfc7eaa3341d23fb6639cba",
  "04-in.zz":
    "447e5621c37f92bc95a3e5595574dfc2a7939849d053ca0f66ee0b74fd6b106c",
  "05-in.zz":
    "01288e3b3217526061615abf7f76040c6192225996cb80bf76cb90d5459daec1",
  "06-in.zz":
    "1ed7b5e97f46b5e10d55c68ec76a59908d7ad083daae12c0b5b8503fe3a2398e",
  "07-in.zz":
    "287a889e5e9b9ceb45c8506386a4154d03ed312133683538cd8abc75b5bca81d",
  "08-in.zz":
    "5b2201ec23782ebf34d64c11e6d0b5aa8c98ab2a4c0e5b86f94347170567cec4",
  "09-in.zz":
    "1c405662a72591e677c165b94a111b436a0b18543658e8f0ac140b79c286e7a1",
  "10-in.zz":
    "e920867a63a9d0f4c3d9ee9990517514106dcadd3e94daaabaff3fc43377bc00",
  "11-in.zz":
    "fc6a3ffef2286d70b652c2455b29bf5056f086659a108cb515866ce7d93727e0",
  "12-in.zz":
    "f4a1b8f05ff95dd6ae870762310b75fb64c41520e7ccb08d28fa52725701c26f",
  "13-in.zz":
    "41e28ad697f8fd15837f7cfe2a172c2f67aca83cb52d05c8f7d154ceceafe4ec",
  "14-in.zz":
    "452ec77818e692b99d7bd699186900a6deb01455b456078eca4805cc819ee325",
};

/*tttest(`01 - adds 3rd arg, one liners`, () => {
  let testIn = read("12-in");
  let testVerify = JSON.parse(read(`12-verify`, "json"));

  let verified = verify(testIn, equal);
  console.log(
    `${`\u001b[${33}m${`verified`}\u001b[${39}m`} = ${JSON.stringify(
      verified,
      null,
      4
    )}`
  );
  equal(verified, testVerify, `verify() - 12`);

  // ensure "in" is fixed
  let res = verifyAndFix(testIn, equal);
  equal(res.output, read("12-out"), "verifyAndFix output");
  equal(res.fixed, true, "verifyAndFix fixed");
  equal(res.messages, [], "verifyAndFix messages");

  // ensure no more errors are raised about "out"
  let messages = verify(read("12-out"), equal);
  equal(messages, [], `01.05`);
});*/

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

      let verified = verify(testIn, equal);
      equal(verified, testVerify, `#${testName} - verify() - ${testName}`);

      // 3. ensure "in" is fixed
      let verifiedAndFixed = verifyAndFix(testIn, equal);
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
      let messages = verify(testOut, equal);
      equal(messages, [], `#${testName} - verify() out - ${testName}`);
    });
  });

test.run();
