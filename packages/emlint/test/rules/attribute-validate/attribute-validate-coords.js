import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// eslint-disable-next-line no-unused-vars
import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no coords, error level 0`, () => {
  let str = `<area><a><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no coords, error level 1`, () => {
  let str = `<area><a><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no coords, error level 2`, () => {
  let str = `<area><a><div>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, area`, () => {
  let str = `<area shape="rect" coords="0,0,82,126" href="sun.html" alt="sun">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  equal(messages, [], "04.02");
});

test(`05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute, a`, () => {
  let str = `<a href="venus.htm" shape="circle" coords="124,58,8">Venus</a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

// 02. wrong parent tag
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`, () => {
  let str = `<div coords="50">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "06.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 5,
      idxTo: 16,
      fix: null,
    },
  ]);
});

test(`07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`, () => {
  let str = `<zzz coords="50" yyy>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  // can't fix:
  equal(applyFixes(str, messages), str, "07.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 5,
      idxTo: 16,
      fix: null,
    },
  ]);
});

// 03. area
// -----------------------------------------------------------------------------

test(`08 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rect, correct`, () => {
  let str = `<area shape="rect" coords="0,0,82,126" href="sun.htm" alt="Sun">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "08.01");
  equal(messages, [], "08.02");
});

test(`09 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rect, 1 coord`, () => {
  let str = `<area shape="rect" coords="0" href="sun.htm" alt="Sun">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "09.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 27,
      idxTo: 28,
      message: `There should be 4 values.`,
      fix: null,
    },
  ]);
});

test(`10 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rect, 3 coords`, () => {
  let str = `<area shape="rect" coords="0,82,126" href="sun.htm" alt="Sun">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 27,
      idxTo: 35,
      message: `There should be 4 values.`,
      fix: null,
    },
  ]);
});

test(`11 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rect, 5 coords`, () => {
  let str = `<area shape="rect" coords="0,0,0,82,126" href="sun.htm" alt="Sun">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 27,
      idxTo: 39,
      message: `There should be 4 values.`,
      fix: null,
    },
  ]);
});

test(`12 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - circle, correct`, () => {
  let str = `<area shape="circle" coords="124,58,8" href="venus.htm" alt="Venus">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "12.01");
  equal(messages, [], "12.02");
});

test(`13 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - circle, 1 coord`, () => {
  let str = `<area shape="circle" coords="124" href="venus.htm" alt="Venus">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "13.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 29,
      idxTo: 32,
      message: `There should be 3 values.`,
      fix: null,
    },
  ]);
});

test(`14 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - circle, 4 coords`, () => {
  let str = `<area shape="circle" coords="0,124,58,8" href="venus.htm" alt="Venus">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "14.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 29,
      idxTo: 39,
      message: `There should be 3 values.`,
      fix: null,
    },
  ]);
});

test(`15 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - poly, correct`, () => {
  let str = `<area shape="poly" coords="54,241,6,97,36,107,72,217"
          href="https://developer.mozilla.org/docs/Web/API"
          target="_blank" alt="Web APIs" />`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "15.01");
  equal(messages, [], "15.02");
});

test(`16 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - poly, uneven count`, () => {
  let str = `<area shape="poly" coords="54,241,6,97,36,107,72"
          href="https://developer.mozilla.org/docs/Web/API"
          target="_blank" alt="Web APIs" />`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "16.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 27,
      idxTo: 48,
      message: `Should be an even number of values but found 7.`,
      fix: null,
    },
  ]);
});

test(`17 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - poly, only one`, () => {
  let str = `<area shape="poly" coords="54"
          href="https://developer.mozilla.org/docs/Web/API"
          target="_blank" alt="Web APIs" />`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "17.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 27,
      idxTo: 29,
      message: `Should be an even number of values but found 1.`,
      fix: null,
    },
  ]);
});

test(`18 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rogue letter`, () => {
  let str = `<area shape="rect" coords="0,82a,126" href="sun.htm" alt="Sun">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "18.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 31,
      idxTo: 32,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

test(`19 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rogue space`, () => {
  let str = `<area shape="rect" coords="0,82 ,126" href="sun.htm" alt="Sun">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(
    applyFixes(str, messages),
    `<area shape="rect" coords="0,82,126" href="sun.htm" alt="Sun">`,
    "19.01"
  );
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 31,
      idxTo: 32,
      message: `Remove whitespace.`,
      fix: {
        ranges: [[31, 32]],
      },
    },
  ]);
});

test(`20 - ${`\u001b[${35}m${`area`}\u001b[${39}m`} - rogue space`, () => {
  let str = `<area shape="rect" coords="0,8.2,126" href="sun.htm" alt="Sun">`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "20.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 30,
      idxTo: 32,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
});

// 04. a
// -----------------------------------------------------------------------------

test(`21 - ${`\u001b[${33}m${`a`}\u001b[${39}m`} - a right value`, () => {
  let str = `<a href="sun.htm" shape="rect" coords="0,0,82,126">The Sun</a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "21.01");
  equal(messages, [], "21.02");
});

test(`22 - ${`\u001b[${33}m${`a`}\u001b[${39}m`} - circle, two values`, () => {
  let str = `<a href="venus.htm" shape="circle" coords="124,58">Venus</a>`;
  let linter = new Linter();
  let messages = linter.verify(str, {
    rules: {
      "attribute-validate-coords": 2,
    },
  });
  equal(applyFixes(str, messages), str, "22.01");
  compare(ok, messages, [
    {
      ruleId: "attribute-validate-coords",
      idxFrom: 43,
      idxTo: 49,
      message: `There should be 3 values.`,
      fix: null,
    },
  ]);
});

test.run();
