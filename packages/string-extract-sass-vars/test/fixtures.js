import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import fs from "fs";
import crypto from "crypto";

import { extractVars as e } from "../dist/string-extract-sass-vars.esm.js";

const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");

// -----------------------------------------------------------------------------

test("01 - fixture 01 - a healthy file", () => {
  let f01 = fs.readFileSync("test/fixtures/01.scss", { encoding: "utf8" });
  is(
    sha256(f01),
    "4421b6cd976f625b37daa6cad06098196c77fff6a9bc54c9a509354c7a917428",
    "01.01"
  );
  equal(
    e(f01),
    {
      red: "#ff6565",
      yellow: "#ffff65",
      blue: "#08f0fd",
      fontfamily: "Helvetica, sans-serif",
      border: "1px solid #dedede",
      borderroundedness: "3px",
      customValue1: "trala; la",
      customValue2: "trala: la",
      customValue3: "tralala",
      customValue4: 10,
    },
    "01.02"
  );
});

test("02 - fixture 02 - lots of comments and some styling unrelated to variables", () => {
  let f02 = fs.readFileSync("test/fixtures/02.scss", { encoding: "utf8" });
  is(
    sha256(f02),
    "65b94850edae71dc9715673b3aee6b0381566e67f257247e334decb6f8d97018",
    "02.01"
  );
  equal(
    e(f02),
    {
      me: 0,
      andMe: 999,
    },
    "02.02"
  );
});

test("03 - fixture 03 - curlies", () => {
  let f03 = fs.readFileSync("test/fixtures/03.scss", { encoding: "utf8" });
  is(
    sha256(f03),
    "84f3619cbb42f1a11e16a301fbd3c8fcdf69ecb73d20cf7bc7492fc402b5339e",
    "03.01"
  );
  equal(
    e(f03),
    {
      var1: "val1",
      var2: 2,
      var3: ";",
    },
    "03.02"
  );
});

test("04 - fixture 04 - file of comments only", () => {
  let f04 = fs.readFileSync("test/fixtures/04.scss", { encoding: "utf8" });
  is(
    sha256(f04),
    "c0ac0273bf64f3574402333e2b37a42ea4f8fa4e026b0b4f7dc8d7bfcc6ec2de",
    "04.01"
  );
  equal(e(f04), {}, "04.02");
});

test("05 - fixture 05 - inline comments", () => {
  let f05 = fs.readFileSync("test/fixtures/05.scss", { encoding: "utf8" });
  is(
    sha256(f05),
    "5bccd822d46468b0df1076dedf4f2370fef69dbbc6aa9873b15fb75c80e37ea5",
    "05.01"
  );
  equal(
    e(f05),
    {
      red: "#ff6565",
    },
    "05.02"
  );
});

test.run();
