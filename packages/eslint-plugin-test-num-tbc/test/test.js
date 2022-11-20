/* eslint-disable no-unused-vars */
import { readdirSync, statSync } from "fs";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { read, sha256, pad } from "../../../ops/helpers/common.js";
import { verifyAndFix, verify } from "./_util.js";

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
  "15-in.zz":
    "ccf6d8bc1d5bff5e4ccad92cd06247ce4ae4c24ba4bbdd88bd0db1a77f301b75",
  "16-in.zz":
    "db738cf4852a3a32ce234e7cc5332459e6666f39b39575420464c47b5357bbe0",
  "17-in.zz":
    "fb3777ab6d9ec359b1a5059375ca9a5ffdccf5f01cfe9b967d0a38094508585c",
  "18-in.zz":
    "4cf8a3f7305d76697a08fbe492732c735e5472e1e4db8331e9a9f534df1a9ea2",
  "19-in.zz":
    "cefe0e160e09534705e68d3d19e715e550f71d700341fc981d375c622639b4cd",
  "20-in.zz":
    "cd777571904056b9dc1179faad09c358280b25a89ad4d809ce8120b962c648e2",
  "21-in.zz":
    "2cf6d1ea83430cfe7c382f071328d079cd28bbe7d04f78c81c50cab7c1cc96b0",
  "22-in.zz":
    "6413be0bead4f1ef6924154fa9a39a6df2f0be463496087ff25b47a39e0b9a83",
  "23-in.zz":
    "9b8b7e156ae1baf9d610dd37c5c20c2bfea4be34f246cb7c5440cb537c890c44",
  "24-in.zz":
    "bf26c31ef91e7dc223f70607a8cbd97bf3724182a801ae6f1b35e4cfdec39324",
  "25-in.zz":
    "0ac762e0c28561f85dcb706627c91d1efcd393e9b48d0398b41d256391cd44e3",
};

// loop through all fixtures
// -----------------------------------------------------------------------------

let fixturesPath = path.resolve("./test/fixtures");
readdirSync(fixturesPath)
  .filter(
    (f) => statSync(path.join(fixturesPath, f)).isFile() && f.endsWith("-in.zz")
  )
  .forEach((file, i) => {
    test(`${file}`, () => {
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

      // let verified = verify(testIn);
      // equal(verified, testVerify, `#${testName} - verify() - ${testName}`);

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

test.run();
