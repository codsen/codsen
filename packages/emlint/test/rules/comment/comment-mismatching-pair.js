import tap from "tap";
import { Linter } from "../../../dist/emlint.esm";
import { applyFixes } from "../../../t-util/util";

// 01. "only" opening, "not" closing
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - off, missing dash`,
  (t) => {
    const str = `<!--[if mso]>
  <img src="fallback">
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-mismatching-pair": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - both tags are healthy`,
  (t) => {
    const str = `<!--[if mso]>
  <img src="fallback"/>
<!--<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="fallback"/>
<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-mismatching-pair": 1,
      },
    });
    // turns tails comment tag into "only"-kind
    t.equal(applyFixes(str, messages), fixed, "02.01");
    t.match(
      messages,
      [
        {
          severity: 1,
          ruleId: "comment-mismatching-pair",
          idxFrom: 38,
          idxTo: 54,
          message: `Remove "<!--".`,
          fix: {
            ranges: [[38, 54]],
          },
        },
      ],
      "02.02"
    );
    t.is(messages.length, 1, "02.03");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - heads tag is also dirty`,
  (t) => {
    const str = `<!-- [if mso]>
  <img src="fallback"/>
<!--<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="fallback"/>
<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        // all: 1,
        "comment-opening-malformed": 1,
        "comment-mismatching-pair": 1,
      },
    });
    // turns tails comment tag into "only"-kind
    t.match(
      messages,
      [
        {
          severity: 1,
          idxFrom: 0,
          idxTo: 14,
          message: "Malformed opening comment tag.",
          fix: {
            ranges: [[0, 6, "<!--["]],
          },
          ruleId: "comment-opening-malformed",
        },
        {
          severity: 1,
          ruleId: "comment-mismatching-pair",
          message: 'Remove "<!--".',
          idxFrom: 39,
          idxTo: 55,
          keepSeparateWhenFixing: true,
          fix: {
            ranges: [[39, 55, "<![endif]-->"]],
          },
        },
      ],
      "03.01"
    );
    t.equal(applyFixes(str, messages), fixed, "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - tails tag is also dirty`,
  (t) => {
    const str = `<!--[if mso]>
  <img src="fallback"/>
<!--<[endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="fallback"/>
<![endif]-->`;
    const linter = new Linter();

    const messages = linter.verify(str, {
      rules: {
        all: 2,
      },
    });
    t.match(messages, [
      {
        severity: 2,
        idxFrom: 38,
        idxTo: 53,
        message: "Malformed closing comment tag.",
        fix: {
          ranges: [[38, 53, "<!--<![endif]-->"]],
        },
        ruleId: "comment-closing-malformed",
      },
    ]);
    t.equal(
      applyFixes(str, messages),
      `<!--[if mso]>
  <img src="fallback"/>
<!--<![endif]-->`,
      "03.02"
    );

    const secondRoundMessages = linter.verify(
      `<!--[if mso]>
  <img src="fallback"/>
<!--<![endif]-->`,
      {
        rules: {
          all: 2,
        },
      }
    );
    t.match(secondRoundMessages, [
      {
        severity: 2,
        idxFrom: 38,
        idxTo: 54,
        message: `Remove "<!--".`,
        fix: {
          ranges: [[38, 54, "<![endif]-->"]],
        },
        ruleId: "comment-mismatching-pair",
      },
    ]);
    t.equal(applyFixes(str, secondRoundMessages), fixed, "03.02");

    // turns tails comment tag into "only"-kind
    t.equal(
      applyFixes(applyFixes(str, messages), secondRoundMessages),
      fixed,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - both tags are also dirty`,
  (t) => {
    const str = `<!-[if mso]>
  <img src="fallback"/>
<!--<[endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="fallback"/>
<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        all: 2,
      },
    });
    const secondRoundMessages = linter.verify(applyFixes(str, messages), {
      rules: {
        all: 2,
      },
    });
    // turns tails comment tag into "only"-kind
    t.equal(
      applyFixes(applyFixes(str, messages), secondRoundMessages),
      fixed,
      "05"
    );
    t.end();
  }
);

// 02. "not" opening, "only" closing
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${36}m${`"not" opening, "only" closing`}\u001b[${39}m`} - both tags are healthy`,
  (t) => {
    const str = `<!--[if !mso]><!-->
  <img src="fallback"/>
<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="fallback"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-mismatching-pair": 2,
      },
    });
    // turns tails comment tag into "not"-kind
    t.equal(applyFixes(str, messages), fixed, "06.01");
    t.strictSame(
      messages,
      [
        {
          line: 3,
          column: 1,
          severity: 2,
          ruleId: "comment-mismatching-pair",
          message: 'Add "<!--".',
          idxFrom: 44,
          idxTo: 56,
          fix: {
            ranges: [[44, 44, "<!--"]],
          },
          keepSeparateWhenFixing: true,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`"not" opening, "only" closing`}\u001b[${39}m`} - heads tag is also dirty`,
  (t) => {
    const str = `<!-[if !mso]><!-->
  <img src="fallback"/>
<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="fallback"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        all: 2,
      },
    });
    // turns tails comment tag into "not"-kind
    t.equal(applyFixes(str, messages), fixed, "07.01");
    t.match(
      messages,
      [
        {
          line: 1,
          severity: 2,
          idxFrom: 0,
          idxTo: 18,
          message: "Malformed opening comment tag.",
          fix: {
            ranges: [[0, 4, "<!--["]],
          },
          ruleId: "comment-opening-malformed",
        },
        {
          line: 3,
          severity: 2,
          ruleId: "comment-mismatching-pair",
          message: 'Add "<!--".',
          idxFrom: 43,
          idxTo: 55,
          fix: {
            ranges: [[43, 43, "<!--"]],
          },
        },
      ],
      "07.02"
    );
    t.is(messages.length, 2, "07.03");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`"not" opening, "only" closing`}\u001b[${39}m`} - tails tag is also dirty`,
  (t) => {
    const str = `<!--[if mso]><!-->
  <img src="fallback"/>
<[endif]-->`;
    const fixed = `<!--[if mso]><!-->
  <img src="fallback"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        all: 2,
      },
    });
    const secondRoundMessages = linter.verify(applyFixes(str, messages), {
      rules: {
        all: 2,
      },
    });
    // turns tails comment tag into "only"-kind
    t.equal(
      applyFixes(applyFixes(str, messages), secondRoundMessages),
      fixed,
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`"not" opening, "only" closing`}\u001b[${39}m`} - both tags are also dirty`,
  (t) => {
    const str = `<!-[if mso]><!-->
  <img src="fallback"/>
<[endif]-->`;
    const fixed = `<!--[if mso]><!-->
  <img src="fallback"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        all: 2,
      },
    });
    const secondRoundMessages = linter.verify(applyFixes(str, messages), {
      rules: {
        all: 2,
      },
    });
    // turns tails comment tag into "only"-kind
    t.equal(
      applyFixes(applyFixes(str, messages), secondRoundMessages),
      fixed,
      "09"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------

// For a reference:
// ===============

// a<!--b-->c

// abc<!--[if gte mso 9]><xml>
// <o:OfficeDocumentSettings>
// <o:AllowPNG/>
// <o:PixelsPerInch>96</o:PixelsPerInch>
// </o:OfficeDocumentSettings>
// </xml><![endif]-->def

// <!--[if mso]>
//     <img src="fallback">
// <![endif]-->

// <!--[if !mso]><!-->
//     <img src="gif">
// <!--<![endif]-->
