import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// 00. false positives
// -----------------------------------------------------------------------------

tap.test(`01 - not a style, inline`, (t) => {
  const str = `<img alt="color: red">`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "01.01");
  t.strictSame(messages, [], "01.02");
  t.end();
});

tap.test(`02 - not a style, head`, (t) => {
  const str = `<span>a{color: red}`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "02.01");
  t.strictSame(messages, [], "02.02");
  t.end();
});

// always
// -----------------------------------------------------------------------------

tap.test(`03 - one style, always`, (t) => {
  const str = `<style>.a{color:red}</style><body style="color:red">a</body>`;
  const fixed = `<style>.a{color:red;}</style><body style="color:red;">a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 19,
        fix: {
          ranges: [[19, 19, ";"]],
        },
      },
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 41,
        idxTo: 50,
        fix: {
          ranges: [[50, 50, ";"]],
        },
      },
    ],
    "03.02"
  );
  t.end();
});

tap.test(`04 - one style, always, spaced important`, (t) => {
  const str = `<style>.a{color: red !important}</style><body style="color: red !important">a</body>`;
  const fixed = `<style>.a{color: red !important;}</style><body style="color: red !important;">a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 31,
        fix: {
          ranges: [[31, 31, ";"]],
        },
      },
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 53,
        idxTo: 74,
        fix: {
          ranges: [[74, 74, ";"]],
        },
      },
    ],
    "04.01"
  );
  t.equal(applyFixes(str, messages), fixed, "04.02");
  t.end();
});

tap.test(`05 - one style, always, tight important`, (t) => {
  const str = `<style>.a{color:red!important}</style><body style="color:red!important">a</body>`;
  const fixed = `<style>.a{color:red!important;}</style><body style="color:red!important;">a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05");
  t.end();
});

tap.test(`06 - one style, always, inner whitespace`, (t) => {
  const str = `<style>.a{color:red }</style><body>a</body>`;
  const fixed = `<style>.a{color:red; }</style><body>a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [1, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "06.01");
  t.match(
    messages,
    [
      {
        severity: 1,
        ruleId: "css-trailing-semi",
        message: "Add a semicolon.",
        idxFrom: 10,
        idxTo: 19,
        fix: {
          ranges: [[19, 19, ";"]],
        },
      },
    ],
    "06.02"
  );
  t.end();
});

tap.test(`07 - two styles, always`, (t) => {
  const str = `<style>.a{text-align:left; color:red}</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left; color:red;}</style><body>a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "07");
  t.end();
});

tap.test(`08 - two styles with space, always`, (t) => {
  const str = `<style>.a{text-align:left; color:red }</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left; color:red; }</style><body>a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "08");
  t.end();
});

tap.test(`09 - two styles, default=always`, (t) => {
  const str = `<style>.a{text-align:left; color:red\n}</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left; color:red;\n}</style><body>a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "09");
  t.end();
});

tap.test(`10 - nothing to fix`, (t) => {
  const str = `<style>.a{\ntext-align:left;\ncolor:red;\n}</style><body>a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), str, "10.01");
  t.strictSame(messages, [], "10.02");
  t.end();
});

// never
// -----------------------------------------------------------------------------

tap.test(`11 - one style, never`, (t) => {
  const str = `<style>.a{color:red;}</style><body>a</body>`;
  const fixed = `<style>.a{color:red}</style><body>a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "11.01");
  t.match(
    messages,
    [
      {
        severity: 2,
        ruleId: "css-trailing-semi",
        message: "Remove the semicolon.",
        idxFrom: 10,
        idxTo: 20,
        fix: {
          ranges: [[19, 20]],
        },
      },
    ],
    "11.02"
  );
  t.end();
});

tap.test(`12 - two styles, never`, (t) => {
  const str = `<style>.a{text-align:left;color:red;}</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left;color:red}</style><body>a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "12");
  t.end();
});

tap.test(`13 - two styles, never, trailing whitespace`, (t) => {
  const str = `<style>.a{text-align:left;color:red; }</style><body>a</body>`;
  const fixed = `<style>.a{text-align:left;color:red }</style><body>a</body>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "never"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "13");
  t.end();
});

// ESP tags
//
// -----------------------------------------------------------------------------

tap.test(`14 - wrapped with Nunjucks IF`, (t) => {
  const str = `<td{% if foo %} style="color:red"{% endif %}>`;
  const fixed = `<td{% if foo %} style="color:red;"{% endif %}>`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "14");
  t.end();
});

tap.test(`15`, (t) => {
  const str = `<td{% if foo %} style="color:red"{% endif %} align="left">`;
  const fixed = `<td{% if foo %} style="color:red;"{% endif %} align="left">`;
  const messages = verify(t, str, {
    rules: {
      "css-trailing-semi": [2, "always"],
    },
  });
  t.equal(applyFixes(str, messages), fixed, "15");
  t.end();
});
