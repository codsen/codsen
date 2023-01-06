/* eslint-disable no-unused-vars */
import { readdirSync, statSync } from "fs";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { read, sha256, pad } from "../../../ops/helpers/common.js";
import { verifyAndFix, verify } from "./_util.js";

// a single test for debugging
// -----------------------------------------------------------------------------

const shas = {
  "01-in.zz":
    "d6b5f83792903c7cbb93967c66a0c0464b4eb4132643710e9f4e08cfcb827f33",
  "02-in.zz":
    "d1bbd6f35cf2d17816decc1d40a912ea4b074f30d886ee1ec6713a1ecbfd0efa",
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
    "eaebf238a771d47f08dc4d3aa3fd14352593724630c84590726ba2f84693c1cd",
  "11-in.zz":
    "fc6a3ffef2286d70b652c2455b29bf5056f086659a108cb515866ce7d93727e0",
  "12-in.zz":
    "f4a1b8f05ff95dd6ae870762310b75fb64c41520e7ccb08d28fa52725701c26f",
  "13-in.zz":
    "1dd4161500eea010ad385742fd48c182723ed1ca763d60b6acffc08022852237",
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
    "88dbe3c48fccd5c2cf7f43b92273169a9d20522c8d562b5ef6f234e346531c7b",
  "25-in.zz":
    "0ac762e0c28561f85dcb706627c91d1efcd393e9b48d0398b41d256391cd44e3",
  "26-in.zz":
    "99e1bda2e155149b2cebeff8d973abd2b538e806497b57df38d0f7477265d159",
  "27-in.zz":
    "a6cb3a377406b24ff2e8f67b8bcdcbac156e89f2a6f15b70b6872efb17871e09",
  "28-in.zz":
    "f268b4e1675c60028a94ba5ef2aebbb936f3ab65680c398f0a14360ad3127064",
  "29-in.zz":
    "4cdb3450eefabe0be731c5bd4e1868eebce84e3ba0e4875134ad7c5dc3a463e5",
  "30-in.zz":
    "52f2642fc204d7e1dbba37974e4bc89f2168cab17173fd44c6bddb465161b606",
  "31-in.zz":
    "3d98852c1debaed9d415901d85bed31e1175a19cf8b5bff62e4e814ac5dd0556",
  "32-in.zz":
    "e058ee4ea64cbd2669f03c3ec4422eb7d0df158592d453e36487ce9a8d8942bb",
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
      let testIn = read(`${testName}-in`);
      let testOut = read(`${testName}-out`);

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

      // 2. ensure "in" is fixed
      let verifiedAndFixed = verifyAndFix(testIn);
      equal(
        verifiedAndFixed.output,
        testOut,
        `#${testName} - verifyAndFix().output`
      );
      equal(
        verifiedAndFixed.fixed,
        // if "in" and "out" are the same,
        // there was nothing to fix, so "fixed" will be "false"
        testIn !== testOut,
        `#${testName} - verifyAndFix().fixed`
      );
      /*equal(
        verifiedAndFixed.messages,
        [],
        `#${testName} - verifyAndFix().messages`
      );*/
    });
  });

test.run();
