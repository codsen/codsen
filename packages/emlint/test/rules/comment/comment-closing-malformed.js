import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util.js";

// 01. type="simple"
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - off, missing dash`,
  (t) => {
    const str = "<!--z->";
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - error, missing dash, text inside`,
  (t) => {
    const str = "<!--z->";
    const fixed = "<!--z-->";
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "02.01");
    t.strictSame(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          line: 1,
          column: 6,
          severity: 2,
          idxFrom: 5,
          idxTo: 7,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[5, 7, "-->"]],
          },
          keepSeparateWhenFixing: true,
        },
      ],
      "02.02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - error, missing dash, tag inside`,
  (t) => {
    const str = `<!--<img class="z"/>->`;
    const fixed = `<!--<img class="z"/>-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "03.01");
    t.strictSame(
      messages,
      [
        {
          line: 1,
          column: 21,
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 20,
          idxTo: 22,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[20, 22, "-->"]],
          },
          keepSeparateWhenFixing: true,
        },
      ],
      "03.02"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space`,
  (t) => {
    const str = `<!--<img class="z"/>-- >`;
    const fixed = `<!--<img class="z"/>-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "04.01");
    t.strictSame(
      messages,
      [
        {
          line: 1,
          column: 21,
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 20,
          idxTo: 24,
          message: "Remove whitespace.",
          fix: {
            ranges: [[22, 23]],
          },
          keepSeparateWhenFixing: true,
        },
      ],
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue excl mark`,
  (t) => {
    const str = `<!--<img class="z"/>--!>`;
    const fixed = `<!--<img class="z"/>-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "05.01");
    t.strictSame(
      messages,
      [
        {
          line: 1,
          column: 21,
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 20,
          idxTo: 24,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[20, 24, "-->"]],
          },
          keepSeparateWhenFixing: true,
        },
      ],
      "05.02"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue single character, z`,
  (t) => {
    const str = `<!--<img class="z"/>--z>`;
    const fixed = `<!--<img class="z"/>-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "06.01");
    t.strictSame(
      messages,
      [
        {
          line: 1,
          column: 21,
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 20,
          idxTo: 24,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[20, 24, "-->"]],
          },
          keepSeparateWhenFixing: true,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

// 02. type="only"
// -----------------------------------------------------------------------------

// For your reference:

// <!--[if mso]>
//     <img src="fallback">
// <![endif]-->

tap.test(
  `07 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - off, excl mark missing`,
  (t) => {
    const str = "<!--[if mso]>x<[endif]-->";
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "07.01");
    t.strictSame(messages, [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - error level, excl mark missing`,
  (t) => {
    const str = "<!--[if mso]>x<[endif]-->";
    const fixed = "<!--[if mso]>x<![endif]-->";
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "08.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 14,
          idxTo: 25,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[14, 25, "<![endif]-->"]],
          },
        },
      ],
      "08.02"
    );
    t.is(messages.length, 1, "08.03");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - 1 instead of !`,
  (t) => {
    const str = "<!--[if mso]>x<1[endif]-->";
    const fixed = "<!--[if mso]>x<![endif]-->";
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 14,
          idxTo: 26,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[14, 26, "<![endif]-->"]],
          },
        },
      ],
      "09.02"
    );
    t.is(messages.length, 1, "09.03");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - 1 instead of !`,
  (t) => {
    const str = "<!--[if mso]>x<![ndif]-->";
    const fixed = "<!--[if mso]>x<![endif]-->";
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 14,
          idxTo: 25,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[14, 25, "<![endif]-->"]],
          },
        },
      ],
      "10.02"
    );
    t.is(messages.length, 1, "10.03");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - closing bracket missing, tag follows, tight`,
  (t) => {
    const str = "<!--[if mso]>x<![endif]--<a>";
    const fixed = "<!--[if mso]>x<![endif]--><a>";
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "11.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          idxFrom: 14,
          idxTo: 25,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[14, 25, "<![endif]-->"]],
          },
          ruleId: "comment-closing-malformed",
        },
      ],
      "11.02"
    );
    t.is(messages.length, 1, "11.03");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`type: only`}\u001b[${39}m`} - closing bracket missing, tag follows, spaced`,
  (t) => {
    const str = "<!--[if mso]>x<![endif]--\n\n<a>";
    const fixed = "<!--[if mso]>x<![endif]-->\n\n<a>";
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "12.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          idxFrom: 14,
          idxTo: 25,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[14, 25, "<![endif]-->"]],
          },
          ruleId: "comment-closing-malformed",
        },
      ],
      "12.02"
    );
    t.is(messages.length, 1, "12.03");
    t.end();
  }
);

// 03. type="not"
// -----------------------------------------------------------------------------

// For your reference:

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->

tap.test(
  `13 - ${`\u001b[${31}m${`type: not`}\u001b[${39}m`} - bracket missing`,
  (t) => {
    const str = `<!--[if !mso]><!--><img src="gif"/>!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "character-unspaced-punctuation": 2,
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "13.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 35,
          idxTo: 50,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[35, 50, "<!--<![endif]-->"]],
          },
        },
      ],
      "13.02"
    );
    t.is(messages.length, 1, "13.03");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${31}m${`type: not`}\u001b[${39}m`} - excml mark missing`,
  (t) => {
    const str = `<!--[if !mso]><!--><img src="gif"/><--<![endif]-->`;
    const fixed = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "14.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 35,
          idxTo: 50,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[35, 50, "<!--<![endif]-->"]],
          },
        },
      ],
      "14.02"
    );
    t.is(messages.length, 1, "14.03");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${31}m${`type: not`}\u001b[${39}m`} - dash missing`,
  (t) => {
    const str = `<!--[if !mso]><!--><img src="gif"/><!-<![endif]-->`;
    const fixed = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-closing-malformed",
          severity: 2,
          idxFrom: 35,
          idxTo: 50,
          message: `Malformed closing comment tag.`,
          fix: {
            ranges: [[35, 50, "<!--<![endif]-->"]],
          },
        },
      ],
      "15.02"
    );
    t.is(messages.length, 1, "15.03");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${31}m${`type: not`}\u001b[${39}m`} - rogue space`,
  (t) => {
    const str = `<!--[if !mso]><!--><img src="gif"/><!- -<![endif]-->`;
    const fixed = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 1,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "16.01");
    t.match(
      messages,
      [
        {
          severity: 1,
          ruleId: "comment-closing-malformed",
          idxFrom: 35,
          idxTo: 52,
          message: "Remove whitespace.",
          fix: {
            ranges: [[38, 39]],
          },
        },
      ],
      "16.02"
    );
    t.is(messages.length, 1, "16.03");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${31}m${`type: not`}\u001b[${39}m`} - rogue linebreak`,
  (t) => {
    const str = `<!--[if !mso]><!--><img src="gif"/><!--\n<![endif]-->`;
    const fixed = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "17.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          ruleId: "comment-closing-malformed",
          idxFrom: 35,
          idxTo: 52,
          message: "Remove whitespace.",
          fix: {
            ranges: [[39, 40]],
          },
        },
      ],
      "17.02"
    );
    t.is(messages.length, 1, "17.03");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${31}m${`type: not`}\u001b[${39}m`} - really messed up closing tag`,
  (t) => {
    const str = `<!--[if !mso]><!--><br /><!--<[endif]-->`;
    const fixed = `<!--[if !mso]><!--><br /><!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        all: 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${31}m${`type: not`}\u001b[${39}m`} - opening bracket missing`,
  (t) => {
    const str = `<!--[if !mso]><!--><br /><!--<!endif]-->`;
    const fixed = `<!--[if !mso]><!--><br /><!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "19.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          idxFrom: 25,
          idxTo: 40,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[25, 40, "<!--<![endif]-->"]],
          },
          ruleId: "comment-closing-malformed",
        },
      ],
      "19.02"
    );
    t.is(messages.length, 1, "19.03");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${31}m${`type: not`}\u001b[${39}m`} - misspelled endif`,
  (t) => {
    const str = `<!--[if !mso]><!--><img src="gif"/><!--<![ndif]-->`;
    const fixed = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-closing-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "20.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          idxFrom: 35,
          idxTo: 50,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[35, 50, "<!--<![endif]-->"]],
          },
          ruleId: "comment-closing-malformed",
        },
      ],
      "20.02"
    );
    t.is(messages.length, 1, "20.03");
    t.end();
  }
);
