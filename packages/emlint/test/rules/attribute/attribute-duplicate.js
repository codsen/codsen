import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// 00. false positives
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - one class each`, () => {
  let str = `<td class="z"><a class="z">z</a>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - duplicate but rule disabled`, () => {
  let str = `<td class="x" class="y"><a class="z" class="yo">z</a>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 0,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - unrecognised attr duplicated, rule disabled`, () => {
  let str = `<td yo="z" yo="tralalaa"><a mo="z" mo="haha">z</a>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 0,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - value-less attributes repeated`, () => {
  let str = `<td nowrap nowrap><a class="z">z</a>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 0,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`false positives`}\u001b[${39}m`} - duplicate undefined`, () => {
  let str = `<td{% if foo %} style="color:red;"{% endif %} align="left"></td>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 01. checks
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - off`, () => {
  let str = `<a class="bb" id="cc" class="dd">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 0,
    },
  });
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages, [], "06.02");
});

test(`07 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - class merged`, () => {
  let str = `<a class="bb" id="bb" class="dd">`;
  let fixed = `<a class="bb dd" id="bb">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // can fix, classes will be merged:
  equal(applyFixes(str, messages), fixed, "07.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-duplicate",
        idxFrom: 0,
        idxTo: 33,
        message: `Duplicate attribute "class".`,
      },
    ],
    "07.02"
  );
});

test(`08 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - id merged`, () => {
  let str = `<a class="cc" id="ee" id="dd" style="id" id="ff">`;
  let fixed = `<a class="cc" id="dd ee ff" style="id">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // can fix, classes will be merged:
  equal(applyFixes(str, messages), fixed, "08.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-duplicate",
        idxFrom: 0,
        idxTo: 49,
        message: `Duplicate attribute "id".`,
      },
    ],
    "08.02"
  );
});

test(`09 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - on`, () => {
  let str = `<a href="bb" href="bb" href="dd">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // can't fix "href":
  equal(applyFixes(str, messages), str, "09.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-duplicate", // second and onwards is reported, not first
        idxFrom: 13,
        idxTo: 22,
        message: `Duplicate attribute "href".`,
        fix: null,
      },
      {
        ruleId: "attribute-duplicate",
        idxFrom: 23,
        idxTo: 32,
        message: `Duplicate attribute "href".`,
        fix: null,
      },
    ],
    "09.02"
  );
});

test(`10 - ${`\u001b[${33}m${`checks`}\u001b[${39}m`} - unrecognised attr duplicated, rule disabled`, () => {
  let str = `<td yo="z" yo="tralalaa"><a mo="z" mo="haha">z</a>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-duplicate",
        idxFrom: 11,
        idxTo: 24,
        message: `Duplicate attribute "yo".`,
        fix: null,
      },
      {
        ruleId: "attribute-duplicate",
        idxFrom: 35,
        idxTo: 44,
        message: `Duplicate attribute "mo".`,
        fix: null,
      },
    ],
    "10.02"
  );
});

// 02. merging values
// -----------------------------------------------------------------------------

test(`11 - on`, () => {
  let str = `<a class="" class=" ll  \t nn " class="" class=" mm  kk  " id="" class="oo" id="uu" class="">`;
  let fixed = `<a class="kk ll mm nn oo" id="uu">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "11");
});

test(`12 - first one is dodgy`, () => {
  let str = `<a class= class=" aa " class="" class=" bb  " class="cc"  class="">`;
  let fixed = `<a class="aa bb cc">`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "12");
});

test(`13 - merging empty`, () => {
  let str = `<a class= class="  " class="" class=" \t\t  " class=" "  class="">`;
  let fixed = `<a>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "13");
});

test(`14 - merging dodgy, no closing slash`, () => {
  let str = `<a class= class= class="" class= class""  >`;
  let fixed = `<a>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "14");
});

test(`15 - merging dodgy, with closing slash`, () => {
  let str = `<br class= class= class="" class= class""  />`;
  let fixed = `<br/>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), fixed, "15");
});

test(`16 - dodgy values with quotes`, () => {
  let str = `<img class="someone's" class='jar of "cookies"'  >`;
  let messages = verify(not, str, {
    rules: {
      "attribute-duplicate": 2,
    },
  });
  // there were some errors raised:
  ok(messages.length, "16.01");
  // but won't fix:
  equal(applyFixes(str, messages), str, "16.02");
});

test.run();
