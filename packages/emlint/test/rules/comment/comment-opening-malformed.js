import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// 01. type="simple"
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - excl. mark is missing, letter inside`,
  (t) => {
    const str = `<--z-->`;
    const fixed = `<!--z-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "01.01");
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
            ranges: [[0, 3, "<!--"]],
          },
        },
      ],
      "01.02"
    );
    t.is(messages.length, 1, "01.03");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - excl. mark is missing, tag inside`,
  (t) => {
    const str = `<--<img class="z"/>-->`;
    const fixed = `<!--<img class="z"/>-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 1,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "02.01");
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
            ranges: [[0, 3, "<!--"]],
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
  `03 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 1st char, letter inside`,
  (t) => {
    const str = `.< !--z-->`;
    const fixed = `.<!--z-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "03.01");
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
            ranges: [[2, 3]],
          },
        },
      ],
      "03.02"
    );
    t.is(messages.length, 1, "03.03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 1st char, tag inside`,
  (t) => {
    const str = `< !--<img class="z"/>-->`;
    const fixed = `<!--<img class="z"/>-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "04.01");
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
            ranges: [[1, 2]],
          },
        },
      ],
      "04.02"
    );
    t.is(messages.length, 1, "04.03");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 2nd char, letter inside`,
  (t) => {
    const str = `<! --z-->`;
    const fixed = `<!--z-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "05.01");
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
            ranges: [[2, 3]],
          },
        },
      ],
      "05.02"
    );
    t.is(messages.length, 1, "05.03");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 2nd char, tag inside`,
  (t) => {
    const str = `<! --<img class="z"/>-->`;
    const fixed = `<!--<img class="z"/>-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "06.01");
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
            ranges: [[2, 3]],
          },
        },
      ],
      "06.02"
    );
    t.is(messages.length, 1, "06.03");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 3rd char, letter inside`,
  (t) => {
    const str = `<!- -z-->`;
    const fixed = `<!--z-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "07.01");
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
            ranges: [[3, 4]],
          },
        },
      ],
      "07.02"
    );
    t.is(messages.length, 1, "07.03");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`type: simple`}\u001b[${39}m`} - rogue space after 3rd char, tag inside`,
  (t) => {
    const str = `<!- -<img class="z"/>-->`;
    const fixed = `<!--<img class="z"/>-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "08.01");
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
            ranges: [[3, 4]],
          },
        },
      ],
      "08.02"
    );
    t.is(messages.length, 1, "08.03");
    t.end();
  }
);

// 02. type="only"
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - missing dash`,
  (t) => {
    const str = `<!-[if mso]>
  <img src="z"/>
