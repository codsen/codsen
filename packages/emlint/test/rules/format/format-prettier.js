import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains";

// missing space after a colon
// -----------------------------------------------------------------------------

test(`01 - head CSS, missing space`, () => {
  let str = `<style>.a{color:red;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "01.01");
});

test(`02 - inline CSS, missing space`, () => {
  let str = `<td style="color:red;">x</td>`;
  let fixed = `<td style="color: red;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "02.01");
});

test(`03 - head CSS, tab as space`, () => {
  let str = `<style>.a{color:\tred;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "03.01");
});

test(`04 - inline CSS, tab as space`, () => {
  let str = `<td style="color:\tred;">x</td>`;
  let fixed = `<td style="color: red;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "04.01");
});

test(`05 - head CSS, two spaces`, () => {
  let str = `<style>.a{color:  red;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "05.01");
});

test(`06 - inline CSS, two spaces`, () => {
  let str = `<td style="color:  red;">x</td>`;
  let fixed = `<td style="color: red;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "06.01");
});

// missing space in after an !important
// -----------------------------------------------------------------------------

test(`07 - head CSS, missing space`, () => {
  let str = `<style>.a{color: red!important;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red !important;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "07.01");
});

test(`08 - inline CSS, missing space`, () => {
  let str = `<td style="color: red!important;">x</td>`;
  let fixed = `<td style="color: red !important;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "08.01");
});

test(`09 - head CSS, tab as space`, () => {
  let str = `<style>.a{color: red\t!important;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red !important;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "09.01");
});

test(`10 - inline CSS, tab as space`, () => {
  let str = `<td style="color: red\t!important;">x</td>`;
  let fixed = `<td style="color: red !important;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "10.01");
});

test(`11 - head CSS, two spaces`, () => {
  let str = `<style>.a{color: red  !important;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red !important;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "11.01");
});

test(`12 - inline CSS, two spaces`, () => {
  let str = `<td style="color: red  !important;">x</td>`;
  let fixed = `<td style="color: red !important;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "12.01");
});

test(`13 - combo, HTML`, () => {
  let str = `<td style="color:\nred\r\t!important;">x</td>`;
  let fixed = `<td style="color: red !important;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "13.01");
});

test(`14 - combo, Nunj`, () => {
  let str = `<td{% if foo %} style="color:red!important; text-align:\r\nleft;"{% endif %} align="left"></td>`;
  let fixed = `<td{% if foo %} style="color: red !important; text-align: left;"{% endif %} align="left"></td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "14.01");
});

// missing space after semi
// -----------------------------------------------------------------------------

test(`15 - head CSS, missing`, () => {
  let str = `<style>.a{color: red;text-align: left;float: left;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red; text-align: left; float: left;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "15.01");
});

test(`16 - inline CSS, missing`, () => {
  let str = `<td style="color: red;text-align: left;float: left;">x</td>`;
  let fixed = `<td style="color: red; text-align: left; float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "16.01");
});

test(`17 - head CSS, tab as a space`, () => {
  let str = `<style>.a{color: red;\ttext-align: left;\tfloat: left;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red; text-align: left; float: left;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "17.01");
});

test(`18 - inline CSS, tab as a space`, () => {
  let str = `<td style="color: red;\ttext-align: left;\tfloat: left;">x</td>`;
  let fixed = `<td style="color: red; text-align: left; float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "18.01");
});

test(`19 - head CSS, copious whitespace`, () => {
  let str = `<style>.a{color: red;\r\n \t text-align: left;\t \t \t  float: left;}</style><body>a</body>`;
  let fixed = `<style>.a{color: red; text-align: left; float: left;}</style><body>a</body>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "19.01");
});

test(`20 - inline CSS, copious whitespace`, () => {
  let str = `<td style="color: red;\r\n \t text-align: left; \t float: left;">x</td>`;
  let fixed = `<td style="color: red; text-align: left; float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "20.01");
});

test(`21 - comment as the first entry, excessive gap`, () => {
  let str = `<td style="/*color: red;*/  text-align: left; float: left;">x</td>`;
  let fixed = `<td style="/*color: red;*/ text-align: left; float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "21.01");
});

test(`22 - comment as the first entry, tight`, () => {
  let str = `<td style="/*color: red;*/text-align: left; float: left;">x</td>`;
  let fixed = `<td style="/*color: red;*/ text-align: left; float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "22.01");
});

test(`23 - comment as the first entry, tight`, () => {
  let str = `<td style="color: red;    /*text-align: left;*/     float: left;">x</td>`;
  let fixed = `<td style="color: red; /*text-align: left;*/ float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "23.01");
});

test(`24 - copiously spaced out ESP clause`, () => {
  let str = `<td style="color: red;    {% if so %}text-align: left;{% endif %}     float: left;">x</td>`;
  let fixed = `<td style="color: red; {% if so %}text-align: left;{% endif %} float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "24.01");
});

test(`25`, () => {
  let str = `<td style="color: red;
    {% if so %}text-align: left;{% endif %}
float: left;">x</td>`;
  let messages = verify(not, str, {
    rules: {
      "format-prettier": 2,
    },
  });
  equal(applyFixes(str, messages), str, "25.01");
});

test.run();
