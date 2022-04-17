import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 0`, () => {
  let str = `<head><form>`; // <---- deliberately a tag names of both kinds, suitable and unsuitable
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 1`, () => {
  let str = `<head><form>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no profile, error level 2`, () => {
  let str = `<head><form>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, one URI`, () => {
  let str = `<head profile="https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, two URI's`, () => {
  let str = `<head profile="https://codsen.com https://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div profile='https://codsen.com'>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 5,
      idxTo: 33,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz profile="https://codsen.com" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 5,
      idxTo: 33,
      fix: null,
    },
  ]);
});

// 03. wrong value
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - two non-URI's`, () => {
  let str = `<head profile="z?? y??">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "08.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 15,
      idxTo: 18,
      message: `Should be an URI.`,
      fix: null,
    },
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 19,
      idxTo: 22,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`09 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - still catches whitespace on legit URL`, () => {
  let str = `<head profile=" https://codsen.com">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  equal(applyFixes(str, messages), `<head profile="https://codsen.com">`);
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 15,
      idxTo: 16,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[15, 16]],
      },
    },
  ]);
});

test(`10 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`, () => {
  // notice wrong tag name case:
  let str = `<HEAD profile=" abc?? ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), `<head profile="abc??">`, "10.01");
  compare(ok, messages, [
    {
      ruleId: "tag-name-case",
      idxFrom: 1,
      idxTo: 5,
      message: `Bad tag name case.`,
      fix: {
        ranges: [[1, 5, "head"]],
      },
    },
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 15,
      idxTo: 22,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [15, 16],
          [21, 22],
        ],
      },
    },
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 16,
      idxTo: 21,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - not-a-URL and whitespace`, () => {
  // notice wrong tag name case:
  let str = `<HEAD profile=" abc. \tdef. ">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
      "tag-name-case": 2,
    },
  });
  equal(applyFixes(str, messages), `<head profile="abc. def.">`, "11.01");
  compare(ok, messages, [
    {
      ruleId: "tag-name-case",
      idxFrom: 1,
      idxTo: 5,
      message: `Bad tag name case.`,
      fix: {
        ranges: [[1, 5, "head"]],
      },
    },
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 15,
      idxTo: 27,
      message: `Remove whitespace.`,
      fix: {
        ranges: [
          [15, 16],
          [26, 27],
        ],
      },
    },
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 16,
      idxTo: 20,
      message: `Should be an URI.`,
      fix: null,
    },
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 20,
      idxTo: 22,
      message: `Should be a single space.`,
      fix: {
        ranges: [[21, 22]],
      },
    },
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 22,
      idxTo: 26,
      message: `Should be an URI.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - first space retained`, () => {
  let str = `<head profile="https://codsen.com \t\t https://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  // will fix:
  equal(
    applyFixes(str, messages),
    `<head profile="https://codsen.com https://detergent.io">`
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 33,
      idxTo: 37,
      message: `Should be a single space.`,
      fix: {
        ranges: [[34, 37]], // <---- notice we keep space at index 33
      },
    },
  ]);
});

test(`13 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - last space retained`, () => {
  let str = `<head profile="https://codsen.com\t\t\t https://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  // will fix:
  equal(
    applyFixes(str, messages),
    `<head profile="https://codsen.com https://detergent.io">`
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 33,
      idxTo: 37,
      message: `Should be a single space.`,
      fix: {
        ranges: [[33, 36]], // <---- notice we keep space at index 36
      },
    },
  ]);
});

test(`14 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - bad separator - all tabs`, () => {
  let str = `<head profile="https://codsen.com\t\t\t\thttps://detergent.io">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-profile": 2,
    },
  });
  // will fix:
  equal(
    applyFixes(str, messages),
    `<head profile="https://codsen.com https://detergent.io">`
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-profile",
      idxFrom: 33,
      idxTo: 37,
      message: `Should be a single space.`,
      fix: {
        ranges: [[33, 37, " "]], // <---- we need intervention here, replacing whole thing with a space
      },
    },
  ]);
});

test.run();
