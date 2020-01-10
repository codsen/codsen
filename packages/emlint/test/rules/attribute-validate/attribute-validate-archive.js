const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. validation
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 0`,
  t => {
    [`<applet>`, `<object>`].forEach(tag => {
      const linter = new Linter();
      const messages = linter.verify(tag, {
        rules: {
          "attribute-validate-archive": 0
        }
      });
      t.equal(applyFixes(tag, messages), tag);
      t.same(messages, []);
    });
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 1`,
  t => {
    [`<applet>`, `<object>`].forEach(tag => {
      const linter = new Linter();
      const messages = linter.verify(tag, {
        rules: {
          "attribute-validate-archive": 1
        }
      });
      t.equal(applyFixes(tag, messages), tag);
      t.same(messages, []);
    });
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - no archive, error level 2`,
  t => {
    [`<applet>`, `<object>`].forEach(tag => {
      const linter = new Linter();
      const messages = linter.verify(tag, {
        rules: {
          "attribute-validate-archive": 2
        }
      });
      t.equal(applyFixes(tag, messages), tag);
      t.same(messages, []);
    });
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy archive, applet`,
  t => {
    const str = `<applet class='zz' archive='https://codsen.com,https://detergent.io' id='yy aa'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${34}m${`validation`}\u001b[${39}m`} - healthy archive, object`,
  t => {
    const str = `<object class='zz' archive='https://codsen.com https://detergent.io' id='yy aa'>`; // <-- notice single quotes
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    t.equal(applyFixes(str, messages), str);
    t.same(messages, []);
    t.end();
  }
);

// 02. rogue whitespace
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space in front`,
  t => {
    const str = `<applet archive=" https://codsen.com">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    t.equal(applyFixes(str, messages), `<applet archive="https://codsen.com">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 17,
        idxTo: 18,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[17, 18]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - space after`,
  t => {
    const str = `<applet archive="https://codsen.com ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    t.equal(applyFixes(str, messages), `<applet archive="https://codsen.com">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 35,
        idxTo: 36,
        message: `Remove whitespace.`,
        fix: {
          ranges: [[35, 36]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - copious whitespace around - 6 digit object`,
  t => {
    const str = `<applet archive="  https://codsen.com  ">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    t.equal(applyFixes(str, messages), `<applet archive="https://codsen.com">`);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 17,
        idxTo: 39,
        message: `Remove whitespace.`,
        fix: {
          ranges: [
            [17, 19],
            [37, 39]
          ]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - only trimmable whitespace as a value`,
  t => {
    const str = `<applet archive="  \t">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 17,
        idxTo: 20,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${36}m${`whitespace`}\u001b[${39}m`} - empty value`,
  t => {
    const str = `<applet archive="">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 17,
        idxTo: 17,
        message: `Missing value.`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 03. applet tag
// -----------------------------------------------------------------------------

t.test(`03.01 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - healthy`, t => {
  const str = `<applet class='zz' archive='http://codsen.com,https://detergent.io' id='yy aa'>`; // <-- notice single quotes
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(
  `03.02 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - one unrecognised`,
  t => {
    const str = `<applet archive="http://codsen.com,trala..">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 35,
        idxTo: 42,
        message: `Should be an URI.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - one unrecognised`,
  t => {
    const str = `<applet archive="abc.,def.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 17,
        idxTo: 21,
        message: `Should be an URI.`,
        fix: null
      },
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 22,
        idxTo: 26,
        message: `Should be an URI.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - legit URI's but space-separated`,
  t => {
    const str = `<applet archive="https://codsen.com https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 35,
        idxTo: 36,
        message: `Bad whitespace.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(`03.05 - ${`\u001b[${35}m${`applet`}\u001b[${39}m`} - typos`, t => {
  const str = `<applet archive=",http://codsen.com, tralal. , ">`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2
    }
  });
  // can fix:
  t.equal(
    applyFixes(str, messages),
    `<applet archive="http://codsen.com,tralal.">`
  );
  t.match(messages, [
    {
      idxFrom: 46,
      idxTo: 47,
      message: "Remove whitespace.",
      fix: {
        ranges: [[46, 47]]
      },
      ruleId: "attribute-validate-archive"
    },
    {
      idxFrom: 17,
      idxTo: 18,
      message: "Remove separator.",
      fix: {
        ranges: [[17, 18]]
      },
      ruleId: "attribute-validate-archive"
    },
    {
      idxFrom: 36,
      idxTo: 37,
      message: "Remove whitespace.",
      fix: {
        ranges: [[36, 37]]
      },
      ruleId: "attribute-validate-archive"
    },
    {
      idxFrom: 37,
      idxTo: 44,
      message: "Should be an URI.",
      fix: null,
      ruleId: "attribute-validate-archive"
    },
    {
      idxFrom: 44,
      idxTo: 45,
      message: "Remove whitespace.",
      fix: {
        ranges: [[44, 45]]
      },
      ruleId: "attribute-validate-archive"
    },
    {
      idxFrom: 45,
      idxTo: 46,
      message: "Remove separator.",
      fix: {
        ranges: [[45, 46]]
      },
      ruleId: "attribute-validate-archive"
    }
  ]);
  t.end();
});

// 04. object tag
// -----------------------------------------------------------------------------

t.test(`04.01 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - healthy`, t => {
  const str = `<object class='zz' archive='http://codsen.com https://detergent.io' id='yy aa'>`; // <-- notice single quotes
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "attribute-validate-archive": 2
    }
  });
  t.equal(applyFixes(str, messages), str);
  t.same(messages, []);
  t.end();
});

t.test(
  `04.02 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - unrecognised URI`,
  t => {
    const str = `<object archive="tralala.">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 17,
        idxTo: 25,
        message: `Should be an URI.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - legit URI but comma-separated`,
  t => {
    const str = `<object archive="https://codsen.com,https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 17,
        idxTo: 56,
        message: `URI's should be separated with a single space.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${35}m${`object`}\u001b[${39}m`} - legit URI but comma-separated`,
  t => {
    const str = `<object archive="https://codsen.com, https://detergent.io">`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "attribute-validate-archive": 2
      }
    });
    // can't fix:
    t.equal(applyFixes(str, messages), str);
    t.match(messages, [
      {
        ruleId: "attribute-validate-archive",
        idxFrom: 35,
        idxTo: 36,
        message: `No commas.`,
        fix: null
      }
    ]);
    t.end();
  }
);
