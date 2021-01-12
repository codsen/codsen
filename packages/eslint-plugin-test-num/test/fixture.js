/* eslint no-prototype-builtins: 0 */

import tap from "tap";
import crypto from "crypto";
import { Linter } from "eslint";
import api from "../dist/eslint-plugin-test-num.esm";

import {
  c,
  read,
  // letterC,
  // backtick,
  // dollar,
  // backslash,
} from "./util/util";

const sha256 = (x) =>
  crypto.createHash("sha256").update(x, "utf8").digest("hex");
const linter = new Linter();
linter.defineRule("test-num/correct-test-num", api.rules["correct-test-num"]);

// 01. fixture tests
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - replaces first and third arg digit chunks`,
  (t) => {
    // ensure the input is intact - there's a risk test files might get
    // accidentally processed as real JS source files during some find-and-replace
    // went wrong scenarios
    const input = read("01-in");
    t.is(
      sha256(input),
      "ac32ddfd3670f39ce2f55ce674f99850989e1fe1958c49c5348ba7a87a1534ab",
      "01.01 - inputs were mangled!"
    );
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(input, c);
    t.match(
      resIn,
      {
        fixed: true,
        output: read("01-out"),
      },
      `01.02`
    );

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("01-out"), c);
    t.strictSame(messages, [], `01.03`);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - grouped asserts`,
  (t) => {
    const input = read("02-in");
    t.is(
      sha256(input),
      "270b1a851a24884d2aa870aa400271289daa98bd9ef3f369a810485571181e1d",
      "02.01 - inputs were mangled!"
    );
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(input, c);
    t.match(
      resIn,
      {
        fixed: true,
        output: read("02-out"),
      },
      `02.02`
    );
    t.strictSame(resIn.messages, [], `02.03`);

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("02-out"), c);
    t.strictSame(messages, [], `02.04`);
    t.end();
  }
);

tap.test(`03 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
  const input = read("03-in");
  t.is(
    sha256(input),
    "ee2b27660e5d0e3932803a3a4cd82c1cf861b5902bfc7eaa3341d23fb6639cba",
    "03.01 - inputs were mangled!"
  );
  // ensure "in" is fixed
  const resIn = linter.verifyAndFix(input, c);
  t.match(
    resIn,
    {
      fixed: true,
      output: read("03-out"),
    },
    `03.02`
  );
  t.strictSame(resIn.messages, [], `03.03`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("03-out"), c);
  t.strictSame(messages, [], `03.04`);
  t.end();
});

tap.test(`04 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
  const input = read("04-in");
  t.is(
    sha256(input),
    "447e5621c37f92bc95a3e5595574dfc2a7939849d053ca0f66ee0b74fd6b106c",
    "04.01 - inputs were mangled!"
  );
  // ensure "in" is fixed
  const resIn = linter.verifyAndFix(input, c);
  t.match(
    resIn,
    {
      fixed: true,
      output: read("04-out"),
    },
    `04.02`
  );
  t.strictSame(resIn.messages, [], `04.03`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("04-out"), c);
  t.strictSame(messages, [], `04.04`);
  t.end();
});

tap.test(`05 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
  const input = read("05-in");
  t.is(
    sha256(input),
    "01288e3b3217526061615abf7f76040c6192225996cb80bf76cb90d5459daec1",
    "05.01 - inputs were mangled!"
  );
  // ensure "in" is fixed
  const resIn = linter.verifyAndFix(input, c);
  t.match(
    resIn,
    {
      fixed: true,
      output: read("05-out"),
    },
    `05.02`
  );
  t.strictSame(resIn.messages, [], `05.03`);

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("05-out"), c);
  t.strictSame(messages, [], `05.04`);
  t.end();
});

tap.test(`06 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - edge cases`, (t) => {
  const input = read("06-in");
  t.is(
    sha256(input),
    "1ed7b5e97f46b5e10d55c68ec76a59908d7ad083daae12c0b5b8503fe3a2398e",
    "06.01 - inputs were mangled!"
  );
  // ensure "in" is fixed
  const resIn = linter.verifyAndFix(input, c);
  t.match(
    resIn,
    {
      fixed: true,
      output: read("06-out"),
    },
    `06.02`
  );

  // ensure no more errors are raised about "out"
  const messages = linter.verify(read("06-out"), c);
  t.strictSame(messages, [], `06.03`);
  t.end();
});

tap.test(
  `07 - ${`\u001b[${33}m${`basic`}\u001b[${39}m`} - more complex code to be disregarded inside test`,
  (t) => {
    const input = read("10-in");
    t.is(
      sha256(input),
      "e920867a63a9d0f4c3d9ee9990517514106dcadd3e94daaabaff3fc43377bc00",
      "07.01 - inputs were mangled!"
    );
    // ensure "in" is fixed
    const resIn = linter.verifyAndFix(input, c);
    t.match(
      resIn,
      {
        fixed: true,
        output: read("10-out"),
      },
      `07.02`
    );

    // ensure no more errors are raised about "out"
    const messages = linter.verify(read("10-out"), c);
    t.strictSame(messages, [], `07.03`);
    t.end();
  }
);
