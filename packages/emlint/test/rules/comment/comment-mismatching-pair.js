const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. "only" opening, "not" closing
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - off, missing dash`,
  t => {
    const str = `<!--[if mso]>
  <img src="fallback">
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-mismatching-pair": 0
      }
    });
    t.equal(applyFixes(str, messages), str, "01.01.01");
    t.same(messages, [], "01.01.02");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${35}m${`"only" opening, "not" closing`}\u001b[${39}m`} - both tags are healthy`,
  t => {
    const str = `<!--[if mso]>
  <img src="fallback">
<!--<![endif]-->`;
    const fixed = `<!--[if mso]>
  <img src="fallback">
<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-mismatching-pair": 1
      }
    });
    // turns tails comment tag into "only"-kind
    t.equal(applyFixes(str, messages), fixed, "01.02.01");
    t.match(
      messages,
      [
        {
          severity: 1,
          ruleId: "comment-mismatching-pair",
          idxFrom: 37,
          idxTo: 53,
          message: `Remove "<!--".`,
          fix: {
            ranges: [[37, 53]]
          }
        }
      ],
      "01.02.02"
    );
    t.end();
  }
);

t.todo("heads tag is also dirty");
t.todo("tails tag is also dirty");
t.todo("both tags are also dirty");

// 02. "not" opening, "only" closing
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`"not" opening, "only" closing`}\u001b[${39}m`} - both tags are healthy`,
  t => {
    const str = `<!--[if !mso]><!-->
  <img src="fallback">
<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="fallback">
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-mismatching-pair": 2
      }
    });
    // turns tails comment tag into "not"-kind
    t.equal(applyFixes(str, messages), fixed, "02.01.01");
    t.match(
      messages,
      [
        {
          severity: 2,
          ruleId: "comment-mismatching-pair",
          idxFrom: 43,
          idxTo: 55,
          message: `Add "<!--".`,
          fix: {
            ranges: [[43, 43]]
          }
        }
      ],
      "02.01.02"
    );
    t.end();
  }
);

t.todo("heads tag is also dirty");
t.todo("tails tag is also dirty");
t.todo("both tags are also dirty");

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
