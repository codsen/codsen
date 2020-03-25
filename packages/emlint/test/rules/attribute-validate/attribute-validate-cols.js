const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cols, error level 0`,
  (t) => {
    const str = `<frameset><textarea><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 0,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cols, error level 1`,
  (t) => {
    const str = `<frameset><textarea><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 1,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no cols, error level 2`,
  (t) => {
    const str = `<frameset><textarea><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<frameset cols="23%,*,45%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<textarea rows="4" cols="50">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div cols="50">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 5,
        idxTo: 14,
        message: `Tag "div" can't have this attribute.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz cols="50" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 5,
        idxTo: 14,
        message: `Tag "zzz" can't have this attribute.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 03. frameset
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, single px value, no units`,
  (t) => {
    const str = `<frameset cols="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, single px value, with units`,
  (t) => {
    const str = `<frameset cols="100px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frameset cols="100">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 19,
        idxTo: 21,
        message: `Remove px.`,
        fix: {
          ranges: [[19, 21]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, perc, one`,
  (t) => {
    const str = `<frameset cols="100%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, perc, two`,
  (t) => {
    const str = `<frameset cols="50.5%,49.5%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, perc, two`,
  (t) => {
    const str = `<frameset cols="50%, 50%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frameset cols="50%,50%">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 20,
        idxTo: 21,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[20, 21]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.06 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - asterisk`,
  (t) => {
    const str = `<frameset cols="*">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `03.07 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - value and asterisk`,
  (t) => {
    const str = `<frameset cols="30%,*,20%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(`03.08 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - mixed`, (t) => {
  const str = `<frameset cols="30,*,20%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-cols": 2,
    },
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(
  `03.09 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - one wrong value`,
  (t) => {
    const str = `<frameset cols="zzz">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 16,
        idxTo: 19,
        message: `Should be: pixels|%|*.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.10 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - one wrong value`,
  (t) => {
    const str = `<frameset cols="*,zzz">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 18,
        idxTo: 21,
        message: `Should be: pixels|%|*.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.11 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - one wrong value`,
  (t) => {
    const str = `<frameset cols="*,zzz,100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 18,
        idxTo: 21,
        message: `Should be: pixels|%|*.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.12 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - two wrong values, with whitespace`,
  (t) => {
    const str = `<frameset cols=" *, zzz ,100,  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix all but will fix some:
    t.equal(applyFixes(str, messages), `<frameset cols="*,zzz,100">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 16,
        idxTo: 31,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [16, 17],
            [29, 31],
          ],
        },
      },
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 19,
        idxTo: 20,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[19, 20]],
        },
      },
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 20,
        idxTo: 23,
        message: `Should be: pixels|%|*.`,
        fix: null,
      },
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 23,
        idxTo: 24,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[23, 24]],
        },
      },
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 28,
        idxTo: 29,
        message: `Remove separator.`,
        fix: {
          ranges: [[28, 29]],
        },
      },
    ]);
    t.end();
  }
);

t.test(
  `03.13 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - one wrong value`,
  (t) => {
    const str = `<frameset cols="9rem">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 17,
        idxTo: 20,
        message: `Should be: pixels|%|*.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.14 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - two asterisks`,
  (t) => {
    const str = `<frameset cols="**">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 16,
        idxTo: 18,
        message: `Should be: pixels|%|*.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `03.15 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - two asterisks`,
  (t) => {
    const str = `<frameset cols="******">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 16,
        idxTo: 22,
        message: `Should be: pixels|%|*.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

// 04. textarea
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - right value`,
  (t) => {
    const str = `<textarea cols="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - right value`,
  (t) => {
    const str = `<textarea cols="10">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - right value, whitespace`,
  (t) => {
    const str = `<textarea cols=" 10 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<textarea cols="10">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 16,
        idxTo: 20,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [16, 17],
            [19, 20],
          ],
        },
      },
    ]);
    t.end();
  }
);

t.test(`04.04 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - units`, (t) => {
  const str = `<textarea cols="100%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-cols": 2,
    },
  });
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-cols",
      idxFrom: 19,
      idxTo: 20,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(`04.05 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - units`, (t) => {
  const str = `<textarea cols="z">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-cols": 2,
    },
  });
  t.equal(applyFixes(str, messages), str);
  t.match(messages, [
    {
      ruleId: "attribute-validate-cols",
      idxFrom: 16,
      idxTo: 17,
      message: `Should be integer, no units.`,
      fix: null,
    },
  ]);
  t.end();
});

t.test(
  `04.06 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - missing value`,
  (t) => {
    const str = `<textarea cols="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 16,
        idxTo: 16,
        message: `Missing value.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - rational number`,
  (t) => {
    const str = `<textarea cols="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 17,
        idxTo: 19,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - rational number`,
  (t) => {
    const str = `<textarea cols="1rem">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 17,
        idxTo: 20,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);

t.test(
  `04.09 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - negative number`,
  (t) => {
    const str = `<textarea cols="-1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-cols": 2,
      },
    });
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-cols",
        idxFrom: 16,
        idxTo: 18,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ]);
    t.end();
  }
);
