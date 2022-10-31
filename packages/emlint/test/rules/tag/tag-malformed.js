import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";

// opening bracket missing
// -----------------------------------------------------------------------------

test(`01 - opening bracket missing`, () => {
  let str = `<div>div class="x">`;
  let fixed = `<div><div class="x">`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "01.01");
  equal(messages.length, 1, "01.02");
});

test(`02 - tag - space - missing bracket`, () => {
  let str = `<div> div class="x">`;
  let fixed = `<div> <div class="x">`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "02.01");
  equal(messages.length, 1, "02.02");
});

test(`03 - tag - line break - missing bracket`, () => {
  let str = `<div>\n\ndiv class="x">`;
  let fixed = `<div>\n\n<div class="x">`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "03.01");
  equal(messages.length, 1, "03.02");
});

test(`04 - two tags, tight`, () => {
  let str = `<div class=""div class="x">`;
  let fixed = `<div class=""><div class="x">`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "04.01");
});

test(`05 - two tags, spaced`, () => {
  let str = `<div class="" div class="x">`;
  let fixed = `<div class=""> <div class="x">`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "05.01");
});

test(`06 - two tags, attr`, () => {
  let str = `<div class="z" div class="x">`;
  let fixed = `<div class="z"> <div class="x">`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "06.01");
});

test(`07 - malformed closing tag, recognised`, () => {
  let str = `<div>some text /div>`;
  let fixed = `<div>some text </div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "07.01");
});

test(`08 - malformed closing tag, unrecognised`, () => {
  let str = `<div>some text /yo>`;
  let fixed = `<div>some text </yo>`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "08.01");
});

// closing bracket missing
// -----------------------------------------------------------------------------

test(`09 - position of a missing bracket is on EOL`, () => {
  let str = `<div`;
  let fixed = `<div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "09.01");
  equal(messages.length, 1, "09.02");
});

test(`10 - position of a missing bracket is on EOL`, () => {
  let str = `<div></div`;
  let fixed = `<div></div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "10.01");
  equal(messages.length, 1, "10.02");
});

test(`11 - attrs`, () => {
  let str = `<div class="z"`;
  let fixed = `<div class="z">`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "11.01");
  equal(messages.length, 1, "11.02");
});

test(`12 - attrs, trailing whitespace`, () => {
  let str = `<div class="z"   `;
  let fixed = `<div class="z">   `;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "12.01");
  equal(messages.length, 1, "12.02");
});

test(`13 - position of a missing bracket is on a new opening bracket`, () => {
  let str = `<div></div<div>`;
  let fixed = `<div></div><div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "13.01");
  equal(messages.length, 1, "13.02");
});

test(`14 - position of a missing bracket is on a new opening bracket`, () => {
  let str = `<div></div\n<div>`;
  let fixed = `<div></div>\n<div>`;
  let messages = verify(not, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "14.01");
  equal(messages.length, 1, "14.02");
});

test.run();
