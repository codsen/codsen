import tap from "tap";
import { Linter } from "../../../dist/emlint.esm.js";
import { applyFixes } from "../../../t-util/util.js";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rows, error level 0`,
  (t) => {
    const str = `<frameset><textarea><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rows, error level 1`,
  (t) => {
    const str = `<frameset><textarea><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no rows, error level 2`,
  (t) => {
    const str = `<frameset><textarea><div>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<frameset rows="23%,*,45%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy attribute`,
  (t) => {
    const str = `<textarea rows="4" rows="50">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

// 02. wrong parent tag
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - recognised tag`,
  (t) => {
    const str = `<div rows="50">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "06.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 5,
          idxTo: 14,
          fix: null,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`parent`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const str = `<zzz rows="50" yyy>`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "07.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 5,
          idxTo: 14,
          fix: null,
        },
      ],
      "07.02"
    );
    t.end();
  }
);

// 03. frameset
// -----------------------------------------------------------------------------

tap.test(
  `08 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, single px value, no units`,
  (t) => {
    const str = `<frameset rows="100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "08.01");
    t.strictSame(messages, [], "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, single px value, with units`,
  (t) => {
    const str = `<frameset rows="100px">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frameset rows="100">`, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 19,
          idxTo: 21,
          message: `Remove px.`,
          fix: {
            ranges: [[19, 21]],
          },
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, perc, one`,
  (t) => {
    const str = `<frameset rows="100%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "10.01");
    t.strictSame(messages, [], "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, perc, two`,
  (t) => {
    const str = `<frameset rows="50.5%,49.5%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "11.01");
    t.strictSame(messages, [], "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - right value, perc, two`,
  (t) => {
    const str = `<frameset rows="50%, 50%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<frameset rows="50%,50%">`, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 20,
          idxTo: 21,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[20, 21]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - asterisk`,
  (t) => {
    const str = `<frameset rows="*">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "13.01");
    t.strictSame(messages, [], "13.02");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - value and asterisk`,
  (t) => {
    const str = `<frameset rows="30%,*,20%">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "14.01");
    t.strictSame(messages, [], "14.02");
    t.end();
  }
);

tap.test(`15 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - mixed`, (t) => {
  const str = `<frameset rows="30,*,20%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "15.01");
  t.strictSame(messages, [], "15.02");
  t.end();
});

tap.test(
  `16 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - one wrong value`,
  (t) => {
    const str = `<frameset rows="zzz">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 16,
          idxTo: 19,
          message: `Should be: pixels|%|*.`,
          fix: null,
        },
      ],
      "16.02"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - one wrong value`,
  (t) => {
    const str = `<frameset rows="*,zzz">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 18,
          idxTo: 21,
          message: `Should be: pixels|%|*.`,
          fix: null,
        },
      ],
      "17.02"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - one wrong value`,
  (t) => {
    const str = `<frameset rows="*,zzz,100">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 18,
          idxTo: 21,
          message: `Should be: pixels|%|*.`,
          fix: null,
        },
      ],
      "18.02"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - two wrong values, with whitespace`,
  (t) => {
    const str = `<frameset rows=" *, zzz ,100,  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix all but will fix some:
    t.equal(applyFixes(str, messages), `<frameset rows="*,zzz,100">`, "19.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
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
          ruleId: "attribute-validate-rows",
          idxFrom: 19,
          idxTo: 20,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[19, 20]],
          },
        },
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 20,
          idxTo: 23,
          message: `Should be: pixels|%|*.`,
          fix: null,
        },
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 23,
          idxTo: 24,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[23, 24]],
          },
        },
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 28,
          idxTo: 29,
          message: `Remove separator.`,
          fix: {
            ranges: [[28, 29]],
          },
        },
      ],
      "19.02"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - one wrong value`,
  (t) => {
    const str = `<frameset rows="9rem">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "20.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 17,
          idxTo: 20,
          message: `Should be: pixels|%|*.`,
          fix: null,
        },
      ],
      "20.02"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - two asterisks`,
  (t) => {
    const str = `<frameset rows="**">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "21.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 16,
          idxTo: 18,
          message: `Should be: pixels|%|*.`,
          fix: null,
        },
      ],
      "21.02"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${35}m${`frameset`}\u001b[${39}m`} - two asterisks`,
  (t) => {
    const str = `<frameset rows="******">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "22.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 16,
          idxTo: 22,
          message: `Should be: pixels|%|*.`,
          fix: null,
        },
      ],
      "22.02"
    );
    t.end();
  }
);

// 04. textarea
// -----------------------------------------------------------------------------

tap.test(
  `23 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - right value`,
  (t) => {
    const str = `<textarea rows="0">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "23.01");
    t.strictSame(messages, [], "23.02");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - right value`,
  (t) => {
    const str = `<textarea rows="10">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "24.01");
    t.strictSame(messages, [], "24.02");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - right value, whitespace`,
  (t) => {
    const str = `<textarea rows=" 10 ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), `<textarea rows="10">`, "25.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
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
      ],
      "25.02"
    );
    t.end();
  }
);

tap.test(`26 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - units`, (t) => {
  const str = `<textarea rows="100%">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "26.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-rows",
        idxFrom: 19,
        idxTo: 20,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ],
    "26.02"
  );
  t.end();
});

tap.test(`27 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - units`, (t) => {
  const str = `<textarea rows="z">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-rows": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "27.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-validate-rows",
        idxFrom: 16,
        idxTo: 17,
        message: `Should be integer, no units.`,
        fix: null,
      },
    ],
    "27.02"
  );
  t.end();
});

tap.test(
  `28 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - missing value`,
  (t) => {
    const str = `<textarea rows="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "28.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 10,
          idxTo: 17,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "28.02"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - rational number`,
  (t) => {
    const str = `<textarea rows="1.5">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "29.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 17,
          idxTo: 19,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "29.02"
    );
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - rational number`,
  (t) => {
    const str = `<textarea rows="1rem">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "30.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 17,
          idxTo: 20,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "30.02"
    );
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${33}m${`textarea`}\u001b[${39}m`} - negative number`,
  (t) => {
    const str = `<textarea rows="-1">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-rows": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "31.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-rows",
          idxFrom: 16,
          idxTo: 18,
          message: `Should be integer, no units.`,
          fix: null,
        },
      ],
      "31.02"
    );
    t.end();
  }
);
