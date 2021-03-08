import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// 01. "only" opening, "not" closing
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - off, missing dash`,
  (t) => {
    const str = `<!--[if mso]>
  <img src="fallback">
<!--<![endif]-->`;
    const messages = verify(t, str, {
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
  <span class="foo">z</span>
<!--<![endif]-->`;
    const fixed = `<!--[if mso]>
  <span class="foo">z</span>
<![endif]-->`;
    const messages = verify(t, str, {
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
          idxFrom: 43,
          idxTo: 59,
          message: `Remove "<!--".`,
          fix: {
            ranges: [[43, 59]],
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
  <span class="foo">z</span>
<!--<![endif]-->`;
    const fixed = `<!--[if mso]>
  <span class="foo">z</span>
<![endif]-->`;
    const messages = verify(t, str, {
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
          idxFrom: 44,
          idxTo: 60,
          keepSeparateWhenFixing: true,
          fix: {
            ranges: [[44, 60, "<![endif]-->"]],
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
  <span class="foo">z</span>
<!--<[endif]-->`;
    const fixed = `<!--[if mso]>
  <span class="foo">z</span>
<![endif]-->`;

    const messages = verify(t, str, {
      rules: {
        all: 2,
      },
    });
    t.match(
      messages,
      [
        {
          severity: 2,
          idxFrom: 43,
          idxTo: 58,
          message: "Malformed closing comment tag.",
          fix: {
            ranges: [[43, 58, "<!--<![endif]-->"]],
          },
          ruleId: "comment-closing-malformed",
        },
      ],
      "04.01"
    );
    t.equal(
      applyFixes(str, messages),
      `<!--[if mso]>
  <span class="foo">z</span>
<!--<![endif]-->`,
      "04.02"
    );

    const secondRoundMessages = verify(
      t,
      `<!--[if mso]>
  <span class="foo">z</span>
<!--<![endif]-->`,
      {
        rules: {
          all: 2,
        },
      }
    );
    t.match(
      secondRoundMessages,
      [
        {
          severity: 2,
          idxFrom: 43,
          idxTo: 59,
          message: `Remove "<!--".`,
          fix: {
            ranges: [[43, 59, "<![endif]-->"]],
          },
          ruleId: "comment-mismatching-pair",
        },
      ],
      "04.03"
    );
    t.equal(applyFixes(str, secondRoundMessages), fixed, "04.04");

    // turns tails comment tag into "only"-kind
    t.equal(
      applyFixes(applyFixes(str, messages), secondRoundMessages),
      fixed,
      "04.05"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - both tags are also dirty`,
  (t) => {
    const str = `<!-[if mso]>
  <span class="foo">z</span>
<!--<[endif]-->`;
    const fixed = `<!--[if mso]>
  <span class="foo">z</span>
<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        all: 2,
      },
    });
    const secondRoundMessages = verify(t, applyFixes(str, messages), {
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
  <span class="foo">z</span>
<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <span class="foo">z</span>
<!--<![endif]-->`;
    const messages = verify(t, str, {
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
          idxFrom: 49,
          idxTo: 61,
          fix: {
            ranges: [[49, 49, "<!--"]],
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
  <span class="foo">z</span>
<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <span class="foo">z</span>
<!--<![endif]-->`;
    const messages = verify(t, str, {
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
          idxFrom: 48,
          idxTo: 60,
          fix: {
            ranges: [[48, 48, "<!--"]],
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
  <span class="foo">z</span>
<[endif]-->`;
    const fixed = `<!--[if mso]><!-->
  <span class="foo">z</span>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        all: 2,
      },
    });
    const secondRoundMessages = verify(t, applyFixes(str, messages), {
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
  <span class="foo">z</span>
<[endif]-->`;
    const fixed = `<!--[if mso]><!-->
  <span class="foo">z</span>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        all: 2,
      },
    });
    const secondRoundMessages = verify(t, applyFixes(str, messages), {
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
