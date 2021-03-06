import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains";

// missing space in after a colon
// -----------------------------------------------------------------------------

tap.test(`01 - head CSS`, (t) => {
  const str = `<style>.a{color:red;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "01");
  t.end();
});

tap.test(`02 - inline CSS`, (t) => {
  const str = `<td style="color:red;">x</td>`;
  const fixed = `<td style="color: red;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "02");
  t.end();
});

// missing space in after an !important
// -----------------------------------------------------------------------------

tap.test(`03 - head CSS`, (t) => {
  const str = `<style>.a{color: red!important;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red !important;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03");
  t.end();
});

tap.test(`04 - inline CSS`, (t) => {
  const str = `<td style="color: red!important;">x</td>`;
  const fixed = `<td style="color: red !important;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04");
  t.end();
});

tap.test(`05 - combo, HTML`, (t) => {
  const str = `<td style="color:red!important;">x</td>`;
  const fixed = `<td style="color: red !important;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05");
  t.end();
});

tap.test(`06 - combo, Nunj`, (t) => {
  const str = `<td{% if foo %} style="color:red!important; text-align:left;"{% endif %} align="left"></td>`;
  const fixed = `<td{% if foo %} style="color: red !important; text-align: left;"{% endif %} align="left"></td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "06");
  t.end();
});