<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "09.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 12,
          message: `Malformed opening comment tag.`,
          fix: {
            ranges: [[0, 4, "<!--["]],
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
  `10 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - opening bracket missing`,
  (t) => {
    const str = `<!--if mso]>
  <img src="z"/>
<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "10.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 12,
          message: `Malformed opening comment tag.`,
          fix: {
            ranges: [[0, 4, "<!--["]],
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
  `11 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - missing closing bracket`,
  (t) => {
    const str = `<!--[if mso>
  <img src="z"/>
<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "11.01");
    t.is(messages.length, 1, "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - messed up ending - swapped characters > and ]`,
  (t) => {
    const str = `<!--[if mso>]
  <img src="z"/>
<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "12.01");
    t.is(messages.length, 1, "12.02");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - rounded brackets`,
  (t) => {
    const str = `<!--(if mso)>
  <img src="z"/>
<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`type: only`}\u001b[${39}m`} - curly brackets`,
  (t) => {
    const str = `<!--{if mso}>
  <img src="z"/>
<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="z"/>
<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "14");
    t.end();
  }
);

// 03. type="not"
// -----------------------------------------------------------------------------

tap.test(
  `15 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing square closing bracket`,
  (t) => {
    const str = `<!--[if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "15.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 18,
          message: `Malformed opening comment tag.`,
          fix: {
            ranges: [[12, 18, "]><!-->"]],
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
  `16 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - excessive whitespace`,
  (t) => {
    const str = `<!--  [if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "16.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 21,
          message: `Malformed opening comment tag.`,
          fix: {
            ranges: [[0, 7, "<!--["]],
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
  `17 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing dash on the first part`,
  (t) => {
    const str = `<!-[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "17.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 18,
          message: `Malformed opening comment tag.`,
          fix: {
            ranges: [[0, 4, "<!--["]],
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
  `18 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing dash on the second part`,
  (t) => {
    const str = `<!--[if !mso]><!->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "18.01");
    t.match(
      messages,
      [
        {
          ruleId: "comment-opening-malformed",
          severity: 2,
          idxFrom: 0,
          idxTo: 18,
          message: `Malformed opening comment tag.`,
          fix: {
            ranges: [[12, 18, "]><!-->"]],
          },
        },
      ],
      "18.02"
    );
    t.is(messages.length, 1, "18.03");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - rogue character in the second part`,
  (t) => {
    const str = `<!--[if !mso]><!--z>
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "19.01");
    t.is(messages.length, 1, "19.02");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - whitespace between parts`,
  (t) => {
    const str = `<!--[if !mso]>\n\n<!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "20.01");
    t.is(messages.length, 1, "20.02");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - empty healthy outlook conditional`,
  (t) => {
    const str = `<!--[if !mso]><!-->
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "21.01");
    t.strictSame(messages, [], "21.02");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - rounded brackets`,
  (t) => {
    const str = `<!--(if !mso)><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "22");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - curly brackets`,
  (t) => {
    const str = `<!--{if !mso}><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "23");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - second part is missing excl mark`,
  (t) => {
    const str = `<!--[if !mso]><-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "24.01");
    t.is(messages.length, 1, "24.02");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - no brackets`,
  (t) => {
    const str = `<!--if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "25");
    t.end();
  }
);

tap.todo(
  `26 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - another comment follows, minimal`,
  (t) => {
    const str = `<!--[if !mso]><!--><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "26");
    t.end();
  }
);

tap.todo(
  `27 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - expanded notation, without space`,
  (t) => {
    const str = `<!--[if !mso]><!---->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "27.01");
    t.match(messages, [], "27.02");
    t.end();
  }
);

tap.todo(
  `28 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - expanded notation, with space`,
  (t) => {
    const str = `<!--[if !mso]><!-- -->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "28.01");
    t.match(messages, [], "28.02");
    t.end();
  }
);

tap.todo(
  `29 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - expanded notation, with space and tab`,
  (t) => {
    const str = `<!--[if !mso]><!--\t -->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "29.01");
    t.match(messages, [], "29.02");
    t.end();
  }
);

// 04. various cases
// -----------------------------------------------------------------------------

tap.test(
  `30 - ${`\u001b[${34}m${`various`}\u001b[${39}m`} - another comment follows, letter`,
  (t) => {
    const str = `<!--[if !mso><!--><!--z-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!--><!--z-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
        "comment-conditional-nested": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "30.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          idxFrom: 0,
          idxTo: 18,
          message: "Malformed opening comment tag.",
          fix: {
            ranges: [[12, 18, "]><!-->"]],
          },
          ruleId: "comment-opening-malformed",
        },
        {
          severity: 2,
          ruleId: "comment-conditional-nested",
          message: "Don't nest comments.",
          idxFrom: 18,
          idxTo: 22,
          fix: null,
        },
        {
          severity: 2,
          ruleId: "comment-conditional-nested",
          message: "Don't nest comments.",
          idxFrom: 23,
          idxTo: 26,
          fix: null,
        },
      ],
      "30.02"
    );
    t.end();
  }
);

tap.todo(
  `31 - ${`\u001b[${34}m${`various`}\u001b[${39}m`} - first part missing`,
  (t) => {
    const str = `<!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const messages = verify(t, str, {
      rules: {
        "comment-opening-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "31.01");
    t.match(messages, [], "31.02");
    t.end();
  }
);
