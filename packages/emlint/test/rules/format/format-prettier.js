import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains";

// missing space after a colon
// -----------------------------------------------------------------------------

tap.test(`01 - head CSS, missing space`, (t) => {
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

tap.test(`02 - inline CSS, missing space`, (t) => {
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

tap.test(`03 - head CSS, tab as space`, (t) => {
  const str = `<style>.a{color:\tred;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03");
  t.end();
});

tap.test(`04 - inline CSS, tab as space`, (t) => {
  const str = `<td style="color:\tred;">x</td>`;
  const fixed = `<td style="color: red;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04");
  t.end();
});

tap.test(`05 - head CSS, two spaces`, (t) => {
  const str = `<style>.a{color:  red;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05");
  t.end();
});

tap.test(`06 - inline CSS, two spaces`, (t) => {
  const str = `<td style="color:  red;">x</td>`;
  const fixed = `<td style="color: red;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "06");
  t.end();
});

// missing space in after an !important
// -----------------------------------------------------------------------------

tap.test(`07 - head CSS, missing space`, (t) => {
  const str = `<style>.a{color: red!important;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red !important;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "07");
  t.end();
});

tap.test(`08 - inline CSS, missing space`, (t) => {
  const str = `<td style="color: red!important;">x</td>`;
  const fixed = `<td style="color: red !important;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "08");
  t.end();
});

tap.test(`09 - head CSS, tab as space`, (t) => {
  const str = `<style>.a{color: red\t!important;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red !important;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "09");
  t.end();
});

tap.test(`10 - inline CSS, tab as space`, (t) => {
  const str = `<td style="color: red\t!important;">x</td>`;
  const fixed = `<td style="color: red !important;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "10");
  t.end();
});

tap.test(`11 - head CSS, two spaces`, (t) => {
  const str = `<style>.a{color: red  !important;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red !important;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "11");
  t.end();
});

tap.test(`12 - inline CSS, two spaces`, (t) => {
  const str = `<td style="color: red  !important;">x</td>`;
  const fixed = `<td style="color: red !important;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "12");
  t.end();
});

tap.test(`13 - combo, HTML`, (t) => {
  const str = `<td style="color:\nred\r\t!important;">x</td>`;
  const fixed = `<td style="color: red !important;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "13");
  t.end();
});

tap.test(`14 - combo, Nunj`, (t) => {
  const str = `<td{% if foo %} style="color:red!important; text-align:\r\nleft;"{% endif %} align="left"></td>`;
  const fixed = `<td{% if foo %} style="color: red !important; text-align: left;"{% endif %} align="left"></td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "14");
  t.end();
});

// missing space after semi
// -----------------------------------------------------------------------------

tap.test(`15 - head CSS, missing`, (t) => {
  const str = `<style>.a{color: red;text-align: left;float: left;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red; text-align: left; float: left;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "15");
  t.end();
});

tap.test(`16 - inline CSS, missing`, (t) => {
  const str = `<td style="color: red;text-align: left;float: left;">x</td>`;
  const fixed = `<td style="color: red; text-align: left; float: left;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "16");
  t.end();
});

tap.test(`17 - head CSS, tab as a space`, (t) => {
  const str = `<style>.a{color: red;\ttext-align: left;\tfloat: left;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red; text-align: left; float: left;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "17");
  t.end();
});

tap.test(`18 - inline CSS, tab as a space`, (t) => {
  const str = `<td style="color: red;\ttext-align: left;\tfloat: left;">x</td>`;
  const fixed = `<td style="color: red; text-align: left; float: left;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "18");
  t.end();
});

tap.test(`19 - head CSS, copious whitespace`, (t) => {
  const str = `<style>.a{color: red;\r\n \t text-align: left;\t \t \t  float: left;}</style><body>a</body>`;
  const fixed = `<style>.a{color: red; text-align: left; float: left;}</style><body>a</body>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "19");
  t.end();
});

tap.test(`20 - inline CSS, copious whitespace`, (t) => {
  const str = `<td style="color: red;\r\n \t text-align: left; \t float: left;">x</td>`;
  const fixed = `<td style="color: red; text-align: left; float: left;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "20");
  t.end();
});

tap.test(`21 - comment as the first entry, excessive gap`, (t) => {
  const str = `<td style="/*color: red;*/  text-align: left; float: left;">x</td>`;
  const fixed = `<td style="/*color: red;*/ text-align: left; float: left;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "21");
  t.end();
});

tap.test(`22 - comment as the first entry, tight`, (t) => {
  const str = `<td style="/*color: red;*/text-align: left; float: left;">x</td>`;
  const fixed = `<td style="/*color: red;*/ text-align: left; float: left;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "22");
  t.end();
});

tap.test(`23 - comment as the first entry, tight`, (t) => {
  const str = `<td style="color: red;    /*text-align: left;*/     float: left;">x</td>`;
  const fixed = `<td style="color: red; /*text-align: left;*/ float: left;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "23");
  t.end();
});

tap.test(`24 - copiously spaced out ESP clause`, (t) => {
  const str = `<td style="color: red;    {% if so %}text-align: left;{% endif %}     float: left;">x</td>`;
  const fixed = `<td style="color: red; {% if so %}text-align: left;{% endif %} float: left;">x</td>`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "format-prettier": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "24");
  t.end();
});
