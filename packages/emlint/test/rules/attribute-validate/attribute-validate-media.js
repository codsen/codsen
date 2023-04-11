import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no media, error level 0`, () => {
  let str = "<html><style>"; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-media": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no media, error level 1`, () => {
  let str = "<html><style>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-media": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - no media, error level 2`, () => {
  let str = "<html><style>";
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-media": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${"validation"}\u001b[${39}m`} - healthy attribute`, () => {
  let healthyValues = [
    "all",
    "aural",
    "braille",
    "embossed",
    "handheld",
    "print",
    "projection",
    "screen",
    "speech",
    "tty",
    "tv",
  ];
  let linter = new Linter();
  healthyValues.forEach((healthyValue) => {
    let str = `<style media="${healthyValue}">`;
    let messages = linter.verify(str, {
      rules: {
        "attribute-validate-media": 2,
      },
    });
    equal(applyFixes(str, messages), str);
    equal(messages, []);
  });
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<div media="screen">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-media": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "05.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-media",
      idxFrom: 5,
      idxTo: 19,
      fix: null,
    },
  ]);
});

test(`06 - ${`\u001b[${35}m${"parent"}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = '<zzz media="screen" yyy>';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-media": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-media",
      idxFrom: 5,
      idxTo: 19,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`07 - ${`\u001b[${34}m${"value"}\u001b[${39}m`} - recognised tag`, () => {
  let str = '<style media="screeen">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-media": 2,
    },
  });
  // will fix:
  equal(applyFixes(str, messages), '<style media="screen">', "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-media",
      idxFrom: 14,
      idxTo: 21,
      message: 'Did you mean "screen"?',
      fix: {
        ranges: [[14, 21, "screen"]],
      },
    },
  ]);
});

test(`08 - ${`\u001b[${34}m${"value"}\u001b[${39}m`} - still catches whitespace on legit`, () => {
  let str = '<style media=" screen">';
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-media": 2,
    },
  });
  equal(applyFixes(str, messages), '<style media="screen">', "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-media",
      idxFrom: 14,
      idxTo: 15,
      message: "Remove whitespace.",
      fix: {
        ranges: [[14, 15]],
      },
    },
  ]);
});

test.run();
