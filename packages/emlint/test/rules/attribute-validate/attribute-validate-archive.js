import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. validation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 0`,
  (t) => {
    [`<applet>`, `<object>`].forEach((tag) => {
      const linter = new Linter();
      const messages = linter.verify(tag, {
        rules: {
          "attribute-validate-archive": 0,
        },
      });
      t.equal(applyFixes(tag, messages), tag);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 1`,
  (t) => {
    [`<applet>`, `<object>`].forEach((tag) => {
      const linter = new Linter();
      const messages = linter.verify(tag, {
        rules: {
          "attribute-validate-archive": 1,
        },
      });
      t.equal(applyFixes(tag, messages), tag);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 2`,
  (t) => {
    [`<applet>`, `<object>`].forEach((tag) => {
      const linter = new Linter();
      const messages = linter.verify(tag, {
        rules: {
          "attribute-validate-archive": 2,
        },
      });
      t.equal(applyFixes(tag, messages), tag);
      t.strictSame(messages, []);
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy archive, applet`,
  (t) => {
    const str = `<applet class='zz' archive='https://codsen.com,https://detergent.io' id='yy aa'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.strictSame(messages, [], "04.02");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy archive, object`,
  (t) => {
    const str = `<object class='zz' archive='https://codsen.com https://detergent.io' id='yy aa'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  (t) => {
    const str = `<applet archive=" https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<applet archive="https://codsen.com">`,
      "06.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 17,
          idxTo: 18,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[17, 18]],
          },
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  (t) => {
    const str = `<applet archive="https://codsen.com ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<applet archive="https://codsen.com">`,
      "07.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 35,
          idxTo: 36,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[35, 36]],
          },
        },
      ],
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - 6 digit object`,
  (t) => {
    const str = `<applet archive="  https://codsen.com  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    t.equal(
      applyFixes(str, messages),
      `<applet archive="https://codsen.com">`,
      "08.01"
    );
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 17,
          idxTo: 39,
          message: `Remove whitespace.`,
          fix: {
            ranges: [
              [17, 19],
              [37, 39],
            ],
          },
        },
      ],
      "08.02"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  (t) => {
    const str = `<applet archive="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 17,
          idxTo: 20,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`,
  (t) => {
    const str = `<applet archive="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 17,
          idxTo: 17,
          message: `Missing value.`,
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 03. applet tag
// -----------------------------------------------------------------------------

tap.test(`11 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - healthy`, (t) => {
  const str = `<applet class='zz' archive='http://codsen.com,https://detergent.io' id='yy aa'>`; // <-- notice single quotes
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "11.01");
  t.strictSame(messages, [], "11.02");
  t.end();
});

tap.test(
  `12 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - one unrecognised`,
  (t) => {
    const str = `<applet archive="http://codsen.com,trala..">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "12.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 35,
          idxTo: 42,
          message: `Should be an URI.`,
          fix: null,
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - one unrecognised`,
  (t) => {
    const str = `<applet archive="abc.,def.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 17,
          idxTo: 21,
          message: `Should be an URI.`,
          fix: null,
        },
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 22,
          idxTo: 26,
          message: `Should be an URI.`,
          fix: null,
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - legit URI's but space-separated`,
  (t) => {
    const str = `<applet archive="https://codsen.com https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 35,
          idxTo: 36,
          message: `Bad whitespace.`,
          fix: null,
        },
      ],
      "14.02"
    );
    t.end();
  }
);

tap.test(`15 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - typos`, (t) => {
  const str = `<applet archive=",http://codsen.com, tralal. , ">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  // can fix:
  t.equal(
    applyFixes(str, messages),
    `<applet archive="http://codsen.com,tralal.">`,
    "15.01"
  );
  t.match(
    messages,
    [
      {
        idxFrom: 46,
        idxTo: 47,
        message: "Remove whitespace.",
        fix: {
          ranges: [[46, 47]],
        },
        ruleId: "attribute-validate-archive",
      },
      {
        idxFrom: 17,
        idxTo: 18,
        message: "Remove separator.",
        fix: {
          ranges: [[17, 18]],
        },
        ruleId: "attribute-validate-archive",
      },
      {
        idxFrom: 36,
        idxTo: 37,
        message: "Remove whitespace.",
        fix: {
          ranges: [[36, 37]],
        },
        ruleId: "attribute-validate-archive",
      },
      {
        idxFrom: 37,
        idxTo: 44,
        message: "Should be an URI.",
        fix: null,
        ruleId: "attribute-validate-archive",
      },
      {
        idxFrom: 44,
        idxTo: 45,
        message: "Remove whitespace.",
        fix: {
          ranges: [[44, 45]],
        },
        ruleId: "attribute-validate-archive",
      },
      {
        idxFrom: 45,
        idxTo: 46,
        message: "Remove separator.",
        fix: {
          ranges: [[45, 46]],
        },
        ruleId: "attribute-validate-archive",
      },
    ],
    "15.02"
  );
  t.end();
});

// 04. object tag
// -----------------------------------------------------------------------------

tap.test(`16 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - healthy`, (t) => {
  const str = `<object class='zz' archive='http://codsen.com https://detergent.io' id='yy aa'>`; // <-- notice single quotes
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "16.01");
  t.strictSame(messages, [], "16.02");
  t.end();
});

tap.test(
  `17 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - unrecognised URI`,
  (t) => {
    const str = `<object archive="tralala.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 17,
          idxTo: 25,
          message: `Should be an URI.`,
          fix: null,
        },
      ],
      "17.02"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - legit URI but comma-separated`,
  (t) => {
    const str = `<object archive="https://codsen.com,https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 17,
          idxTo: 56,
          message: `URI's should be separated with a single space.`,
          fix: null,
        },
      ],
      "18.02"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - legit URI but comma-separated`,
  (t) => {
    const str = `<object archive="https://codsen.com, https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2,
      },
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str, "19.01");
    t.match(
      messages,
      [
        {
          ruleId: "attribute-validate-archive",
          idxFrom: 35,
          idxTo: 36,
          message: `No commas.`,
          fix: null,
        },
      ],
      "19.02"
    );
    t.end();
  }
);
