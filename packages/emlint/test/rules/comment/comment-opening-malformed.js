const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. type="simple"
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - excl. mark is missing, letter inside`,
  t => {
    const str = `<--z-->`;
    const fixed = `<!--z-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.01.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 3,
          message: `Malformed opening comment tag.`,
          fix: {
            ranges: [[0, 3, "<!--"]]
          }
        }
      ],
      "01.01.02"
    );
    t.is(messages.length, 1, "01.01.03");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - excl. mark is missing, tag inside`,
  t => {
    const str = `<--<img class="z"/>-->`;
    const fixed = `<!--<img class="z"/>-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 1
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.02.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 1,
          idxFrom: 0,
          idxTo: 3,
          message: `Malformed opening comment tag.`,
          fix: {
            ranges: [[0, 3, "<!--"]]
          }
        }
      ],
      "01.02.02"
    );
    t.is(messages.length, 1, "01.02.03");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 1st char, letter inside`,
  t => {
    const str = `.< !--z-->`;
    const fixed = `.<!--z-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.03.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 1,
          idxTo: 6,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[2, 3]]
          }
        }
      ],
      "01.03.02"
    );
    t.is(messages.length, 1, "01.03.03");
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 1st char, tag inside`,
  t => {
    const str = `< !--<img class="z"/>-->`;
    const fixed = `<!--<img class="z"/>-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.04.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 5,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[1, 2]]
          }
        }
      ],
      "01.04.02"
    );
    t.is(messages.length, 1, "01.04.03");
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 2nd char, letter inside`,
  t => {
    const str = `<! --z-->`;
    const fixed = `<!--z-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.05.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 5,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[2, 3]]
          }
        }
      ],
      "01.05.02"
    );
    t.is(messages.length, 1, "01.05.03");
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 2nd char, tag inside`,
  t => {
    const str = `<! --<img class="z"/>-->`;
    const fixed = `<!--<img class="z"/>-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.06.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 5,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[2, 3]]
          }
        }
      ],
      "01.06.02"
    );
    t.is(messages.length, 1, "01.06.03");
    t.end();
  }
);

t.test(
  `01.07 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 3rd char, letter inside`,
  t => {
    const str = `<!- -z-->`;
    const fixed = `<!--z-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.07.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 5,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[3, 4]]
          }
        }
      ],
      "01.07.02"
    );
    t.is(messages.length, 1, "01.07.03");
    t.end();
  }
);

t.test(
  `01.08 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 3rd char, tag inside`,
  t => {
    const str = `<!- -<img class="z"/>-->`;
    const fixed = `<!--<img class="z"/>-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "01.08.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 5,
          message: `Remove whitespace.`,
          fix: {
            ranges: [[3, 4]]
          }
        }
      ],
      "01.08.02"
    );
    t.is(messages.length, 1, "01.08.03");
    t.end();
  }
);

// 02. type="only"
// -----------------------------------------------------------------------------

// 03. type="not"
// -----------------------------------------------------------------------------

t.todo(
  `03.01 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - second part of the opening is missing`,
  t => {
    // should be <!--[if !mso><!-->
    const str = `<!--[if !mso]>
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.01.01");
    t.match(messages, [], "03.01.02");
    t.end();
  }
);

t.todo(
  `03.02 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing square closing bracket`,
  t => {
    const str = `<!--[if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.02.01");
    t.match(messages, [], "03.02.02");
    t.end();
  }
);

t.todo(
  `03.03 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - excessive whitespace`,
  t => {
    const str = `<!--  [if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "03.03.01");
    t.match(messages, [], "03.03.02");
    t.end();
  }
);

t.todo(
  `03.04 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing dash on the first part`,
  t => {
    const str = `<!-[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "03.04.01");
    t.match(messages, [], "03.04.02");
    t.end();
  }
);

t.todo(
  `03.05 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing dash on the second part`,
  t => {
    const str = `<!--[if !mso]><!->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
<img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "03.05.01");
    t.match(messages, [], "03.05.02");
    t.end();
  }
);

t.todo(
  `03.06 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - rogue character in the second part`,
  t => {
    const str = `<!--[if !mso]><!--z>
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.06.01");
    t.match(messages, [], "03.06.02");
    t.end();
  }
);

t.todo(
  `03.07 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - whitespace between parts`,
  t => {
    const str = `<!--[if !mso]>\n\n<!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "03.07.01");
    t.match(messages, [], "03.07.02");
    t.end();
  }
);

t.todo(
  `03.08 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - first part missing`,
  t => {
    const str = `<!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.08.01");
    t.match(messages, [], "03.08.02");
    t.end();
  }
);

t.todo(
  `03.09 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - rounded brackets`,
  t => {
    const str = `<!--(if !mso)><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.09.01");
    t.match(messages, [], "03.09.02");
    t.end();
  }
);

t.todo(
  `03.10 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - no brackets`,
  t => {
    const str = `<!--if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.10.01");
    t.match(messages, [], "03.10.02");
    t.end();
  }
);

t.todo(
  `03.11 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - another comment follows, minimal`,
  t => {
    const str = `<!--[if !mso><!--><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.11.01");
    t.match(messages, [], "03.11.02");
    t.end();
  }
);

t.todo(
  `03.12 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - another comment follows, letter`,
  t => {
    const str = `<!--[if !mso><!--><!--z-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.12.01");
    t.match(messages, [], "03.12.02");
    t.end();
  }
);

t.todo(
  `03.13 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - second part is full empty comment`,
  t => {
    const str = `<!--[if !mso><!---->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.13.01");
    t.match(messages, [], "03.13.02");
    t.end();
  }
);

t.todo(`03.14 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - TBC`, t => {
  const str = `<!--[if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "comment-opening-malformed": 2
    }
  });
  t.equal(applyFixes(str, messages), str, "03.14.01");
  t.match(messages, [], "03.14.02");
  t.end();
});

t.todo(
  `03.15 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - second part is missing excl mark`,
  t => {
    const str = `<!--[if !mso><-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.15.01");
    t.match(messages, [], "03.15.02");
    t.end();
  }
);

// ensure that tails are not raising issues for the head!
t.todo(
  `03.16 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - empty healthy outlook conditional`,
  t => {
    const str = `<!--[if !mso><!-->
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-opening-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.15.01");
    t.match(messages, [], "03.15.02");
    t.end();
  }
);
